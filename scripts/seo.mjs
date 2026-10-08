// SEO and loading-speed improvements, applied by import-wp.mjs after
// fixes.mjs. Main targets: "restaurante vietnamita Barcelona" (Spanish pages)
// and "Vietnamese restaurant in Barcelona" (/en/).

const SITE = "https://phovietnam.es";
const BRAND = "PHO VIETNAM";
const MENU_PDF_URL = "https://www.phovietnam.es/menu-pho-vietnam-.pdf";
const HERO_IMAGE = "/wp-content/uploads/2026/03/WhatsApp-Image-2026-02-28-at-19.07.13-2.jpeg";
const SOCIAL = [
  "https://www.facebook.com/profile.php?id=61577749224318",
  "https://www.instagram.com/phovietnam25/",
];

// Titles and descriptions for pages that had none (or a generic one).
const PAGE_META = {
  "/": {
    title: "Restaurante Vietnamita en Barcelona | PHO VIETNAM",
    description:
      "Restaurante vietnamita auténtico en Barcelona (Eixample): phở, bun bo hue, bun cha y más de 30 especialidades. Dos locales: Maria Claret y Muntaner. ¡Reserva tu mesa!",
  },
  "/en/": {
    title: "Vietnamese Restaurant in Barcelona | PHO VIETNAM",
    description:
      "Authentic Vietnamese restaurant in Barcelona (Eixample): pho, bun bo hue, bun cha and 30+ specialities. Two locations: Maria Claret and Muntaner. Book your table!",
  },
  "/blog/": {
    title: "Blog de cocina vietnamita | PHO VIETNAM Barcelona",
    description:
      "Platos, cultura y comida callejera de Vietnam contados por PHO VIETNAM, restaurante vietnamita en Barcelona: qué es el phở, el café phin, las tres regiones y más.",
  },
  "/reserva-mesa/": {
    title: "Reservar mesa | PHO VIETNAM, restaurante vietnamita en Barcelona",
    description:
      "Reserva tu mesa en PHO VIETNAM, restaurante vietnamita en Barcelona: elige el local de Carrer Muntaner 10 o el de Sant Antoni Maria Claret 230.",
  },
  "/newsletter/": {
    title: "Newsletter | PHO VIETNAM Barcelona",
    description:
      "Recibe las novedades, cambios de menú y horarios de PHO VIETNAM, restaurante vietnamita en Barcelona.",
  },
  "/politica-de-cookies/": { title: "Política de cookies | PHO VIETNAM", description: "Política de cookies de phovietnam.es." },
  "/declaracion-de-privacidad/": { title: "Declaración de privacidad | PHO VIETNAM", description: "Declaración de privacidad de phovietnam.es." },
};

