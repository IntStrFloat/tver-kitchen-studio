/**
 * Генерирует og-image.jpg (1200×630) из public/og-image.svg
 * Запуск: node scripts/generate-og.mjs
 * Требуется: npm install --save-dev sharp
 */
import sharp from "sharp";
import { readFile } from "fs/promises";
import { writeFile } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, "..", "public");
const svgPath = join(publicDir, "og-image.svg");
const outPath = join(publicDir, "og-image.jpg");

const svg = await readFile(svgPath, "utf-8");
await sharp(Buffer.from(svg))
  .resize(1200, 630)
  .jpeg({ quality: 90 })
  .toFile(outPath);
console.log("[generate-og] Written:", outPath);
