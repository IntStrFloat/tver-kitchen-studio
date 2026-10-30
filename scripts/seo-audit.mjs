import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const BOT_AGENTS = {
  Googlebot: "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
  YandexBot: "Mozilla/5.0 (compatible; YandexBot/3.0; +http://yandex.com/bots)",
  "OAI-SearchBot": "OAI-SearchBot/1.3; +https://openai.com/searchbot",
  "ChatGPT-User": "Mozilla/5.0 (compatible; ChatGPT-User/1.0; +https://openai.com/bot)",
  GPTBot: "Mozilla/5.0 (compatible; GPTBot/1.3; +https://openai.com/gptbot)",
  PerplexityBot: "Mozilla/5.0 (compatible; PerplexityBot/1.0; +https://perplexity.ai/perplexitybot)",
  bingbot: "Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)",
};

export function decodeEntities(text) {
  return text.replace(/&#(x[0-9a-f]+|\d+);|&(amp|lt|gt|quot|apos|nbsp);/gi, (match, code, named) => {
    if (code) {
      const value = code[0].toLowerCase() === "x" ? parseInt(code.slice(1), 16) : Number(code);
      return value > 0 && value <= 0x10ffff ? String.fromCodePoint(value) : match;
    }
    return { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " }[named.toLowerCase()];
  });
}

function textOnly(html) {
  return decodeEntities(html.replace(/<!--[\s\S]*?-->/g, " ").replace(/<(script|style|head)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, " ").replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim();
}

function attrs(tag) {
  const result = {};
  for (const match of tag.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g)) {
    result[match[1].toLowerCase()] = decodeEntities(match[2] ?? match[3] ?? match[4]);
  }
  return result;
}

export function parseHtml(html) {
  const result = { title: [], h1: [], canonical: [], descriptions: [], robots: [], links: [], schema: [], jsonldErrors: [], text: textOnly(html) };
  for (const match of html.matchAll(/<(title|h1)\b[^>]*>([\s\S]*?)<\/\1\s*>/gi)) result[match[1].toLowerCase()].push(textOnly(match[2]));
  for (const match of html.matchAll(/<(link|meta|a)\b[^>]*>/gi)) {
    const a = attrs(match[0]);
    const type = match[1].toLowerCase();
    if (type === "link" && a.rel?.toLowerCase().split(/\s+/).includes("canonical")) result.canonical.push(a.href);
    if (type === "meta" && a.name?.toLowerCase() === "description") result.descriptions.push(a.content);
    if (type === "meta" && /^(robots|googlebot|yandex|bingbot)$/i.test(a.name ?? "")) result.robots.push({ name: a.name, content: a.content ?? "" });
    if (type === "a" && a.href) result.links.push(a.href);
  }
  for (const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)) {
    if (attrs(match[1]).type?.toLowerCase() !== "application/ld+json") continue;
    try { result.schema.push(JSON.parse(match[2])); } catch (error) { result.jsonldErrors.push(error.message); }
  }
  return result;
}

const VERIFIED_CITY_DELIVERY = [
  { slug: "tveri", name: "Тверь", price: 0 },
  { slug: "torzhke", name: "Торжок", price: 3000 },
  { slug: "rzheve", name: "Ржев", price: 5000 },
  { slug: "konakovo", name: "Конаково", price: 3500 },
  { slug: "kimrah", name: "Кимры", price: 4000 },
  { slug: "vyshnem-volochke", name: "Вышний Волочёк", price: 5000 },
  { slug: "bezhecke", name: "Бежецк", price: 6000 },
  { slug: "nelidovo", name: "Нелидово", price: 7000 },
];

