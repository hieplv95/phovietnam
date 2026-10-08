// Imports the rendered pages of phovietnam.es (WordPress + Elementor) into
// content/pages/*.json and copies every asset they use from the local
// WordPress source into public/. Run with:  npm run import
//
//   WP_DIR    path to the WordPress root (default: ~/Downloads/cgi-bin)
//   WP_ORIGIN live site to read rendered HTML from (default: https://phovietnam.es)
//   --cached  reuse HTML in .wp-cache/ instead of fetching again

import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { execFileSync } from "node:child_process";
import * as cheerio from "cheerio";
import sharp from "sharp";
import { applyFixes } from "./fixes.mjs";
import { applySeo, derivedImages } from "./seo.mjs";
import { translateToEnglish } from "./en.mjs";

const ROOT = path.resolve(import.meta.dirname, "..");
const WP_DIR = process.env.WP_DIR || path.join(os.homedir(), "Downloads", "cgi-bin");
const ORIGIN = (process.env.WP_ORIGIN || "https://phovietnam.es").replace(/\/$/, "");
const CACHE = path.join(ROOT, ".wp-cache");
const OUT = path.join(ROOT, "content", "pages");
const PUBLIC = path.join(ROOT, "public");
const USE_CACHE = process.argv.includes("--cached");
// Files linked from the site that live in the WordPress root, not wp-content.
const ROOT_FILES = ["menu-pho-vietnam-.pdf"];
// PDFs above this size get re-rendered by scripts/compress-pdf.mjs.
const MAX_PDF_BYTES = 10 * 1024 * 1024;
// Wider images are downscaled in place (the logo was uploaded at 33072px).
const MAX_IMAGE_WIDTH = 2400;
// Images shown much smaller than any generic limit.
const IMAGE_WIDTH_OVERRIDES = {
  "/wp-content/uploads/2025/06/logo-ko-nen.png": 720, // shown at 180px
};

// Pages that belong to the real site. The theme's demo pages (about, contact,
// tea-drinks-menu, shop, ...) are redirected in next.config.ts instead.
const PAGES = [
  "/",
  "/blog/",
  "/newsletter/",
  "/politica-de-cookies/",
  "/declaracion-de-privacidad/",
  "/reserva-mesa/",
  "/comida-norte-sur-centro-vietnam/",
  "/donde-se-come-mejor-en-vietnam/",
  "/lugares-visitar-en-vietnam/",
  "/cultura-culinaria-de-vietnam/",
  "/que-es-pho/",
  "/cafe-de-filtro-vietnamita/",
  "/la-comida-callejera-de-vietnam/",
  "/gastronomia-vietnamita/",
  "/platos-vietnamitas/",
];
const NOT_FOUND_PROBE = "/__pagina-inexistente__/";

// Scripts/styles that only work against a live WordPress backend.
const DROP_IDS = [
  /^contact-form-7/, /^swv-js/, /^wp-hooks-js/, /^wp-i18n-js/, /^url-shortify/,
  /^underscore-js/, /^backbone-js/, /^wp-api/, /^loftocean-post-metas/,
  /^akismet/, /^comment-reply/, /^wp-emoji/,
];
const DROP_SRC = [/url-shortify/, /contact-form-7/, /wp-emoji-release/];

