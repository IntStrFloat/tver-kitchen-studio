/** Node 24: npm run generate:og. Uses the existing sharp dependency. */
import sharp from "sharp";
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { SITE_CONFIG } from "../src/lib/seo.ts";

const publicDir = fileURLToPath(new URL("../public/", import.meta.url));
const escapeXml = (value) => value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[c]);
const source = await readFile(path.join(publicDir, "images/kitchen-emerald.jpg"));
// Remove source metadata while preserving the site's existing illustration.
const background = await sharp(source).rotate().resize(1200, 630, { fit: "cover" }).jpeg({ quality: 90 }).toBuffer();
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs><linearGradient id="shade"><stop offset="0" stop-color="#101c24" stop-opacity=".94"/><stop offset=".68" stop-color="#101c24" stop-opacity=".72"/><stop offset="1" stop-color="#101c24" stop-opacity=".12"/></linearGradient></defs>
  <image href="data:image/jpeg;base64,${background.toString("base64")}" width="1200" height="630"/>
  <rect width="1200" height="630" fill="url(#shade)"/>
  <g font-family="Arial, sans-serif">
    <text x="60" y="144" fill="#42d4a4" font-size="64" font-weight="700">${escapeXml(SITE_CONFIG.name)}</text>
    <text x="60" y="240" fill="#fff" font-size="56" font-weight="700">Кухни на заказ</text>
    <text x="60" y="310" fill="#fff" font-size="56" font-weight="700">в Твери</text>
    <text x="60" y="382" fill="#e2e8f0" font-size="27">Индивидуальная комплектация и расчёт</text>
    <text x="60" y="510" fill="#42d4a4" font-size="38" font-weight="700">${escapeXml(SITE_CONFIG.phone)}</text>
    <text x="60" y="552" fill="#e2e8f0" font-size="23">${escapeXml(`${SITE_CONFIG.address.locality}, ${SITE_CONFIG.address.street}`)}</text>
    <text x="1140" y="596" text-anchor="end" fill="#fff" font-size="24">${escapeXml(new URL(SITE_CONFIG.url).hostname)}</text>
  </g>
</svg>`;
const jpeg = await sharp(Buffer.from(svg)).jpeg({ quality: 90 }).toBuffer();
const imageName = path.basename(new URL(SITE_CONFIG.defaultOgImage).pathname);
if (!/^og-image-[0-9]{8}\.jpg$/.test(imageName)) throw new Error("Use a dated OG image filename to invalidate old previews");
await Promise.all([
  writeFile(path.join(publicDir, "og-image.svg"), svg),
  writeFile(path.join(publicDir, "og-image.jpg"), jpeg),
  writeFile(path.join(publicDir, imageName), jpeg),
]);
console.log(`Generated ${imageName} and legacy OG aliases from SITE_CONFIG (${jpeg.length} bytes).`);
