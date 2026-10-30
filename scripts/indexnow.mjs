import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { normalizedUrl, parseHtml, parseXml } from "./seo-audit.mjs";

// Public ownership proof, not an account/API secret. Keep the existing key stable.
// Custom root keyLocation: https://www.indexnow.org/documentation (option 2).
const ORIGIN = "https://kuhnitver.ru";
const ENDPOINT = "https://api.indexnow.org/indexnow";
const KEY_LOCATION = `${ORIGIN}/indexnow-key.txt`;
const KEY_FILE = fileURLToPath(new URL("../public/indexnow-key.txt", import.meta.url));
const MAX_URLS = 10000;

export function validateUrlScope(raw, origin = ORIGIN) {
  if (typeof raw !== "string" || raw !== raw.trim()) throw new Error("URL must be an absolute canonical URL without surrounding whitespace");
  const url = new URL(raw);
  const expected = new URL(origin);
  if (url.origin !== expected.origin || url.protocol !== "https:" || url.username || url.password) throw new Error("URL outside canonical HTTPS origin or containing credentials");
  if (url.search || url.hash || raw.includes("?") || raw.includes("#")) throw new Error("Canonical URL must not contain query/fragment");
  if (url.pathname.startsWith("//") || /%(?:2f|5c)/i.test(url.pathname) || raw.includes("\\")) throw new Error("Ambiguous URL path");
  return url.href;
}

export function urlsFromSitemap(xml) {
  const root = parseXml(xml);
  if (root.tag !== "urlset") throw new Error("Expected the production page sitemap urlset");
  const urls = root.children.filter((node) => node.tag === "url").map((node) => {
    const locations = node.children.filter((child) => child.tag === "loc");
    if (locations.length !== 1 || locations[0].children.length) throw new Error("Each sitemap URL must contain exactly one text loc");
    return validateUrlScope(locations[0].text.trim());
  });
  if (!urls.length || urls.length > MAX_URLS) throw new Error(`Expected 1–${MAX_URLS} sitemap URLs; found ${urls.length}`);
  if (new Set(urls.map((url) => normalizedUrl(url))).size !== urls.length) throw new Error("Duplicate canonical URLs in sitemap");
  return urls;
}

export function buildPayload({ key, keyLocation = KEY_LOCATION, urls }) {
  if (typeof key !== "string" || !/^[a-f0-9]{32}$/.test(key)) throw new Error("Expected the persistent public 32-character hexadecimal key");
  if (validateUrlScope(keyLocation) !== KEY_LOCATION) throw new Error("Key location must be the published root indexnow-key.txt");
  if (!Array.isArray(urls) || urls.length < 1 || urls.length > MAX_URLS) throw new Error(`Expected 1–${MAX_URLS} URLs`);
  const urlList = urls.map((url) => validateUrlScope(url));
  if (new Set(urlList.map((url) => normalizedUrl(url))).size !== urlList.length) throw new Error("Duplicate canonical URLs");
  return { host: new URL(ORIGIN).hostname, key, keyLocation, urlList };
}

async function getText(url) {
  const response = await fetch(url, {
    redirect: "error",
    signal: AbortSignal.timeout(30000),
    headers: { "User-Agent": "Kuhnitver-IndexNow-Preflight/1.0" },
  });
  if (response.status !== 200) throw new Error(`Preflight GET ${url}: HTTP ${response.status}`);
  return response.text();
}

async function validatePublishedPages(urls) {
  let index = 0;
  await Promise.all(Array.from({ length: Math.min(3, urls.length) }, async () => {
    while (index < urls.length) {
      const url = urls[index++];
      const page = parseHtml(await getText(url));
      if (page.canonical.length !== 1 || normalizedUrl(validateUrlScope(page.canonical[0])) !== normalizedUrl(url)) throw new Error(`Published canonical mismatch: ${url}`);
      if (page.robots.some((meta) => /\bnoindex\b/i.test(meta.content))) throw new Error(`Sitemap URL is noindex: ${url}`);
    }
  }));
}