const siteRe = new RegExp(escapeRe(ORIGIN) + "/", "g");
const siteReEscaped = new RegExp(escapeRe(ORIGIN.replace(/\//g, "\\/")) + "\\\\/", "g");
const assets = new Set();

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function relativize(s) {
  return s.replace(siteRe, "/").replace(siteReEscaped, "\\/");
}

async function getHtml(urlPath) {
  const file = path.join(CACHE, (urlPath.replace(/\//g, "_") || "_") + ".html");
  if (USE_CACHE && fs.existsSync(file)) return fs.readFileSync(file, "utf8");
  const res = await fetch(ORIGIN + urlPath, {
    headers: { "user-agent": "Mozilla/5.0 (phovietnam-import)" },
    redirect: "follow",
  });
  if (!res.ok && urlPath !== NOT_FOUND_PROBE) throw new Error(`${urlPath}: HTTP ${res.status}`);
  const html = await res.text();
  fs.mkdirSync(CACHE, { recursive: true });
  fs.writeFileSync(file, html);
  return html;
}

function shouldDrop($el) {
  const id = $el.attr("id") || "";
  const src = $el.attr("src") || $el.attr("href") || "";
  return DROP_IDS.some((r) => r.test(id)) || DROP_SRC.some((r) => r.test(src));
}

function collectAssets(text) {
  // Also matches JSON-escaped (\/) and HTML-encoded (&quot;) URLs in data-* attributes.
  const re = /(?:^|["'(\s,=;])\\?\/(wp-content|wp-includes)((?:\\?\/[^"'()\s,?#<>\\&]+)+)/g;
  let m;
  while ((m = re.exec(text))) {
    const p = ("/" + m[1] + m[2]).replace(/\\\//g, "/");
    assets.add(decodeURIComponent(p));
  }
}

// Head elements that only make sense on a live WordPress install.
const DROP_HEAD = [
  'link[rel="profile"]', 'link[rel="https://api.w.org/"]', 'link[rel="EditURI"]', 'link[rel="shortlink"]',
  'link[rel="alternate"]', 'meta[name="generator"]', 'meta[name="msapplication-TileImage"]',
].join(", ");
// Head elements whose absolute URLs must stay absolute (SEO / social cards).
const KEEP_ABSOLUTE = 'link[rel="canonical"], link[rel="alternate"][hreflang], meta[property^="og:"], meta[property^="article:"], meta[name^="twitter:"], script[type="application/ld+json"]';

function convertPage(html, urlPath, { english = false } = {}) {
  const $ = cheerio.load(html);
  const modified =
    $('meta[property="article:modified_time"]').attr("content") ||
    $('meta[property="article:published_time"]').attr("content") ||
    null;

  $(DROP_HEAD).remove();
  $("script, link, style").each((_, el) => {
    const $el = $(el);
    if (shouldDrop($el) || $el.attr("type") === "speculationrules") $el.remove();
    else if (el.tagName === "script" && /wp-emoji/.test($el.html() || "")) $el.remove();
    else if (el.tagName === "style" && /shorten_url|a-stats/.test($el.html() || "")) $el.remove();
  });
  // Comments are closed (only unapproved spam exists): drop the form/area.
  $("#comments, .comments-area, #respond").remove();
  applyFixes($);
  if (english) translateToEnglish($);
  applySeo($, urlPath);

  // Protect SEO tags from relativize() by swapping them for placeholders.
  const kept = [];
  $(KEEP_ABSOLUTE).each((_, el) => {
    kept.push($.html(el));
    $(el).replaceWith(`<!--keep:${kept.length - 1}-->`);
  });

  let doc = relativize("<!DOCTYPE html>\n" + $.html().replace(/^<!DOCTYPE[^>]*>\s*/i, ""));
  collectAssets(doc);
  doc = doc.replace(/<!--keep:(\d+)-->/g, (_, i) => kept[Number(i)]);

  return { path: urlPath, title: $("head > title").text(), modified, html: doc };
}

// ---------- asset copying ----------

function localSource(p) {
  const f = path.join(WP_DIR, p);
  return fs.existsSync(f) && fs.statSync(f).isFile() ? f : null;
}

async function copyAsset(p, seen) {
  if (seen.has(p) || derivedImages.has(p)) return;
  seen.add(p);
  // Base URLs in script configs (e.g. ".../elementor/assets/") are not files.
  if (!/\.[a-z0-9]+$/i.test(p)) return;
  const dest = path.join(PUBLIC, p);
  const src = localSource(p);
  if (src) {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  } else {
    // Generated files can be newer on the live site than in the backup.
    const res = await fetch(ORIGIN + p);
    if (!res.ok) {
      console.warn(`  missing asset: ${p} (HTTP ${res.status})`);
      return;
    }
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
  }
  if (p.endsWith(".css")) {
    // Point absolute site URLs (e.g. Elementor's local Google Fonts) at this
    // host, then follow url(...) and @import references.
    const original = fs.readFileSync(dest, "utf8");
    const css = relativize(original);
    if (css !== original) fs.writeFileSync(dest, css);
    const re = /url\(\s*['"]?([^'")]+)['"]?\s*\)|@import\s+['"]([^'"]+)['"]/g;
    let m;
    while ((m = re.exec(css))) {
      const ref = (m[1] || m[2]).trim().split(/[?#]/)[0];
      if (!ref || /^(data:|https?:|\/\/)/.test(ref)) continue;
      const abs = ref.startsWith("/") ? ref : path.posix.normalize(path.posix.join(path.posix.dirname(p), ref));
      await copyAsset(abs, seen);
    }
  }
}

function compressLargePdfs(files) {
  for (const p of files) {
    const dest = path.join(PUBLIC, p);
    if (!fs.existsSync(dest) || fs.statSync(dest).size <= MAX_PDF_BYTES) continue;
    const tmp = dest + ".tmp";
    execFileSync(
      process.execPath,
      ["--max-old-space-size=8192", path.join(ROOT, "scripts", "compress-pdf.mjs"), dest, tmp, "150", "80"],
      { stdio: "inherit" },
    );
    fs.renameSync(tmp, dest);
  }
}


// Downscales oversized images and re-encodes JPEG/PNG files in place when that
// saves a meaningful amount, so every existing URL keeps working.
async function optimizeImages(files) {
  let saved = 0;
  for (const p of files) {
    if (!/\.(png|jpe?g)$/i.test(p)) continue;
    const dest = path.join(PUBLIC, p);
    if (!fs.existsSync(dest)) continue;
    const before = fs.readFileSync(dest);
    const { width, format } = await sharp(before).metadata();
    const maxWidth = IMAGE_WIDTH_OVERRIDES[p] ?? MAX_IMAGE_WIDTH;
    let img = sharp(before);
    if (width > maxWidth) img = img.resize({ width: maxWidth });
    const out =
      format === "png"
        ? await img.png({ palette: true, quality: 85, compressionLevel: 9 }).toBuffer()
        : await img.jpeg({ quality: 80, mozjpeg: true }).toBuffer();
    const resized = width > maxWidth;
    // Keep the original unless it was resized or the re-encode is >15% smaller.
    if (!resized && out.length > before.length * 0.85) continue;
    fs.writeFileSync(dest, out);
    saved += before.length - out.length;
    if (resized || before.length > 500 * 1024) {
      console.log(`  optimized ${p}: ${(before.length / 1024).toFixed(0)} KB -> ${(out.length / 1024).toFixed(0)} KB`);
    }
  }
  console.log(`  images: saved ${(saved / 1024 / 1024).toFixed(1)} MB`);
}

function copyDir(rel, filter = () => true) {
  const src = path.join(WP_DIR, rel);
  if (!fs.existsSync(src)) return;
  for (const entry of fs.readdirSync(src, { withFileTypes: true, recursive: true })) {
    if (!entry.isFile()) continue;
    const full = path.join(entry.parentPath, entry.name);
    const relFile = path.relative(WP_DIR, full).replace(/\\/g, "/");
    if (!filter(relFile)) continue;
    const dest = path.join(PUBLIC, relFile);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(full, dest);
  }
}

async function main() {
  if (!fs.existsSync(path.join(WP_DIR, "wp-content"))) {
    throw new Error(`WordPress source not found at ${WP_DIR} (set WP_DIR)`);
  }
  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(OUT, { recursive: true });
  for (const dir of ["wp-content", "wp-includes"]) {
    fs.rmSync(path.join(PUBLIC, dir), { recursive: true, force: true });
  }

  const index = [];
  for (const p of PAGES) {
    process.stdout.write(`page ${p}\n`);
    const page = convertPage(await getHtml(p), p);
    const slug = p === "/" ? "index" : p.replace(/^\/|\/$/g, "").replace(/\//g, "__");
    fs.writeFileSync(path.join(OUT, slug + ".json"), JSON.stringify(page, null, 1));
    index.push({ path: p, slug, modified: page.modified });
  }
  // English home page, generated from the Spanish one (see scripts/en.mjs).
  const en = convertPage(await getHtml("/"), "/en/", { english: true });
  fs.writeFileSync(path.join(OUT, "en.json"), JSON.stringify(en, null, 1));
  index.push({ path: "/en/", slug: "en", modified: en.modified });

  const nf = convertPage(await getHtml(NOT_FOUND_PROBE), "/404/");
  fs.writeFileSync(path.join(OUT, "_404.json"), JSON.stringify(nf, null, 1));
  fs.writeFileSync(path.join(ROOT, "content", "pages.json"), JSON.stringify(index, null, 1));
  const registry = [
    "// Generated by scripts/import-wp.mjs — do not edit.",
    ...index.map((p, i) => `import p${i} from "./pages/${p.slug}.json";`),
    `import notFound from "./pages/_404.json";`,
    "",
    "export const pages = {",
    ...index.map((p, i) => `  ${JSON.stringify(p.path)}: p${i},`),
    "};",
    "",
    "export { notFound };",
    "",
  ];
  fs.writeFileSync(path.join(ROOT, "content", "registry.ts"), registry.join("\n"));

  // Files loaded at runtime by scripts (lazy chunks, flags, fonts) that never
  // appear literally in the HTML.
  copyDir("wp-content/plugins/elementor/assets/js/chunks", (f) => f.endsWith(".min.js"));
  copyDir("wp-content/plugins/elementor/assets/js", (f) => /\/js\/[^/]*(\.bundle\.min\.js|handler\.min\.js)$/.test(f) && !/editor|admin|preview|app-/.test(f));
  copyDir("wp-content/plugins/elementor/assets/lib/swiper");
  copyDir("wp-content/plugins/elementor/assets/lib/animations");
  copyDir("wp-content/plugins/elementor/assets/css/conditionals");
  copyDir("wp-content/plugins/gtranslate/flags/svg");
  copyDir("wp-content/plugins/gtranslate/js");
  copyDir("wp-content/plugins/patiotime-core/assets/scripts/front");

  const seen = new Set();
  console.log(`copying ${assets.size} referenced assets...`);
  for (const p of assets) await copyAsset(p, seen);
  for (const f of ROOT_FILES) await copyAsset("/" + f, seen);
  compressLargePdfs([...seen].filter((p) => p.endsWith(".pdf")));
  await optimizeImages([...seen]);
  for (const [web, src] of derivedImages) {
    await copyAsset(src, seen);
    await sharp(path.join(PUBLIC, src))
      .resize({ width: 1600, withoutEnlargement: true })
      .jpeg({ quality: 75, mozjpeg: true })
      .toFile(path.join(PUBLIC, web));
  }
  console.log(`  ${derivedImages.size} header backgrounds as web-sized JPEG`);
  console.log(`done: ${index.length} pages, ${seen.size} assets`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
