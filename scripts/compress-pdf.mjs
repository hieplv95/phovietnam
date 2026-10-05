// Re-renders a PDF as JPEG pages to make it web-sized. The menu PDFs exported
// from the design tool are hundreds of MB for a handful of pages.
//
//   node scripts/compress-pdf.mjs <input.pdf> <output.pdf> [dpi=150] [quality=80]

import fs from "node:fs";
import { createCanvas } from "@napi-rs/canvas";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import { PDFDocument } from "pdf-lib";
import sharp from "sharp";

const [input, output, dpiArg = "150", qualityArg = "80"] = process.argv.slice(2);
if (!input || !output) {
  console.error("usage: node scripts/compress-pdf.mjs <input.pdf> <output.pdf> [dpi] [quality]");
  process.exit(1);
}
const scale = Number(dpiArg) / 72;
const quality = Number(qualityArg);

const src = await getDocument({ data: new Uint8Array(fs.readFileSync(input)), verbosity: 0 }).promise;
const out = await PDFDocument.create();

for (let i = 1; i <= src.numPages; i++) {
  const page = await src.getPage(i);
  const base = page.getViewport({ scale: 1 });
  const viewport = page.getViewport({ scale });
  const canvas = createCanvas(Math.ceil(viewport.width), Math.ceil(viewport.height));
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  await page.render({ canvasContext: ctx, canvas, viewport }).promise;
  const jpeg = await sharp(canvas.toBuffer("image/png")).jpeg({ quality, mozjpeg: true }).toBuffer();
  const img = await out.embedJpg(jpeg);
  out.addPage([base.width, base.height]).drawImage(img, { x: 0, y: 0, width: base.width, height: base.height });
  console.log(`page ${i}/${src.numPages}: ${(jpeg.length / 1024).toFixed(0)} KB`);
}

fs.writeFileSync(output, await out.save());
const mb = (n) => (n / 1024 / 1024).toFixed(1) + " MB";
console.log(`${input}: ${mb(fs.statSync(input).size)} -> ${mb(fs.statSync(output).size)}`);