export async function run({ submit = false } = {}) {
  const date = new Date().toISOString();
  const key = (await readFile(KEY_FILE, "utf8")).trim();
  // Verify the persistent local key before any remote work or notification.
  buildPayload({ key, urls: [ORIGIN] });
  const [sitemapXml, publishedKey] = await Promise.all([getText(`${ORIGIN}/sitemap.xml`), getText(KEY_LOCATION)]);
  if (publishedKey.trim() !== key) throw new Error("Published ownership key does not match the persistent local key; deploy/check the key before submission");
  const payload = buildPayload({ key, urls: urlsFromSitemap(sitemapXml) });
  await validatePublishedPages(payload.urlList);
  const report = { date, mode: submit ? "submit" : "dry-run", host: payload.host, keyLocation: payload.keyLocation, urlCount: payload.urlList.length, urls: payload.urlList, attempted: false, submitted: false, status: null, result: "preflight_passed" };
  if (!submit) return report;
  // Exactly one POST per explicit invocation; no automatic retries or scheduling.
  report.attempted = true;
  try {
    const response = await fetch(ENDPOINT, {
      method: "POST",
      redirect: "error",
      signal: AbortSignal.timeout(30000),
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(payload),
    });
    await response.body?.cancel();
    report.status = response.status;
    report.submitted = [200, 202].includes(response.status);
    report.result = response.status === 200 ? "received" : response.status === 202 ? "received_key_validation_pending" : "rejected";
  } catch {
    report.result = "receipt_unknown";
  }
  report.finishedAt = new Date().toISOString();
  return report;
}

export function selfTest() {
  const key = "0123456789abcdef0123456789abcdef";
  const urls = urlsFromSitemap('<?xml version="1.0"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://kuhnitver.ru</loc></url><url><loc>https://kuhnitver.ru/catalog/loft</loc></url></urlset>');
  assert.deepEqual(urls, [`${ORIGIN}/`, `${ORIGIN}/catalog/loft`]);
  assert.deepEqual(buildPayload({ key, urls }), { host: "kuhnitver.ru", key, keyLocation: KEY_LOCATION, urlList: urls });
  for (const url of ["http://kuhnitver.ru/", "https://www.kuhnitver.ru/", "https://kuhnitver.ru.evil.test/", "https://kuhnitver.ru@evil.test/", "https://name:password@kuhnitver.ru/", `${ORIGIN}/?utm_source=test`, `${ORIGIN}/#fragment`, `${ORIGIN}//evil.test`, `${ORIGIN}/encoded%2fpath`, ` ${ORIGIN}/`]) assert.throws(() => validateUrlScope(url), undefined, url);
  assert.throws(() => buildPayload({ key: "invalid", urls }));
  assert.throws(() => buildPayload({ key, urls: [] }));
  assert.throws(() => buildPayload({ key, urls: Array(MAX_URLS + 1).fill(`${ORIGIN}/`) }));
  assert.throws(() => buildPayload({ key, keyLocation: `${ORIGIN}/catalog/key.txt`, urls }));
  assert.throws(() => buildPayload({ key, urls: [ORIGIN, `${ORIGIN}/`] }));
  assert.throws(() => urlsFromSitemap(`<urlset><url><loc>https://evil.test/</loc></url></urlset>`));
  assert.throws(() => urlsFromSitemap(`<urlset><url><loc>${ORIGIN}/</loc><loc>${ORIGIN}/price</loc></url></urlset>`));
  assert.throws(() => urlsFromSitemap("<urlset/>"));
  assert.throws(() => urlsFromSitemap("<sitemapindex/>"));
  return { passed: true, networkRequests: 0 };
}

async function main(args) {
  if (args.includes("--self-test")) { console.log(JSON.stringify(selfTest())); return; }
  if (args.includes("--help")) {
    console.log("node scripts/indexnow.mjs [--dry-run] [--output REPORT.json]\nnode scripts/indexnow.mjs --submit [--output REPORT.json]\nnode scripts/indexnow.mjs --self-test\nDefault is read-only dry-run. Preflight checks production sitemap, published ownership key and each page canonical. --submit sends exactly one IndexNow POST. A 200/202 response means receipt, not indexing or citation.");
    return;
  }
  if (args.includes("--submit") && args.includes("--dry-run")) throw new Error("Choose --submit or --dry-run");
  for (let index = 0; index < args.length; index++) {
    if (args[index] === "--output") { if (!args[++index] || args[index].startsWith("--")) throw new Error("--output needs a filename"); }
    else if (!["--submit", "--dry-run"].includes(args[index])) throw new Error(`Unknown argument ${args[index]}`);
  }
  const report = await run({ submit: args.includes("--submit") });
  const outputIndex = args.indexOf("--output");
  if (outputIndex >= 0) {
    const output = path.resolve(args[outputIndex + 1]);
    await mkdir(path.dirname(output), { recursive: true });
    await writeFile(output, `${JSON.stringify(report, null, 2)}\n`);
  }
  console.log(JSON.stringify(report));
  if (["rejected", "receipt_unknown"].includes(report.result)) process.exitCode = 1;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main(process.argv.slice(2)).catch((error) => { console.error(error.message); process.exitCode = 1; });