// Descriptive alt text for the home page images, keyed by file name (without
// WordPress' -WxH size suffix).
const HOME_ALTS = {
  "Be-Vang-Nau-Retro-Su-Kien-Le-Hoi-Am-Thuc-Viet-Nam-Poster": ["Ilustración de un bol de phở vietnamita con monumentos de Vietnam", "Illustration of a bowl of Vietnamese pho with Vietnamese landmarks"],
  "com-ga-vietnamita-en-barcelona": ["Arroz con carne a la parrilla, tomate y pepino, plato vietnamita en Barcelona", "Rice with grilled meat, tomato and cucumber, a Vietnamese dish in Barcelona"],
  "WhatsApp-Image-2026-02-28-at-19.07.14-3": ["Bun cha con fideos de arroz, albóndigas en caldo, cerdo a la parrilla y rollitos fritos", "Bun cha with rice noodles, meatballs in broth, grilled pork and fried spring rolls"],
  "Story-Instagram-thuong-ngay-4-hinh": ["Rollitos vietnamitas fritos y de verano con gambas", "Vietnamese fried spring rolls and summer rolls with prawns"],
  "goi-cuon-e1750620064517": ["Goi cuon, rollitos de verano con salsa de cacahuete", "Goi cuon summer rolls with peanut sauce"],
  "Trang-Mau-kem-Chanh-xanh-Mau-phan-Hoan-hao-Do-an-Video-TikTok": ["Bo luc lac, ternera salteada con verduras y arroz", "Bo luc lac, stir-fried beef with vegetables and rice"],
  "vang-xanh-do-moc-mac-gian-di-poster": ["Bun bo hue, sopa de fideos de Hue", "Bun bo hue, spicy noodle soup from Hue"],
  "WhatsApp-Image-2026-02-28-at-19.07.14": ["Phở bo, sopa de fideos con ternera, hierbas y salsas", "Pho bo, beef noodle soup with herbs and sauces"],
  "WhatsApp-Image-2025-07-28-at-04.02.30": ["Ternera salteada con verduras, pepino y arroz", "Stir-fried beef with vegetables, cucumber and rice"],
  "WhatsApp-Image-2026-02-28-at-19.07.13-1": ["Banh cuon, crepes de arroz al vapor con cebolla frita y embutido vietnamita", "Banh cuon, steamed rice rolls with fried shallots and Vietnamese pork roll"],
  "do-an-ngon-o-hue": ["Variedad de platos tradicionales de Hue, Vietnam", "A spread of traditional dishes from Hue, Vietnam"],
};

const THEFORK_TITLES = {
  "c40f60bd-210c-41ed-b359-56ccbee384f6": ["Reservar mesa en PHO VIETNAM Muntaner", "Book a table at PHO VIETNAM Muntaner"],
  "9e27a699-28fc-438b-8e25-ff6b4fb9992f": ["Reservar mesa en PHO VIETNAM Maria Claret", "Book a table at PHO VIETNAM Maria Claret"],
};

function restaurantSchema(lang) {
  const branch = (id, name, street, postalCode, phone) => ({
    "@type": "Restaurant",
    "@id": `${SITE}/#${id}`,
    name: `${BRAND} (${name})`,
    url: lang === "en" ? `${SITE}/en/` : `${SITE}/`,
    image: `${SITE}${HERO_IMAGE}`,
    logo: `${SITE}/wp-content/uploads/2025/06/logo-ko-nen.png`,
    telephone: phone,
    email: "gastroviet@gmail.com",
    servesCuisine: ["Vietnamese", "Vietnamita"],
    priceRange: "€€",
    menu: MENU_PDF_URL,
    acceptsReservations: `${SITE}/reserva-mesa/`,
    address: {
      "@type": "PostalAddress",
      streetAddress: street,
      addressLocality: "Barcelona",
      postalCode,
      addressRegion: "Cataluña",
      addressCountry: "ES",
    },
    sameAs: SOCIAL,
  });
  return {
    "@context": "https://schema.org",
    "@graph": [
      branch("maria-claret", "Maria Claret", "Carrer de Sant Antoni Maria Claret, 230", "08025", "+34 930 64 10 19"),
      branch("muntaner", "Muntaner", "Carrer de Muntaner, 10", "08011", "+34 936 94 98 99"),
    ],
  };
}

function setMeta($, attr, key, value) {
  let el = $(`meta[${attr}="${key}"]`);
  if (!el.length) {
    el = $(`<meta ${attr}="${key}">`);
    $("head title").after(el);
  }
  el.attr("content", value);
}

// Web-sized JPEG copies requested by applySeo(), generated by import-wp.mjs:
// published path -> source path (both under public/).
export const derivedImages = new Map();
export const DERIVED_SUFFIX = "-pvbg.jpg";

// Drops WordPress' -WxH size suffix and the extension from an image URL.
const imageKey = (src) => (src || "").split("/").pop().replace(/\.\w+$/, "").replace(/-\d+x\d+$/, "");