// Small balanced-tag reader for the site's SSR output. No browser/CSS execution:
// inspect rendered blocks/ancestors rather than unrelated numbers on the page.
function htmlElements(html) {
  const source = html.replace(/<!--[\s\S]*?-->/g, " ").replace(/<(script|style|head)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, " ");
  const root = { tag: "#document", parts: [], parent: null };
  const stack = [root];
  const elements = [];
  const voids = new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"]);
  for (const token of source.matchAll(/<\/?[A-Za-z][\w:-]*(?:\s+(?:[^>"']|"[^"]*"|'[^']*')*)?\s*\/?>|[^<]+/g)) {
    if (!token[0].startsWith("<")) { stack.at(-1).parts.push(decodeEntities(token[0])); continue; }
    const tag = token[0].match(/^<\/?([\w:-]+)/)[1].toLowerCase();
    if (token[0].startsWith("</")) {
      const index = stack.findLastIndex((node) => node.tag === tag);
      if (index > 0) stack.length = index;
      continue;
    }
    const node = { tag, attributes: attrs(token[0]), opening: token[0], parts: [], parent: stack.at(-1) };
    node.parent.parts.push(node);
    elements.push(node);
    if (!voids.has(tag) && !token[0].endsWith("/>")) stack.push(node);
  }
  return elements;
}

function elementText(node) {
  return node.parts.map((part) => typeof part === "string" ? part : elementText(part)).join(" ").replace(/\s+/g, " ").trim();
}

function containsNode(ancestor, node) {
  for (let current = node.parent; current; current = current.parent) if (current === ancestor) return true;
  return false;
}

function tariffValue(text) {
  if (/включен[аоы]?[\p{L}]*\s+в\s+стоимост|бесплатн/iu.test(text)) return 0;
  const amount = text.match(/(\d[\d\s]*)\s*(?:₽|руб)/iu)?.[1];
  return amount ? Number(amount.replace(/\s/g, "")) : null;
}

export function inspectRenderedPage(html, pathname) {
  const elements = htmlElements(html);
  const visibleText = textOnly(html);
  const issues = [];
  const add = (code, detail) => issues.push({ code, detail });
  const details = { measurement: null, delivery: null, contactForms: 0, essentialH1Visible: true };
  if (pathname === "/contacts") {
    // No postal code has been confirmed for the moved address. Include hidden
    // metadata, even when React hoists it into head, but ignore serialized JS.
    const withoutScripts = html.replace(/<script\b[^>]*>[\s\S]*?<\/script\s*>/gi, " ");
    const postalCodes = [...withoutScripts.matchAll(/<meta\b[^>]*>/gi)].map((match) => attrs(match[0]))
      .filter((a) => a.itemprop?.toLowerCase().split(/\s+/).includes("postalcode") && a.content?.trim())
      .map((a) => a.content);
    if (postalCodes.length) add("unconfirmed_postal_code", { values: postalCodes, reason: "Owner has not confirmed a postal code for the current address" });
  }
  // Owner-confirmed business terms, 2026-10-30. A service tariff is not a kitchen price.
  const measurementPrices = [...visibleText.matchAll(/замер[^.!?₽]{0,65}?(\d[\d\s]*)\s*(?:₽|руб)/giu)].map((match) => Number(match[1].replace(/\s/g, "")));
  const freeMeasurement = /бесплатн[\p{L}]*\s+замер|замер[^.!?]{0,25}бесплатн/iu.test(visibleText);
  if (freeMeasurement) add("free_measurement_claim", "Owner-confirmed measurement costs 1500 RUB with credit on order");
  if (["/contacts", "/faq", "/price", "/kuhni/tveri"].includes(pathname)) {
    const credited = /при\s+заказе[^.!?]{0,140}(?:вычита|зачит|вычет)/iu.test(visibleText);
    if (!measurementPrices.includes(1500)) add("measurement_price_missing", { expected: 1500, actual: measurementPrices });
    if (measurementPrices.some((price) => price !== 1500)) add("measurement_price_conflict", measurementPrices);
    if (!credited) add("measurement_credit_missing", "Visible text must explain crediting the measurement amount against the order");
    details.measurement = { prices: measurementPrices, credited, freeClaim: freeMeasurement };
  }
  if (pathname === "/dostavka") {
    const rows = elements.filter((node) => node.tag === "tr").map((node) => node.parts.filter((part) => typeof part !== "string" && ["td", "th"].includes(part.tag)).map(elementText));
    details.delivery = [];
    for (const city of VERIFIED_CITY_DELIVERY) {
      const matches = rows.filter((cells) => cells[0] === city.name);
      const price = matches.length === 1 ? tariffValue(matches[0].at(-1)) : null;
      details.delivery.push({ city: city.name, price });
      if (matches.length !== 1 || price !== city.price) add("delivery_table_tariff", { city: city.name, expected: city.price, actual: price, rows: matches });
    }
  }
  const city = VERIFIED_CITY_DELIVERY.find((entry) => pathname === `/kuhni/${entry.slug}`);
  if (city) {
    const labels = elements.filter((node) => elementText(node).toLowerCase() === "стоимость доставки" && !node.parts.some((part) => typeof part !== "string" && elementText(part).toLowerCase() === "стоимость доставки"));
    const prices = labels.map((label) => {
      let block = label.parent;
      for (let depth = 0; block && depth < 3; depth++, block = block.parent) {
        const text = elementText(block);
        const price = tariffValue(text);
        if (price !== null) return price;
      }
      return null;
    });
    details.delivery = { city: city.name, prices };
    if (!prices.length || prices.some((price) => price !== city.price)) add("delivery_city_tariff", { city: city.name, expected: city.price, actual: prices });
  }
  for (const h1 of elements.filter((node) => node.tag === "h1")) {
    for (let node = h1; node?.parent; node = node.parent) {
      const style = node.attributes?.style ?? "";
      const classes = node.attributes?.class ?? "";
      if (/(?:^|;)\s*opacity\s*:\s*0(?:\.0+)?\s*(?:;|$)/i.test(style) || /(?:^|\s)opacity-0(?:\s|$)/.test(classes)) {
        details.essentialH1Visible = false;
        add("essential_h1_hidden_ssr", { tag: node.tag, style, classes });
        break;
      }
    }
  }
  const inputs = elements.filter((node) => node.tag === "input" && (/^(tel|email)$/i.test(node.attributes.type ?? "") || /^(phone|telephone|email|name)$/i.test(node.attributes.name ?? "")));
  for (const form of elements.filter((node) => node.tag === "form")) {
    const contacts = inputs.filter((input) => containsNode(form, input));
    if (!contacts.length) continue;
    details.contactForms += 1;
    if (form.attributes.method?.toLowerCase() !== "post") add("contact_form_native_get", "Contact-bearing SSR forms must declare method=post");
    if (pathname.startsWith("/blog/")) {
      const fieldsets = elements.filter((node) => node.tag === "fieldset" && containsNode(form, node) && /\sdisabled(?:\s|=|>)/i.test(node.opening));
      if (!contacts.every((input) => fieldsets.some((fieldset) => containsNode(fieldset, input)))) add("blog_form_ssr_not_disabled", "Contact inputs must remain disabled until the client submission handler is ready");
      let section = form.parent;
      while (section?.parent && section.tag !== "section") section = section.parent;
      const fallbacks = elements.filter((node) => node.tag === "noscript" && section && containsNode(section, node));
      const phoneLinks = elements.filter((node) => node.tag === "a" && /^tel:\+?\d/i.test(node.attributes.href ?? ""));
      if (!fallbacks.some((fallback) => phoneLinks.some((link) => containsNode(fallback, link)))) add("blog_form_phone_fallback_missing", "A noscript telephone alternative must accompany the disabled form");
    }
  }
  return { issues, details };
}

export function walkJson(value, callback) {
  if (Array.isArray(value)) return value.forEach((item) => walkJson(item, callback));
  if (!value || typeof value !== "object") return;
  callback(value);
  Object.values(value).forEach((item) => walkJson(item, callback));
}

// Bounded XML parsing for these generated feeds: no DTDs, external entities,
// namespaces expansion or network access. Provider acceptance is still separate.
export function parseXml(xml) {
  if (/<!DOCTYPE|<!ENTITY/i.test(xml)) throw new Error("DTD/entity declarations are not accepted");
  const stack = [];
  const roots = [];
  const tags = xml.matchAll(/<!--[\s\S]*?-->|<!\[CDATA\[[\s\S]*?\]\]>|<\?[\s\S]*?\?>|<\/?([A-Za-z_][\w:.-]*)(?:\s+(?:[^>"']|"[^"]*"|'[^']*')*)?\s*\/?>/g);
  const parseText = (text) => {
    if (/&(?!(?:amp|lt|gt|quot|apos|#\d+|#x[\da-fA-F]+);)/.test(text)) throw new Error("Invalid XML entity");
    return decodeEntities(text);
  };
  let end = 0;
  for (const match of tags) {
    const gap = xml.slice(end, match.index);
    if (gap.includes("<")) throw new Error("Malformed XML tag");
    if (!stack.length && gap.trim()) throw new Error("Text outside XML root");
    const decoded = parseText(gap);
    if (stack.length) stack.at(-1).text += decoded;
    end = match.index + match[0].length;
    if (match[0].startsWith("<![CDATA[")) {
      if (!stack.length) throw new Error("CDATA outside XML root");
      stack.at(-1).text += match[0].slice(9, -3);
      continue;
    }
    if (/^<\?|^<!--/.test(match[0])) continue;
    if (match[0].startsWith("</")) {
      if (!/^<\/[A-Za-z_][\w:.-]*\s*>$/.test(match[0]) || stack.pop()?.tag !== match[1]) throw new Error(`Mismatched XML closing tag ${match[1]}`);
    } else {
      const attributeText = match[0].slice(1 + match[1].length).replace(/\/?\s*>$/, "");
      const attributePattern = /\s+([\w:.-]+)\s*=\s*(?:"([^"<]*)"|'([^'<]*)')/g;
      const attributes = {};
      for (const attribute of attributeText.matchAll(attributePattern)) {
        if (Object.hasOwn(attributes, attribute[1])) throw new Error(`Duplicate XML attribute ${attribute[1]}`);
        attributes[attribute[1]] = parseText(attribute[2] ?? attribute[3]);
      }
      if (attributeText.replace(attributePattern, "").trim()) throw new Error("Invalid or unquoted XML attribute");
      const node = { tag: match[1], attributes, children: [], text: "" };
      if (!stack.length) roots.push(node);
      else stack.at(-1).children.push(node);
      if (!match[0].endsWith("/>")) stack.push(node);
    }
  }
  if (stack.length || roots.length !== 1 || xml.slice(end).trim()) throw new Error("Incomplete or multiple XML roots");
  return roots[0];
}

export function validateXml(xml) {
  parseXml(xml);
  return true;
}

export function inspectServicesFeed(xml, { canonicalOrigin = "https://kuhnitver.ru", expectedName = "Kuhnitver", expectedPhone, expectedAddress, stylePaths = [] } = {}) {
  const root = parseXml(xml);
  const issues = [];
  const add = (code, detail) => issues.push({ code, detail });
  const children = (node, tag) => node?.children.filter((child) => child.tag === tag) ?? [];
  const first = (node, tag) => children(node, tag)[0];
  const value = (node, tag) => first(node, tag)?.text.trim() ?? "";
  const requiredOne = (node, tag, code) => {
    const matches = children(node, tag);
    if (matches.length !== 1) add(code, `Expected exactly one ${tag}; found ${matches.length}`);
    return matches[0];
  };
  const sameOriginUrl = (text) => {
    try { const url = new URL(text); return ["http:", "https:"].includes(url.protocol) && url.origin === new URL(canonicalOrigin).origin; } catch { return false; }
  };
  if (root.tag !== "services_feed") return { format: root.tag, issues: [{ code: "services_feed_root", detail: root.tag }], executorCount: 0, serviceCount: 0, numericPrices: [], serviceUrls: [] };
  const allowedTop = ["source", "categories", "rubrics", "executors"];
  root.children.filter((node) => !allowedTop.includes(node.tag)).forEach((node) => add("services_feed_unknown_top_level", node.tag));
  const source = requiredOne(root, "source", "services_feed_source");
  for (const field of ["name", "url", "favicon", "locale"]) {
    requiredOne(source, field, "services_feed_source_field");
    if (!value(source, field)) add("services_feed_source_field", `Empty ${field}`);
  }
  if (value(source, "name") !== expectedName) add("services_feed_identity", { source: value(source, "name"), expectedName });
  if (!sameOriginUrl(value(source, "url")) || normalizedUrl(value(source, "url"), canonicalOrigin) !== normalizedUrl(canonicalOrigin)) add("services_feed_source_url", value(source, "url"));
  if (!sameOriginUrl(value(source, "favicon"))) add("services_feed_favicon_url", value(source, "favicon"));
  if (value(source, "locale") !== "ru") add("services_feed_locale", value(source, "locale"));
  if (children(root, "categories").length > 1) add("services_feed_categories", "Multiple categories blocks");
  const categories = children(first(root, "categories"), "category");
  const categoryIds = new Set();
  for (const category of categories) {
    const id = value(category, "persistent_id");
    if (!id || !value(category, "name")) add("services_feed_category_fields", id);
    if (categoryIds.has(id)) add("services_feed_category_duplicate", id);
    categoryIds.add(id);
  }
  for (const category of categories) {
    const id = value(category, "persistent_id");
    const parentId = value(category, "parent_id");
    if (parentId && (!categoryIds.has(parentId) || parentId === id)) add("services_feed_category_parent", { id, parentId });
  }
  const executorBlock = requiredOne(root, "executors", "services_feed_executors");
  const executors = children(executorBlock, "executor");
  if (executors.length !== 1) add("services_feed_executor_count", { expected: 1, actual: executors.length });
  const services = [];
  const serviceUrls = [];
  const numericPrices = [];
  for (const executor of executors) {
    for (const field of ["name", "url", "is_organization"]) {
      requiredOne(executor, field, "services_feed_executor_field");
      if (!value(executor, field)) add("services_feed_executor_field", `Empty ${field}`);
    }
    if (value(executor, "name") !== expectedName) add("services_feed_identity", { executor: value(executor, "name"), expectedName });
    if (!sameOriginUrl(value(executor, "url"))) add("services_feed_executor_url", value(executor, "url"));
    if (!["1", "true"].includes(value(executor, "is_organization"))) add("services_feed_organization", value(executor, "is_organization"));
    if (expectedPhone) {
      const phones = children(first(first(executor, "contacts"), "phones"), "phone");
      const primary = phones.filter((phone) => ["1", "true"].includes(phone.attributes.is_primary));
      const cleanPhone = (text) => text.replace(/[^+\d]/g, "");
      if (primary.length !== 1 || cleanPhone(primary[0]?.text ?? "") !== cleanPhone(expectedPhone)) add("services_feed_phone_mismatch", { expected: expectedPhone, primary: primary.map((phone) => phone.text.trim()) });
    }
    if (expectedAddress) {
      const addresses = children(first(first(executor, "geo_info"), "addresses"), "address").map((address) => value(address, "text"));
      if (!addresses.includes(expectedAddress)) add("services_feed_address_mismatch", { expected: expectedAddress, addresses });
    }
    if (first(executor, "ugc")) add("services_feed_unverified_rating", "No verified rating/review aggregates are configured");
    const serviceBlock = requiredOne(executor, "services", "services_feed_services");
    const executorServices = children(serviceBlock, "service");
    const serviceIds = new Set();
    for (const service of executorServices) {
      services.push(service);
      const id = value(service, "persistent_id");
      const name = value(service, "name");
      const url = value(service, "url");
      if (!id || !name) add("services_feed_service_fields", { id, name });
      if (serviceIds.has(id)) add("services_feed_service_duplicate", id);
      serviceIds.add(id);
      if (!sameOriginUrl(url)) add("services_feed_service_url", { id, url });
      else serviceUrls.push(normalizedUrl(url));
      const categoryId = value(service, "category_id");
      if (first(root, "categories") && categoryId && !categoryIds.has(categoryId)) add("services_feed_service_category", { id, categoryId });
      const price = requiredOne(service, "price", "services_feed_price");
      if (!price || !["1", "true"].includes(value(price, "is_negotiable"))) add("services_feed_quote_only_price", id);
      for (const numericType of ["from", "exact", "is_free"]) {
        if (first(price, numericType)) {
          numericPrices.push({ id, type: numericType, value: value(first(price, numericType), "value") || value(price, numericType) });
          add("services_feed_quote_only_numeric_price", { id, type: numericType });
        }
      }
      if (first(price, "value")) add("services_feed_quote_only_numeric_price", { id, value: value(price, "value") });
    }
  }
  const expectedServiceCount = stylePaths.length ? stylePaths.length + 2 : 9;
  if (services.length !== expectedServiceCount) add("services_feed_service_count", { expected: expectedServiceCount, actual: services.length });
  for (const pathname of [...stylePaths, "/price", "/dostavka"]) {
    if (!serviceUrls.includes(normalizedUrl(pathname, canonicalOrigin))) add("services_feed_missing_service_url", pathname);
  }
  return { format: "services_feed", issues, executorCount: executors.length, serviceCount: services.length, numericPrices, serviceUrls };
}

export function normalizedUrl(value, base) {
  const url = new URL(value, base);
  url.hash = "";
  url.search = "";
  url.pathname = url.pathname.replace(/\/+$/, "") || "/";
  return url.href;
}

export function inspectClaims(page, date = new Date().toISOString().slice(0, 10)) {
  const issues = [];
  const types = new Set();
  const offers = [];
  const localPath = new URL(page.url).pathname;
  walkJson(page.schema, (node) => {
    const nodeTypes = Array.isArray(node["@type"]) ? node["@type"] : [node["@type"]];
    nodeTypes.filter(Boolean).forEach((type) => types.add(type));
    if (nodeTypes.some((type) => ["Offer", "AggregateOffer"].includes(type))) {
      offers.push(node);
      if (node.priceValidUntil && node.priceValidUntil < date) issues.push({ code: "expired_offer", detail: node.priceValidUntil });
      if (/InStock$/.test(node.availability ?? "")) issues.push({ code: "unsupported_stock_claim", detail: node.availability });
      if (nodeTypes.includes("AggregateOffer") && (node.lowPrice !== undefined || node.highPrice !== undefined)) issues.push({ code: "unqualified_aggregate_price", detail: `${node.lowPrice ?? ""}–${node.highPrice ?? ""}` });
      if (node.price !== undefined) {
        const number = String(node.price).replace(/\s/g, "");
        const visibleNumbers = page.text.replace(/[\s\u00a0\u202f]/g, "");
        if (!visibleNumbers.includes(number)) issues.push({ code: "hidden_offer_price", detail: node.price });
        if (localPath.startsWith("/catalog") && /индивидуальн[\p{L}]*\s+расч[её]т/iu.test(page.text)) issues.push({ code: "quote_only_numeric_offer", detail: node.price });
      }
    }
  });
  if (/^\/(catalog(?:\/[^/]+)?|price)\/?$/.test(localPath) && types.has("Product")) issues.push({ code: "category_marked_product", detail: localPath });
  if (/^\/(catalog(?:\/[^/]+)?|price)\/?$/.test(localPath) && /индивидуальн[\p{L}]*\s+расч[её]т/iu.test(page.text)) {
    const metadataText = [...(page.title ?? []), ...(page.descriptions ?? [])].join(" ");
    if (/\d[\d\s\u00a0\u202f]*\s*(?:₽|руб\.?|р\.(?:\s|\/))/iu.test(metadataText)) issues.push({ code: "quote_only_metadata_price", detail: metadataText });
  }
  if (/^\/catalog\/[^/]+\/?$/.test(localPath) && !types.has("Service")) issues.push({ code: "style_missing_service", detail: localPath });
  if (localPath === "/catalog" && !types.has("CollectionPage")) issues.push({ code: "catalog_missing_collection", detail: localPath });
  if (/^\/(contacts|kuhni\/tveri)\/?$/.test(localPath) && /бесплатн[\p{L}]*\s+замер/iu.test(page.text) && /замер[\s\S]{0,90}1\s*500/i.test(page.text)) issues.push({ code: "conflicting_measurement_price", detail: "Both free measurement and 1,500 RUB appear" });
  if (localPath === "/dostavka") {
    if (page.title.some((title) => /бесплатн[\s\S]*област/i.test(title))) issues.push({ code: "delivery_metadata_overpromise", detail: page.title[0] });
    for (const [city, incorrect, other] of [["Конаково", "3\\s*000", "3\\s*500"], ["Ржев", "4\\s*000", "5\\s*000"]]) {
      if (new RegExp(`${city}[\\s\\S]{0,100}${incorrect}`, "i").test(page.text) && new RegExp(`${city}[\\s\\S]{0,100}${other}`, "i").test(page.text)) issues.push({ code: "conflicting_delivery_price", detail: city });
    }
  }
  if (/№\s*1|98\s*%\s*(?:клиент|рекоменду)/i.test(page.text)) issues.push({ code: "unsubstantiated_superlative", detail: "Ranking/recommendation statistic needs evidence" });
  return { issues, types: [...types].sort(), offers };
}

async function request(url, options = {}) {
  const start = performance.now();
  try {
    const response = await fetch(url, { redirect: "follow", signal: AbortSignal.timeout(30000), ...options });
    const body = await response.text();
    return { status: response.status, finalUrl: response.url, durationMs: Math.round(performance.now() - start), headers: Object.fromEntries(response.headers), body };
  } catch (error) {
    return { status: null, finalUrl: url, durationMs: Math.round(performance.now() - start), headers: {}, body: "", error: error.message };
  }
}

async function mapLimit(values, limit, callback) {
  const results = Array(values.length);
  let index = 0;
  await Promise.all(Array.from({ length: Math.min(limit, values.length) }, async () => {
    while (index < values.length) { const current = index++; results[current] = await callback(values[current], current); }
  }));
  return results;
}

export async function audit({ baseUrl, canonicalOrigin = "https://kuhnitver.ru" }) {
  const startedAt = new Date().toISOString();
  const base = new URL(baseUrl).origin;
  const canonical = new URL(canonicalOrigin).origin;
  const findings = [];
  const issue = (code, url, detail, severity = "error") => findings.push({ code, url, detail, severity });
  const sitemap = await request(`${base}/sitemap.xml`);
  let paths = [];
  if (sitemap.status !== 200) issue("sitemap_status", `${base}/sitemap.xml`, sitemap.status ?? sitemap.error);
  else {
    try { validateXml(sitemap.body); } catch (error) { issue("sitemap_xml", `${base}/sitemap.xml`, error.message); }
    paths = [...sitemap.body.matchAll(/<loc>\s*([^<]+)\s*<\/loc>/g)].map((match) => {
      const url = new URL(decodeEntities(match[1]));
      if (url.origin !== canonical) issue("sitemap_noncanonical_origin", url.href, canonical);
      return url.pathname;
    });
    if (!paths.length) issue("sitemap_empty", `${base}/sitemap.xml`, "No page URLs");
    if (new Set(paths).size !== paths.length) issue("sitemap_duplicate_url", `${base}/sitemap.xml`, paths.length);
  }
  const pages = await mapLimit(paths, 3, async (pathname) => {
    const url = `${base}${pathname}`;
    const response = await request(url);
    const parsed = parseHtml(response.body);
    const expectedCanonical = normalizedUrl(`${canonical}${pathname}`);
    if (response.status !== 200) issue("page_status", url, response.status ?? response.error);
    if (parsed.title.length !== 1 || !parsed.title[0]) issue("page_title", url, parsed.title);
    if (parsed.h1.length !== 1 || !parsed.h1[0]) issue("page_h1", url, parsed.h1);
    let canonicalMatches = false;
    try { canonicalMatches = parsed.canonical.length === 1 && normalizedUrl(parsed.canonical[0], canonical) === expectedCanonical; } catch { /* invalid canonical is reported below */ }
    if (!canonicalMatches) issue("page_canonical", url, parsed.canonical);
    if (parsed.text.length < 300) issue("server_html_content", url, parsed.text.length);
    const directives = [...parsed.robots.map((meta) => meta.content), response.headers["x-robots-tag"] ?? ""].join(",");
    if (/\b(noindex|nosnippet)\b/i.test(directives)) issue("robots_blocking", url, directives);
    parsed.jsonldErrors.forEach((error) => issue("jsonld_syntax", url, error));
    if (!parsed.schema.length) issue("jsonld_missing", url, "No JSON-LD");
    const claims = inspectClaims({ ...parsed, url });
    claims.issues.forEach(({ code, detail }) => issue(code, url, detail));
    const rendered = inspectRenderedPage(response.body, pathname.replace(/\/$/, "") || "/");
    rendered.issues.forEach(({ code, detail }) => issue(code, url, detail));
    let localBusiness = null;
    walkJson(parsed.schema, (node) => {
      const nodeTypes = Array.isArray(node["@type"]) ? node["@type"] : [node["@type"]];
      if (nodeTypes.includes("LocalBusiness")) localBusiness = { name: node.name, phone: node.telephone, address: node.address?.streetAddress && node.address?.addressLocality ? `${node.address.addressLocality}, ${node.address.streetAddress}` : undefined };
    });
    return { url, canonicalUrl: expectedCanonical, finalUrl: response.finalUrl, status: response.status, durationMs: response.durationMs, title: parsed.title, h1: parsed.h1, canonical: parsed.canonical, descriptions: parsed.descriptions, robots: parsed.robots, xRobotsTag: response.headers["x-robots-tag"] ?? null, htmlBytes: Buffer.byteLength(response.body), htmlSha256: createHash("sha256").update(response.body).digest("hex"), textCharacters: parsed.text.length, schemaTypes: claims.types, offers: claims.offers, localBusiness, renderedFacts: rendered.details, links: parsed.links, jsonldErrors: parsed.jsonldErrors };
  });
  const seenTitles = new Map();
  const inbound = new Map(paths.map((pathname) => [normalizedUrl(`${canonical}${pathname}`), 0]));
  for (const page of pages) {
    if (seenTitles.has(page.title[0])) issue("duplicate_title", page.url, seenTitles.get(page.title[0]));
    seenTitles.set(page.title[0], page.url);
    for (const href of page.links) {
      try {
        const target = new URL(href, page.url);
        if (![base, canonical].includes(target.origin)) continue;
        const key = normalizedUrl(`${canonical}${target.pathname}`);
        if (inbound.has(key) && key !== page.canonicalUrl) inbound.set(key, inbound.get(key) + 1);
      } catch { /* mailto/tel/malformed links are not crawl graph entries */ }
    }
  }
  for (const page of pages) {
    page.inboundLinks = inbound.get(page.canonicalUrl) ?? 0;
    if (!page.inboundLinks && new URL(page.url).pathname !== "/") issue("orphan_page", page.url, "No incoming HTML link from another sitemap page");
    delete page.links;
  }
  const robots = await request(`${base}/robots.txt`);
  if (robots.status !== 200) issue("robots_status", `${base}/robots.txt`, robots.status ?? robots.error);
  for (const excluded of ["/api/", "/admin/", "/private/"]) if (!robots.body.includes(`Disallow: ${excluded}`)) issue("robots_missing_exclusion", `${base}/robots.txt`, excluded);
  if (/crawl-delay/i.test(robots.body)) issue("robots_obsolete_crawl_delay", `${base}/robots.txt`, "Remove obsolete Yandex Crawl-delay");
  const yandexGroup = robots.body.match(/User-agent:\s*Yandex[^\n]*\n([\s\S]*?)(?=\nUser-agent:|$)/i)?.[1];
  if (yandexGroup && !["/api/", "/admin/", "/private/"].every((value) => yandexGroup.includes(`Disallow: ${value}`))) issue("robots_yandex_override", `${base}/robots.txt`, "Yandex-specific group loses wildcard exclusions");
  const feeds = {};
  for (const [name, pathname] of [["rss", "/blog.rss"], ["yml", "/uslugi.yml"]]) {
    const response = await request(`${base}${pathname}`);
    const feed = { status: response.status, contentType: response.headers["content-type"], durationMs: response.durationMs, retired: name === "yml" && response.status === 410, itemCount: 0, xmlValid: false };
    if (response.status !== 200) issue("feed_status", `${base}${pathname}`, response.status ?? response.error);
    if (response.status === 200) {
      try { validateXml(response.body); feed.xmlValid = true; } catch (error) { issue("feed_xml", `${base}${pathname}`, error.message); }
      feed.itemCount = [...response.body.matchAll(name === "rss" ? /<item(?:\s|>)/g : /<offer(?:\s|>)/g)].length;
      if (name === "yml") {
        if (/<services_feed(?:\s|>)/.test(response.body) && feed.xmlValid) {
          const identity = pages.find((page) => new URL(page.url).pathname === "/")?.localBusiness;
          const result = inspectServicesFeed(response.body, { canonicalOrigin: canonical, expectedName: identity?.name ?? "Kuhnitver", expectedPhone: identity?.phone, expectedAddress: identity?.address, stylePaths: paths.filter((value) => /^\/catalog\/[^/]+\/?$/.test(value)) });
          feed.format = result.format;
          feed.itemCount = result.serviceCount;
          feed.executorCount = result.executorCount;
          feed.numericPrices = result.numericPrices;
          feed.serviceUrls = result.serviceUrls;
          result.issues.forEach(({ code, detail }) => issue(code, `${base}${pathname}`, detail));
        } else {
          feed.format = "legacy_yml_catalog";
          feed.numericPrices = [...response.body.matchAll(/<price\b[^>]*>([^<]*)<\/price>/g)].map((match) => decodeEntities(match[1]));
          for (const offer of response.body.matchAll(/<offer\b[^>]*>[\s\S]*?<\/offer>/g)) {
            if (/<url>[^<]*\/catalog\//.test(offer[0]) && /<price\b/.test(offer[0])) issue("yml_quote_only_numeric_price", `${base}${pathname}`, offer[0].match(/id="([^"]+)"/)?.[1]);
          }
          if (/<param name="Конверсия">1<\/param>/.test(response.body)) issue("yml_invented_conversion", `${base}${pathname}`, "Conversion is not a measured business property");
        }
      } else {
        const articleCount = paths.filter((pathname) => /^\/blog\/[^/]+\/?$/.test(pathname)).length;
        if (feed.itemCount !== articleCount) issue("rss_article_count", `${base}${pathname}`, { rss: feed.itemCount, sitemap: articleCount });
      }
    }
    feeds[name] = feed;
  }
  const llms = await request(`${base}/llms.txt`);
  if (![200, 404].includes(llms.status)) issue("llms_status", `${base}/llms.txt`, llms.status ?? llms.error);
  if (llms.status === 200 && !/^#\s+\S/m.test(llms.body)) issue("llms_heading", `${base}/llms.txt`, "Expected Markdown title");
  const notFound = await request(`${base}/__seo-audit-missing-20261030`);
  const missingMeta = parseHtml(notFound.body);
  if (notFound.status !== 404) issue("missing_page_status", notFound.finalUrl, notFound.status);
  if (!/noindex/i.test([...missingMeta.robots.map((item) => item.content), notFound.headers["x-robots-tag"] ?? ""].join(","))) issue("missing_page_noindex", notFound.finalUrl, "404 should be noindex");
  const utm = await request(`${base}/?utm_source=seo_audit&utm_medium=verification`);
  const utmCanonical = parseHtml(utm.body).canonical;
  let cleanUtmCanonical = false;
  try { cleanUtmCanonical = utmCanonical.length === 1 && !new URL(utmCanonical[0], canonical).search && normalizedUrl(utmCanonical[0], canonical) === normalizedUrl(canonical); } catch { /* invalid canonical is reported below */ }
  if (!cleanUtmCanonical) issue("utm_canonical", `${base}/?utm_source=seo_audit`, utmCanonical);
  const redirects = [];
  for (const url of [`${base}/catalog/loft/`, ...(base.startsWith("https:") && !/localhost|127\.0\.0\.1/.test(base) ? [`http://${new URL(base).host}/`, `https://www.${new URL(base).host}/`] : [])]) {
    const response = await request(url, { redirect: "manual" });
    redirects.push({ url, status: response.status, location: response.headers.location ?? null });
    if (![301, 308].includes(response.status)) issue("permanent_redirect", url, response.status ?? response.error);
  }
  const bots = await mapLimit(Object.entries(BOT_AGENTS), 2, async ([name, userAgent]) => {
    const response = await request(base, { headers: { "user-agent": userAgent } });
    if (response.status !== 200) issue("user_agent_access", base, { name, status: response.status, error: response.error });
    return { name, status: response.status, durationMs: response.durationMs };
  });
  return {
    schemaVersion: 1, startedAt, finishedAt: new Date().toISOString(), timezone: "Europe/Moscow", baseUrl: base, canonicalOrigin: canonical,
    method: "Public read-only HTTP GET from auditor IP; no form submission and no browser execution.",
    limits: ["User-Agent probes do not establish access from genuine crawler networks.", "The bounded XML/parser and services_feed checks cover documented required fields and site invariants, not every provider ingestion rule or actual platform acceptance.", "HTTP timing is not Core Web Vitals.", "JSON-LD syntax/applicability checks do not substitute for supported provider validators.", "No authenticated search-console or AI-answer observations are implied."],
    summary: { sitemapUrls: paths.length, http200: pages.filter((page) => page.status === 200).length, uniqueTitles: seenTitles.size, singleH1: pages.filter((page) => page.h1.length === 1).length, errors: findings.filter((finding) => finding.severity === "error").length, warnings: findings.filter((finding) => finding.severity === "warning").length },
    findings, pages, robots: { status: robots.status, text: robots.body }, feeds, llms: { status: llms.status }, notFound: { status: notFound.status, robots: missingMeta.robots }, utmCanonical, redirects, bots,
  };
}

export function selfTest() {
  const html = parseHtml('<html><head><title>A &amp; B</title><link href="https://x.test/" rel="canonical"><meta name="robots" content="index, follow"></head><body><h1>Hello</h1><p>Quote only</p><script type="application/ld+json">{"@type":"Service"}</script><a href="/price">Price</a></body></html>');
  assert.deepEqual(html.title, ["A & B"]);
  assert.equal(html.text, "Hello Quote only Price");
  assert.deepEqual(html.canonical, ["https://x.test/"]);
  assert.equal(html.schema[0]["@type"], "Service");
  assert.equal(validateXml('<?xml version="1.0"?><rss><channel><item><title><![CDATA[A < B]]></title></item></channel></rss>'), true);
  assert.throws(() => validateXml("<rss><channel></rss>"));
  assert.throws(() => validateXml("<rss/><rss/>"));
  assert.throws(() => validateXml('<!DOCTYPE rss SYSTEM "https://x.test/entity"><rss/>'));
  assert.throws(() => validateXml('<rss attr="x" attr="y"/>'), /Duplicate/);
  assert.throws(() => validateXml('<rss attr=unquoted/>'), /attribute/);
  assert.throws(() => validateXml('<rss>A & B</rss>'), /entity/);
  const stylePaths = Array.from({ length: 7 }, (_, index) => `/catalog/style-${index}`);
  const servicePaths = [...stylePaths, "/price", "/dostavka"];
  const modernFeed = `<services_feed version="2026"><source><name>Kuhnitver</name><url>https://kuhnitver.ru</url><favicon>https://kuhnitver.ru/favicon.ico</favicon><locale>ru</locale></source><categories><category><persistent_id>kitchens</persistent_id><name>Кухни</name></category></categories><executors><executor><name>Kuhnitver</name><url>https://kuhnitver.ru/contacts</url><is_organization>1</is_organization><services>${servicePaths.map((pathname, index) => `<service><persistent_id>s${index}</persistent_id><url>https://kuhnitver.ru${pathname}</url><name>Услуга ${index}</name><category_id>kitchens</category_id><price><is_negotiable>1</is_negotiable></price></service>`).join("")}</services></executor></executors></services_feed>`;
  const modernResult = inspectServicesFeed(modernFeed, { stylePaths });
  assert.deepEqual(modernResult.issues, []);
  assert.equal(modernResult.executorCount, 1);
  assert.equal(modernResult.serviceCount, 9);
  assert.deepEqual(modernResult.numericPrices, []);
  const contradictoryPrice = inspectServicesFeed(modernFeed.replace("<is_negotiable>1</is_negotiable>", "<is_negotiable>1</is_negotiable><exact><value>25000</value><currency>RUB</currency></exact>"), { stylePaths });
  assert(contradictoryPrice.issues.some((item) => item.code === "services_feed_quote_only_numeric_price"));
  assert(inspectServicesFeed(modernFeed.replace("<locale>ru</locale>", "<locale>en</locale>"), { stylePaths }).issues.some((item) => item.code === "services_feed_locale"));
  assert(inspectServicesFeed(modernFeed.replace("<category_id>kitchens</category_id>", "<category_id>unknown</category_id>"), { stylePaths }).issues.some((item) => item.code === "services_feed_service_category"));
  assert(inspectServicesFeed(modernFeed.replace("<persistent_id>s1</persistent_id>", "<persistent_id>s0</persistent_id>"), { stylePaths }).issues.some((item) => item.code === "services_feed_service_duplicate"));
  const contactFeed = modernFeed.replace("<is_organization>1</is_organization>", '<is_organization>1</is_organization><contacts><phones><phone is_primary="1">+48 22 477 08 1</phone></phones></contacts><geo_info><addresses><address><text>Тверь, ул. Николая Корыткова, 3 ст1</text></address></addresses></geo_info>');
  const contactOptions = { stylePaths, expectedPhone: "+4822477081", expectedAddress: "Тверь, ул. Николая Корыткова, 3 ст1" };
  assert.deepEqual(inspectServicesFeed(contactFeed, contactOptions).issues, []);
  assert(inspectServicesFeed(contactFeed.replace("+48 22 477 08 1", "+79157220075"), contactOptions).issues.some((item) => item.code === "services_feed_phone_mismatch"));
  assert(inspectServicesFeed(contactFeed.replace("Николая Корыткова", "Авангардная"), contactOptions).issues.some((item) => item.code === "services_feed_address_mismatch"));
  const bad = inspectClaims({ url: "https://x.test/catalog/loft", title: [], text: "Индивидуальный расчёт", schema: [{ "@type": "Product", offers: { "@type": "Offer", price: 25000, priceValidUntil: "2020-01-01", availability: "https://schema.org/InStock" } }] }, "2026-10-30");
  for (const code of ["expired_offer", "unsupported_stock_claim", "hidden_offer_price", "quote_only_numeric_offer", "category_marked_product"]) assert(bad.issues.some((item) => item.code === code), code);
  assert.equal(normalizedUrl("/catalog/loft/?utm_source=x#x", "https://x.test"), "https://x.test/catalog/loft");
  const measurementHtml = '<h1>Контакты</h1><p>Замер стоит 1&nbsp;500 ₽. При заказе кухни эта сумма вычитается из её стоимости.</p>';
  assert.deepEqual(inspectRenderedPage(measurementHtml, "/contacts").issues, []);
  const unconfirmedPostal = inspectRenderedPage(`<head><meta itemProp="postalCode" content="170000"></head>${measurementHtml}`, "/contacts");
  assert(unconfirmedPostal.issues.some((issue) => issue.code === "unconfirmed_postal_code"));
  assert.deepEqual(inspectRenderedPage(`<script>const example='<meta itemProp="postalCode" content="170000">';</script>${measurementHtml}`, "/contacts").issues, []);
  const wrongMeasurement = inspectRenderedPage(measurementHtml.replace("1&nbsp;500", "2 000"), "/contacts");
  assert(wrongMeasurement.issues.some((issue) => issue.code === "measurement_price_conflict"));
  assert(inspectRenderedPage('<h1>Вопросы</h1><p>Бесплатный замер.</p>', "/faq").issues.some((issue) => issue.code === "free_measurement_claim"));
  assert(inspectRenderedPage('<h1>Цены</h1><p>Замер стоит 1 500 ₽.</p>', "/price").issues.some((issue) => issue.code === "measurement_credit_missing"));
  const deliveryHtml = '<h1>Доставка</h1><table><tr><th>Город</th><th>Дата</th><th>Стоимость</th></tr><tr><th>Тверь</th><td>По согласованию</td><td>Включена в стоимость кухни</td></tr><tr><th>Торжок</th><td>По согласованию</td><td>от 3 000 ₽</td></tr><tr><th>Ржев</th><td>По согласованию</td><td>от 5 000 ₽</td></tr><tr><th>Конаково</th><td>По согласованию</td><td>от 3 500 ₽</td></tr><tr><th>Кимры</th><td>По согласованию</td><td>от 4 000 ₽</td></tr><tr><th>Вышний Волочёк</th><td>По согласованию</td><td>от 5 000 ₽</td></tr><tr><th>Бежецк</th><td>По согласованию</td><td>от 6 000 ₽</td></tr><tr><th>Нелидово</th><td>По согласованию</td><td>от 7 000 ₽</td></tr></table>';
  assert.deepEqual(inspectRenderedPage(deliveryHtml, "/dostavka").issues, []);
  const wrongDelivery = inspectRenderedPage(deliveryHtml.replace("от 3 500 ₽", "от 3 000 ₽").replace('<th>Ржев</th><td>По согласованию</td><td>от 5 000 ₽', '<th>Ржев</th><td>По согласованию</td><td>от 4 000 ₽'), "/dostavka");
  assert.deepEqual(wrongDelivery.issues.filter((issue) => issue.code === "delivery_table_tariff").map((issue) => issue.detail.city), ["Ржев", "Конаково"]);
  const cityHtml = '<h1>Кухни в Конаково</h1><div><div>от 3&nbsp;500 ₽</div><div>стоимость доставки</div></div><p>Замер стоит 1 500 ₽.</p><footer>В Ржев от 5 000 ₽.</footer>';
  assert.deepEqual(inspectRenderedPage(cityHtml, "/kuhni/konakovo").issues, []);
  assert(inspectRenderedPage(cityHtml.replace("3&nbsp;500", "3 000"), "/kuhni/konakovo").issues.some((issue) => issue.code === "delivery_city_tariff"));
  assert(inspectRenderedPage('<main style="opacity:0"><h1>Кухни</h1></main>', "/").issues.some((issue) => issue.code === "essential_h1_hidden_ssr"));
  assert.deepEqual(inspectRenderedPage('<main style="opacity:1"><h1>Кухни</h1><div style="opacity:0"><h2>Закрытое окно</h2></div></main>', "/").issues, []);
  const blogFormHtml = '<h1>Статья</h1><section><form method="post"><fieldset disabled=""><label for="phone">Телефон</label><input id="phone" name="phone" type="tel"><button type="submit">Получить расчёт</button></fieldset></form><noscript><p>Позвоните <a href="tel:+74822477081">+7 (4822) 47-70-81</a></p></noscript></section>';
  assert.deepEqual(inspectRenderedPage(blogFormHtml, "/blog/example").issues, []);
  assert(inspectRenderedPage(blogFormHtml.replace(' method="post"', ""), "/blog/example").issues.some((issue) => issue.code === "contact_form_native_get"));
  assert(inspectRenderedPage(blogFormHtml.replace(' disabled=""', ""), "/blog/example").issues.some((issue) => issue.code === "blog_form_ssr_not_disabled"));
  assert(inspectRenderedPage(blogFormHtml.replace(/<noscript>[\s\S]*?<\/noscript>/, ""), "/blog/example").issues.some((issue) => issue.code === "blog_form_phone_fallback_missing"));
  return { passed: true };
}

async function main(args) {
  if (args.includes("--self-test")) { console.log(JSON.stringify(selfTest())); return; }
  if (args.includes("--help")) {
    console.log("node scripts/seo-audit.mjs --base-url https://kuhnitver.ru --output docs/seo/measurement/before.json [--strict] [--canonical-origin https://kuhnitver.ru]\n--strict exits 1 when acceptance errors exist. Default records baseline defects without failing. Read-only: no forms submitted.");
    return;
  }
  const option = (name, fallback) => { const index = args.indexOf(name); return index >= 0 ? args[index + 1] : fallback; };
  const result = await audit({ baseUrl: option("--base-url", "https://kuhnitver.ru"), canonicalOrigin: option("--canonical-origin", "https://kuhnitver.ru") });
  const output = option("--output");
  if (output) { await mkdir(path.dirname(path.resolve(output)), { recursive: true }); await writeFile(output, `${JSON.stringify(result, null, 2)}\n`); }
  console.log(JSON.stringify({ ...result.summary, startedAt: result.startedAt, output: output ?? null, findingCounts: result.findings.reduce((counts, finding) => { counts[finding.code] = (counts[finding.code] ?? 0) + 1; return counts; }, {}) }, null, 2));
  if (args.includes("--strict") && result.summary.errors) process.exitCode = 1;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main(process.argv.slice(2)).catch((error) => { console.error(error.message); process.exitCode = 1; });
