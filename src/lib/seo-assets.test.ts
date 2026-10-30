import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import sharp from "sharp";
// @ts-expect-error Node's type-stripping runtime requires the explicit extension.
import { SITE_CONFIG } from "./seo.ts";

const asset = (name: string) => readFileSync(new URL(`../../public/${name}`, import.meta.url));

test("social preview contains the same verified contact details as the website", () => {
  const svg = asset("og-image.svg").toString("utf8");
  const visibleText = Array.from(svg.matchAll(/<text\b[^>]*>([\s\S]*?)<\/text>/g), (match) => match[1]).join(" ");
  assert.ok(visibleText.includes(SITE_CONFIG.phone));
  assert.ok(visibleText.includes(SITE_CONFIG.address.street));
  assert.ok(visibleText.includes(SITE_CONFIG.address.locality));
  assert.doesNotMatch(visibleText, /Коминтерна|903\s*630/);
});

test("versioned and compatible preview URLs contain the same usable social image", async () => {
  const filename = new URL(SITE_CONFIG.defaultOgImage).pathname.slice(1);
  assert.match(filename, /^og-image-\d{8}\.jpg$/);
  const versioned = asset(filename);
  assert.deepEqual(versioned, asset("og-image.jpg"));
  const metadata = await sharp(versioned).metadata();
  assert.equal(metadata.format, "jpeg");
  assert.equal(metadata.width, 1200);
  assert.equal(metadata.height, 630);
});