export function applySeo($, urlPath) {
  const lang = urlPath === "/en/" ? "en" : "es";
  const pick = (pair) => pair[lang === "en" ? 1 : 0];

  // ---- Titles & descriptions ----
  // The site name contained a zero-width space ("​PHO VIETNAM") everywhere.
  $("title, meta[property='og:title'], meta[property='og:site_name']").each((_, el) => {
    const $el = $(el);
    if (el.tagName === "title") $el.text($el.text().replace(/​/g, ""));
    else $el.attr("content", ($el.attr("content") || "").replace(/​/g, ""));
  });
  $('script[type="application/ld+json"]').each((_, el) => {
    $(el).text(($(el).html() || "").replace(/​/g, ""));
  });
  // Blog posts: "<post> - Restaurante vietnamita auténtico PHO VIETNAM" was too
  // long for search results; keep the post title visible.
  const suffix = / - Restaurante vietnamita auténtico PHO VIETNAM$/;
  $("title").text($("title").text().replace(suffix, ` | ${BRAND} Barcelona`));
  $("meta[property='og:title']").attr("content", ($("meta[property='og:title']").attr("content") || "").replace(suffix, ` | ${BRAND} Barcelona`));
  $("meta[property='og:site_name']").attr("content", `${BRAND} – Restaurante vietnamita en Barcelona`);

  const meta = PAGE_META[urlPath];
  if (meta) {
    $("title").text(meta.title);
    setMeta($, "property", "og:title", meta.title);
    setMeta($, "name", "description", meta.description);
    setMeta($, "property", "og:description", meta.description);
  }

  // ---- Headings ----
  if (urlPath === "/" || urlPath === "/en/") {
    // The home page had no <h1>. The hero line becomes it, now naming the city.
    const hero = $(".elementor-element-78e928a .pt-subtitle").first();
    hero.replaceWith(`<h1 class="${hero.attr("class")}">${lang === "en" ? "Vietnamese restaurant in Barcelona" : "Restaurante vietnamita en Barcelona"}</h1>`);
  }
  if (urlPath === "/blog/") {
    $("#content .main").first().prepend(`<h1 class="screen-reader-text">Blog de cocina vietnamita – ${BRAND}, restaurante vietnamita en Barcelona</h1>`);
  }
  if (urlPath === "/newsletter/") {
    $("h1").filter((_, el) => /Join Our Mailing List/i.test($(el).text())).text("Suscríbete a nuestro boletín");
  }

  // ---- Image alt text & accessible names ----
  $("#content img").each((_, img) => {
    const $img = $(img);
    if (($img.attr("alt") || "").trim()) return;
    const homeAlt = HOME_ALTS[imageKey($img.attr("src"))];
    const postTitle = $img.closest("article").find(".entry-title, .post-title, h2, h1").first().text().replace(/\s+/g, " ").trim();
    const alt = homeAlt ? pick(homeAlt) : postTitle || $("h1").first().text().replace(/\s+/g, " ").trim();
    if (alt) $img.attr("alt", alt);
  });
  $('img[src*="logo-ko-nen"]').attr("alt", BRAND);
  $("a").has('img[src*="logo-ko-nen"]').attr("aria-label", lang === "en" ? `${BRAND} – Home` : `${BRAND} – Inicio`);
  $("a.to-top").attr("aria-label", lang === "en" ? "Back to top" : "Volver arriba");
  $("a.pt-cta-link").attr("aria-label", lang === "en" ? "See the menu (PDF)" : "Ver la carta (PDF)");

  // ---- Post header background: the largest paint on blog posts ----
  // It used the full-size upload (often a 1-2 MB PNG) and was only found once
  // the CSS had loaded. Serve a web-sized JPEG and fetch it early.
  $(".page-title-bg[style*='background-image']").each((_, el) => {
    const style = $(el).attr("style") || "";
    const m = style.match(/url\((['"]?)([^'")]+\.(?:png|jpe?g|webp))\1\)/i);
    if (!m) return;
    const src = m[2].replace(/^https:\/\/phovietnam\.es/, "");
    const web = src.replace(/\.\w+$/, DERIVED_SUFFIX);
    derivedImages.set(web, src);
    $(el).attr("style", style.replace(m[2], web));
    $("head").append(`<link rel="preload" as="image" href="${web}" fetchpriority="high">`);
  });

  // ---- Cookie banner: show it as soon as its HTML is parsed ----
  // Complianz reveals the banner only after every script at the end of the
  // page has run, which made it the late "largest paint" on first visits.
  // Same rules as Complianz: not when dismissed before or with DNT/GPC.
  $("#cmplz-cookiebanner-container").after(`<script id="pv-early-banner">(function(){
if (/(?:^|;\\s*)cmplz_banner-status=dismissed/.test(document.cookie) || navigator.globalPrivacyControl || navigator.doNotTrack === "1") return;
var b = document.querySelector("#cmplz-cookiebanner-container .cmplz-cookiebanner");
if (b) { b.classList.remove("cmplz-hidden"); b.classList.add("cmplz-show"); }
})();</script>`);

  // ---- Reservation widgets: below the fold, so load them lazily ----
  $('iframe[src*="widget.thefork.com"]').each((_, el) => {
    const id = ($(el).attr("src") || "").split("/").pop().split("?")[0];
    $(el).attr("loading", "lazy");
    if (THEFORK_TITLES[id]) $(el).attr("title", pick(THEFORK_TITLES[id]));
  });

  // ---- Home: hero image, structured data, language alternates ----
  if (urlPath === "/" || urlPath === "/en/") {
    // The hero photo was only fetched once Elementor's slideshow script ran;
    // show the first slide straight from CSS and fetch it early.
    $("head").append(
      `<link rel="preload" as="image" href="${HERO_IMAGE}" fetchpriority="high">` +
        `<style id="pv-hero">.elementor-1036 .elementor-element.elementor-element-78e928a{background:#2a2a2a url("${HERO_IMAGE}") center/cover no-repeat}` +
        // The hero line was a <span>; as an <h1> it picked up the theme's heading margins.
        `.entry-content .elementor-element h1.pt-subtitle{margin:0}</style>`,
    );
    $("head").append(`<script type="application/ld+json">${JSON.stringify(restaurantSchema(lang))}</script>`);
    $("head").append(
      `<link rel="alternate" hreflang="es" href="${SITE}/">` +
        `<link rel="alternate" hreflang="en" href="${SITE}/en/">` +
        `<link rel="alternate" hreflang="x-default" href="${SITE}/">`,
    );
  }
  if (lang === "en") {
    $("link[rel='canonical']").attr("href", `${SITE}/en/`);
    setMeta($, "property", "og:url", `${SITE}/en/`);
    setMeta($, "property", "og:locale", "en_GB");
  }

  // The theme also pulled Cormorant Garamond + Jost from fonts.googleapis.com,
  // a render-blocking request to another host, although Elementor already
  // self-hosts both families with every weight. Use the local copies (also
  // keeps visitors' IPs away from Google, a GDPR issue in the EU).
  const googleFonts = $("link#patiotime-theme-google-fonts-css");
  if ($('link[href*="google-fonts/css/cormorantgaramond.css"]').length) googleFonts.remove();
  else googleFonts.attr("href", `${SITE}/wp-content/uploads/elementor/google-fonts/css/cormorantgaramond.css?ver=1750579201`);
  $('link[rel="dns-prefetch"][href*="fonts.googleapis.com"]').remove();
  // Jost (body text, buttons, cookie banner) is one variable-weight file; fetch
  // it right away instead of after the CSS, so text isn't re-laid out late.
  $("head").prepend(
    '<link rel="preload" as="font" type="font/woff2" href="/wp-content/uploads/elementor/google-fonts/fonts/jost-92zatbhpnqw73otd4g.woff2" crossorigin>',
  );
}
