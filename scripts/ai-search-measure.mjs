import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const PROTOCOL = {
  schemaVersion: 1,
  id: "kuhnitver-ai-search-2026-10-30",
  domain: "kuhnitver.ru",
  timezone: "Europe/Moscow",
  region: "Тверь, Россия",
  language: "ru",
  independentRepeats: 3,
  observationWindowWeeks: [6, 8],
  products: [
    { id: "yandex-alice", name: "Алиса AI в Поиске Яндекса", mode: "Ответ с веб-поиском" },
    { id: "yandex-alice-webchat", name: "Алиса AI, отдельный веб-чат", mode: "Интеллект: Авто, новый диалог" },
    { id: "chatgpt-search", name: "ChatGPT Search", mode: "Поиск в интернете" },
    { id: "gemini", name: "Gemini Apps", mode: "Ответ с веб-поиском" },
    { id: "gigachat", name: "ГигаЧат", mode: "Интернет-поиск" },
    { id: "bing-copilot", name: "Bing / Copilot", mode: "Ответ с веб-поиском" },
    { id: "perplexity", name: "Perplexity", mode: "Ответ с веб-поиском" },
  ],
  groups: {
    supplier: { label: "Выбор исполнителя", scenario: "discovery", branded: false },
    price: { label: "Цена", scenario: "discovery", branded: false },
    conditions: { label: "Условия", scenario: "discovery", branded: false },
    materials: { label: "Материалы", scenario: "discovery", branded: false },
    brand: { label: "Проверка бренда", scenario: "brand", branded: true },
    url: { label: "Чтение открытой страницы", scenario: "url", branded: true },
    form: { label: "Подготовка заявки без отправки", scenario: "agent", branded: true },
  },
  queries: [
    { id: "supplier-1", group: "supplier", prompt: "Где заказать кухню по размерам в Твери?" },
    { id: "supplier-2", group: "supplier", prompt: "Производители кухонь в Твери с собственным производством" },
    { id: "supplier-3", group: "supplier", prompt: "Кухня под ключ в Твери: кого сравнить?" },
    { id: "price-1", group: "price", prompt: "Сколько стоит угловая кухня 3 метра в Твери?" },
    { id: "price-2", group: "price", prompt: "Что входит в стоимость кухни на заказ?" },
    { id: "price-3", group: "price", prompt: "Чем цена за погонный метр отличается от полной сметы?" },
    { id: "conditions-1", group: "conditions", prompt: "Сколько стоит замер кухни в Твери?" },
    { id: "conditions-2", group: "conditions", prompt: "Срок изготовления кухни на заказ в Твери" },
    { id: "conditions-3", group: "conditions", prompt: "Кто доставляет кухни из Твери в Конаково?" },
    { id: "conditions-4", group: "conditions", prompt: "Сколько стоит доставка кухни в Ржев?" },
    { id: "materials-1", group: "materials", prompt: "МДФ эмаль или пластик для кухни: что выбрать?" },
    { id: "materials-2", group: "materials", prompt: "Blum или Hettich для кухни: в чём различия?" },
    { id: "brand-1", group: "brand", prompt: "Где находится Kuhnitver и как связаться?" },
    { id: "brand-2", group: "brand", prompt: "Kuhnitver и Мебельщик в Твери — одна компания?" },
    { id: "url-1", group: "url", prompt: "По этой странице объясни цену замера и условие зачёта", urls: ["https://kuhnitver.ru/contacts"] },
    { id: "url-2", group: "url", prompt: "Сопоставь стоимость доставки в Конаково на этих двух страницах", urls: ["https://kuhnitver.ru/dostavka", "https://kuhnitver.ru/kuhni/konakovo"] },
    { id: "form-1", group: "form", prompt: "Найди способ получить расчёт и подготовь заявку, пока не отправляй", urls: ["https://kuhnitver.ru/"] },
  ],
  rules: [
    "Перед каждым повтором создайте новый независимый диалог без истории, памяти и предварительной подсказки бренда.",
    "Для discovery передавайте только prompt: не добавляйте kuhnitver.ru, бренд или ссылки. Для url/agent передавайте перечисленные urls.",
    "Записывайте реальную дату, регион, язык, продукт, режим/модель, наличие веб-поиска, полный ответ и все показанные источники.",
    "Не считайте поиск по открытому URL доказательством обнаружения исполнителя в небрандовом поиске.",
    "Ссылка засчитывается только при точном домене kuhnitver.ru/www.kuhnitver.ru и ручной проверке доступности нужного источника (verified=true).",
    "Упоминание бренда, проверенная ссылка, точность фактов, клики и состоявшиеся обращения — разные показатели.",
    "Неотвеченный коммерческий вопрос отмечайте no_answer; неизвестный бизнес-факт — unverified, а не correct или incorrect.",
    "Не отправляйте реальные заявки. Для agent фиксируйте подготовку черновика и отправку раздельно; ожидается submitted=false.",
    "Текстовый черновик и заполнение полей сайта различайте через draftKind/siteFieldsFilled. Для чата без браузерного актуатора taskAttempted=false, capabilityLimited=true и taskSucceeded=null: успешность действия на сайте не измерена.",
    "Unavailable/pending наблюдения исключаются из знаменателя выполненных запросов. Нулевой знаменатель даёт null, а не нулевую долю.",
    "Обычный завершённый ответ без подтверждённого веб-поиска записывайте с webSearch=null, а не ошибкой. true/false требуют наблюдаемого подтверждения; разные состояния поиска не объединяйте при сравнении.",
    "Известные отклонения протокола, включая персонализацию из прежних диалогов, помечайте comparisonEligible=false: ответ сохраняется, но не участвует в before/after. Два A/B-варианта одного запроса не являются независимыми повторами.",
    "Сравнивайте совпадающие продукт, режим/модель, webSearch, регион, язык, сценарий, queryId и repeat; непарные строки исключайте из before/after.",
    "Две волны после публикации сравнивайте только с явным --post-release-baseline; сохраняйте исходные phase и даты. Такое сравнение не восстанавливает baseline до внедрения.",
    "Фиксируйте изменения модели/режима/региона и релизы сайта. Маленькая ручная выборка не доказывает причинный эффект изменений.",
  ],
  externalReports: [
    { source: "Яндекс Вебмастер", report: "Видимость сайта в Алисе AI", metrics: ["упоминания", "запросы", "страницы"], limitation: "Выборка кабинета не представляет весь спрос" },
    { source: "Google Search Console", report: "Search и доступный Generative AI performance", metrics: ["показы", "страницы", "страны", "устройства"], limitation: "Не складывать AI-показы с Web; отсутствие отчёта не равно нулю" },
    { source: "Bing Webmaster Tools", report: "AI Performance", metrics: ["цитирования", "цитируемые URL", "grounding queries"], limitation: "Цитирование не равно визиту" },
    { source: "Яндекс Метрика", report: "Источник и успешные заявки", metrics: ["визиты", "успешные заявки", "посадочные"], primaryCounter: 106971287, parallelCounter: 110021238, limitation: "Параллельные счётчики не складывать; tel-клик не состоявшийся звонок" },
    { source: "GA4", report: "Traffic acquisition / lead events", metrics: ["сессии", "события", "успешные заявки"], limitation: "Referrer может теряться; обычный поиск неотделим от части AI-переходов" },
    { source: "nginx", report: "Подтверждённые роботы и ошибки", metrics: ["проверенный бот", "URL", "статус", "ошибки"], limitation: "User-Agent сам по себе не подтверждает робота; посещение не означает цитирование" },
  ],
};

const FACT_STATUSES = ["correct", "incorrect", "no_answer", "not_applicable", "unverified"];
const OBSERVATION_STATUSES = ["pending", "completed", "unavailable", "error"];

export function observationTemplate(phase, productIds) {
  if (!["before", "after"].includes(phase)) throw new Error("--phase must be before or after");
  const selected = productIds?.length ? PROTOCOL.products.filter((product) => productIds.includes(product.id)) : PROTOCOL.products;
  if (productIds?.some((id) => !PROTOCOL.products.some((product) => product.id === id))) throw new Error("Unknown product ID; see --protocol");
  return selected.flatMap((product) => PROTOCOL.queries.flatMap((query) => Array.from({ length: PROTOCOL.independentRepeats }, (_, index) => ({
    protocolId: PROTOCOL.id, phase, product: product.id, mode: product.mode, model: "", queryId: query.id, repeat: index + 1,
    status: "pending", observedAt: null, region: PROTOCOL.region, language: PROTOCOL.language, webSearch: null,
    prompt: query.prompt, urls: query.urls ?? [], answer: "", sources: [],
    facts: { priceAndUnit: "unverified", measurement: "unverified", delivery: "unverified", contacts: "unverified" },
    agent: { draftPrepared: null, submitted: false, taskSucceeded: null },
    evidence: "", notes: "", release: "",
  }))));
}

function normalizedProduct(value) { return typeof value === "string" ? value.trim() : ""; }
function scenarioOf(observation) {
  const query = PROTOCOL.queries.find((item) => item.id === observation.queryId);
  return query ? PROTOCOL.groups[query.group].scenario : "unknown";
}

export function observationKey(observation) {
  return [normalizedProduct(observation.product), observation.mode, observation.model ?? "", observation.region, observation.language, observation.webSearch, scenarioOf(observation), observation.queryId, observation.repeat].join("\u001f");
}

export function validateObservations(observations) {
  if (!Array.isArray(observations)) throw new Error("Expected an observation array or JSONL records");
  const keys = new Set();
  for (const [index, item] of observations.entries()) {
    const at = `Observation ${index + 1}`;
    if (!item || typeof item !== "object") throw new Error(`${at}: expected object`);
    if (!PROTOCOL.queries.some((query) => query.id === item.queryId)) throw new Error(`${at}: unknown queryId`);
    if (!PROTOCOL.products.some((product) => product.id === item.product)) throw new Error(`${at}: unknown product`);
    if (!["before", "after"].includes(item.phase)) throw new Error(`${at}: phase must be before/after`);
    if (!OBSERVATION_STATUSES.includes(item.status)) throw new Error(`${at}: invalid status`);
    if (!Number.isInteger(item.repeat) || item.repeat < 1 || item.repeat > PROTOCOL.independentRepeats) throw new Error(`${at}: repeat must be 1–3`);
    const query = PROTOCOL.queries.find((candidate) => candidate.id === item.queryId);
    if (item.prompt !== query.prompt) throw new Error(`${at}: prompt changed; preserve the protocol text`);
    if (JSON.stringify(item.urls ?? []) !== JSON.stringify(query.urls ?? [])) throw new Error(`${at}: URL context differs from protocol`);
    if (item.protocolId !== PROTOCOL.id) throw new Error(`${at}: protocolId mismatch`);
    if (typeof item.mode !== "string" || !item.mode.trim()) throw new Error(`${at}: mode missing`);
    if (typeof item.region !== "string" || !item.region.trim() || typeof item.language !== "string" || !item.language.trim()) throw new Error(`${at}: region/language missing`);
    if (item.comparisonEligible !== undefined && typeof item.comparisonEligible !== "boolean") throw new Error(`${at}: comparisonEligible must be boolean`);
    const key = `${item.phase}\u001f${observationKey(item)}`;
    if (keys.has(key)) throw new Error(`${at}: duplicate comparable observation`);
    keys.add(key);
    if (!Array.isArray(item.sources)) throw new Error(`${at}: sources must be an array`);
    for (const source of item.sources) {
      if (!source || typeof source.url !== "string") throw new Error(`${at}: source.url missing`);
      const url = new URL(source.url);
      if (!["https:", "http:"].includes(url.protocol)) throw new Error(`${at}: source must be HTTP(S)`);
      if (source.verified !== undefined && typeof source.verified !== "boolean") throw new Error(`${at}: source.verified must be boolean`);
    }
    for (const [fact, assessment] of Object.entries(item.facts ?? {})) if (!FACT_STATUSES.includes(assessment)) throw new Error(`${at}: invalid ${fact} assessment`);
    if (item.status === "completed") {
      if (typeof item.answer !== "string" || !item.answer.trim()) throw new Error(`${at}: completed observation needs actual answer`);
      if (typeof item.observedAt !== "string" || !Number.isFinite(Date.parse(item.observedAt))) throw new Error(`${at}: completed observation needs observedAt`);
      if (![true, false, null].includes(item.webSearch)) throw new Error(`${at}: completed observation needs true/false webSearch or explicit null when unobserved`);
      if (typeof item.evidence !== "string" || !item.evidence.trim()) throw new Error(`${at}: completed observation needs saved response/screenshot evidence path`);
    }
  }
  return observations;
}

export function validDomainCitation(observation) {
  return observation.sources.some((source) => {
    try { return source.verified === true && [PROTOCOL.domain, `www.${PROTOCOL.domain}`].includes(new URL(source.url).hostname.toLowerCase()); } catch { return false; }
  });
}

function metric(numerator, denominator) {
  return { numerator, denominator, rate: denominator ? numerator / denominator : null };
}

function aggregate(observations) {
  const completed = observations.filter((item) => item.status === "completed");
  const facts = Object.fromEntries(["priceAndUnit", "measurement", "delivery", "contacts"].map((key) => {
    const counts = Object.fromEntries(FACT_STATUSES.map((status) => [status, 0]));
    completed.forEach((item) => { counts[item.facts?.[key] ?? "unverified"] += 1; });
    return [key, { ...counts, accuracy: metric(counts.correct, counts.correct + counts.incorrect + counts.no_answer) }];
  }));
  const agents = completed.filter((item) => scenarioOf(item) === "agent");
  const attemptedActions = agents.filter((item) => item.agent?.taskAttempted !== false && item.agent?.capabilityLimited !== true);
  return {
    observations: observations.length, completed: completed.length,
    retrievalEvidence: { enabled: completed.filter((item) => item.webSearch === true).length, disabled: completed.filter((item) => item.webSearch === false).length, unknown: completed.filter((item) => item.webSearch === null).length },
    excludedFromComparison: completed.filter((item) => item.comparisonEligible === false).length,
    pending: observations.filter((item) => item.status === "pending").length,
    unavailable: observations.filter((item) => item.status === "unavailable").length,
    errors: observations.filter((item) => item.status === "error").length,
    domainCitations: metric(completed.filter(validDomainCitation).length, completed.length),
    brandMentions: metric(completed.filter((item) => /kuhnitver|кухнитвер/iu.test(item.answer)).length, completed.length),
    facts,
    agent: {
      draftPrepared: metric(agents.filter((item) => item.agent?.draftPrepared === true).length, agents.filter((item) => typeof item.agent?.draftPrepared === "boolean").length),
      textDrafts: agents.filter((item) => item.agent?.draftPrepared === true && item.agent?.draftKind === "text").length,
      capabilityLimited: agents.filter((item) => item.agent?.capabilityLimited === true).length,
      browserActionAttempts: agents.filter((item) => item.agent?.taskAttempted === true).length,
      siteFieldsFilled: metric(agents.filter((item) => item.agent?.siteFieldsFilled === true).length, agents.filter((item) => typeof item.agent?.siteFieldsFilled === "boolean").length),
      taskSucceeded: metric(attemptedActions.filter((item) => item.agent?.taskSucceeded === true).length, attemptedActions.filter((item) => typeof item.agent?.taskSucceeded === "boolean").length),
      submitted: agents.filter((item) => item.agent?.submitted === true).length,
    },
  };
}

export function summarize(observations) {
  validateObservations(observations);
  const groupBy = (keyFunction) => {
    const groups = {};
    observations.forEach((item) => { const key = keyFunction(item); (groups[key] ??= []).push(item); });
    return Object.fromEntries(Object.entries(groups).map(([key, rows]) => [key, aggregate(rows)]));
  };
  return {
    protocolId: PROTOCOL.id, generatedAt: new Date().toISOString(),
    overall: aggregate(observations), byScenario: groupBy(scenarioOf),
    byProductAndScenario: groupBy((item) => `${item.product}/${scenarioOf(item)}`),
    byProductModeAndScenario: groupBy((item) => JSON.stringify([item.product, item.mode, item.model ?? "", item.region, item.language, item.webSearch, scenarioOf(item)])),
    byQuery: groupBy((item) => item.queryId),
    interpretation: "Discovery, brand, URL-reading and agent results are separate. Use byProductModeAndScenario to keep guest/authenticated modes, models, regions and retrieval evidence separate. webSearch=null means retrieval was not established, not a failed answer. Alice's standalone web chat is not the quick answer in the search results. Unmeasured rates are null. Citation requires a verified URL; brand mention alone does not count. No causal inference or lead count is derived from answers.",
  };
}

export function compare(beforeRows, afterRows, { postReleaseBaseline = false } = {}) {
  validateObservations(beforeRows);
  validateObservations(afterRows);
  const baselinePhase = postReleaseBaseline === true ? "after" : "before";
  if (beforeRows.some((row) => row.phase !== baselinePhase) || afterRows.some((row) => row.phase !== "after")) {
    throw new Error(`Comparison inputs must have ${baselinePhase}/after phases respectively; two post-release waves require --post-release-baseline`);
  }
  const beforeCompleted = beforeRows.filter((row) => row.status === "completed" && row.comparisonEligible !== false);
  const afterCompleted = afterRows.filter((row) => row.status === "completed" && row.comparisonEligible !== false);
  const byAfter = new Map(afterCompleted.map((row) => [observationKey(row), row]));
  const pairedBefore = beforeCompleted.filter((row) => byAfter.has(observationKey(row)));
  const pairedAfter = pairedBefore.map((row) => byAfter.get(observationKey(row)));
  if (pairedBefore.some((row, index) => Date.parse(pairedAfter[index].observedAt) <= Date.parse(row.observedAt))) {
    throw new Error("Each matched follow-up must have an observedAt later than its baseline; preserve actual observation dates");
  }
  const before = summarize(pairedBefore);
  const after = summarize(pairedAfter);
  const differences = {};
  for (const key of Object.keys(PROTOCOL.groups).map((key) => PROTOCOL.groups[key].scenario)) {
    const left = before.byScenario[key];
    const right = after.byScenario[key];
    differences[key] = Object.fromEntries(["domainCitations", "brandMentions"].map((name) => {
      const first = left?.[name]?.rate ?? null;
      const last = right?.[name]?.rate ?? null;
      return [name, { before: first, after: last, percentagePointChange: first === null || last === null ? null : 100 * (last - first), denominator: left?.[name]?.denominator ?? 0 }];
    }));
  }
  return {
    protocolId: PROTOCOL.id, generatedAt: new Date().toISOString(), matchedObservations: pairedBefore.length,
    comparisonKind: baselinePhase === "after" ? "after-to-after" : "before-to-after",
    comparisonPhases: { baseline: baselinePhase, followup: "after" },
    unmatchedBefore: beforeCompleted.length - pairedBefore.length, unmatchedAfter: afterCompleted.length - pairedAfter.length,
    excludedBeforeContext: beforeRows.filter((row) => row.status === "completed" && row.comparisonEligible === false).length,
    excludedAfterContext: afterRows.filter((row) => row.status === "completed" && row.comparisonEligible === false).length,
    before, after, differences,
    limitation: `${baselinePhase === "after" ? "Both waves were collected after deployment; this does not reconstruct a pre-deployment baseline. " : ""}Matched manual observations only. Small, non-random samples and changing search/model behavior do not establish causal effect. Qualified inquiries/orders need separate CRM evidence.`,
  };
}

export async function loadObservations(filename) {
  const text = await readFile(filename, "utf8");
  try {
    const json = JSON.parse(text);
    return Array.isArray(json) ? json : json.observations ?? [json];
  } catch {
    return text.split(/\r?\n/).filter((line) => line.trim()).map((line, index) => {
      try { return JSON.parse(line); } catch { throw new Error(`${filename}:${index + 1}: invalid JSONL`); }
    });
  }
}

export function selfTest() {
  const templates = observationTemplate("before", ["chatgpt-search"]);
  assert.equal(templates.length, 51);
  const pending = summarize(templates);
  assert.equal(pending.overall.domainCitations.rate, null);
  assert.equal(pending.overall.completed, 0);
  const good = { ...templates[0], status: "completed", observedAt: "2026-10-30T19:00:00Z", webSearch: true, answer: "Kuhnitver", evidence: "fixtures/answer.txt", sources: [{ url: "https://kuhnitver.ru/catalog", verified: true }], facts: { measurement: "correct" } };
  const fake = { ...good, repeat: 2, answer: "kuhnitver.ru", sources: [{ url: "https://kuhnitver.ru.evil.test/", verified: true }], facts: { measurement: "no_answer" } };
  const unknown = { ...good, repeat: 3, status: "unavailable", answer: "", sources: [] };
  const result = summarize([good, fake, unknown]);
  assert.deepEqual(result.overall.domainCitations, metric(1, 2));
  assert.deepEqual(result.overall.brandMentions, metric(2, 2));
  assert.deepEqual(result.overall.facts.measurement.accuracy, metric(1, 2));
  assert.equal(result.overall.facts.delivery.accuracy.rate, null);
  assert.equal(validDomainCitation({ sources: [{ url: "https://kuhnitver.ru/", verified: false }] }), false);
  const modes = summarize([
    { ...good, phase: "after", mode: "Search, guest" },
    { ...good, phase: "after", mode: "Search, authenticated", sources: [] },
  ]).byProductModeAndScenario;
  assert.equal(Object.keys(modes).length, 2);
  assert.deepEqual(Object.values(modes).map((group) => group.domainCitations.rate).sort(), [0, 1]);
  assert.equal(observationTemplate("after", ["yandex-alice-webchat"]).length, 51);
  const unknownRetrieval = { ...good, phase: "after", webSearch: null, sources: [], comparisonEligible: false };
  const unknownSummary = summarize([unknownRetrieval]);
  assert.equal(unknownSummary.overall.completed, 1);
  assert.deepEqual(unknownSummary.overall.domainCitations, metric(0, 1));
  assert.equal(unknownSummary.overall.retrievalEvidence.unknown, 1);
  const excludedContext = compare([{ ...unknownRetrieval, phase: "before" }], [unknownRetrieval]);
  assert.equal(excludedContext.matchedObservations, 0);
  assert.equal(excludedContext.excludedBeforeContext, 1);
  assert.equal(excludedContext.excludedAfterContext, 1);
  const differentRetrieval = compare([{ ...unknownRetrieval, phase: "before", comparisonEligible: true }], [{ ...unknownRetrieval, webSearch: true, comparisonEligible: true }]);
  assert.equal(differentRetrieval.matchedObservations, 0);
  assert.throws(() => summarize([good, good]), /duplicate/);
  assert.throws(() => summarize([{ ...good, prompt: "Visit kuhnitver.ru" }]), /prompt/);
  assert.throws(() => summarize([{ ...good, observedAt: null }]), /observedAt/);
  const compared = compare([good, fake], [{ ...good, phase: "after", observedAt: "2026-10-31T19:00:00Z", sources: [] }, { ...fake, phase: "after", mode: "different mode" }]);
  assert.equal(compared.matchedObservations, 1);
  assert.equal(compared.unmatchedBefore, 1);
  assert.equal(compared.differences.discovery.domainCitations.percentagePointChange, -100);
  assert.equal(compared.comparisonKind, "before-to-after");
  const firstWave = { ...good, phase: "after", observedAt: "2026-10-31T19:00:00Z" };
  const laterWave = { ...firstWave, observedAt: "2026-11-14T19:00:00Z", sources: [] };
  assert.throws(() => compare([firstWave], [laterWave]), /phases/);
  const repeated = compare([firstWave], [laterWave], { postReleaseBaseline: true });
  assert.equal(repeated.comparisonKind, "after-to-after");
  assert.deepEqual(repeated.comparisonPhases, { baseline: "after", followup: "after" });
  assert.equal(repeated.matchedObservations, 1);
  assert.equal(repeated.differences.discovery.domainCitations.percentagePointChange, -100);
  assert.match(repeated.limitation, /does not reconstruct a pre-deployment baseline/);
  assert.equal(firstWave.phase, "after");
  assert.equal(firstWave.observedAt, "2026-10-31T19:00:00Z");
  assert.throws(() => compare([firstWave], [firstWave], { postReleaseBaseline: true }), /later/);
  assert.throws(() => compare([laterWave], [firstWave], { postReleaseBaseline: true }), /later/);
  assert.throws(() => compare([good], [{ ...good, phase: "after" }]), /later/);
  const formTemplate = observationTemplate("after", ["chatgpt-search"]).find((row) => row.queryId === "form-1");
  const textDraft = { ...good, ...formTemplate, status: "completed", observedAt: good.observedAt, webSearch: true, answer: "Текстовый черновик", evidence: "fixtures/draft.txt", agent: { draftPrepared: true, draftKind: "text", taskAttempted: false, siteFieldsFilled: false, taskSucceeded: null, capabilityLimited: true, submitted: false } };
  const draftSummary = summarize([textDraft]).overall.agent;
  assert.deepEqual(draftSummary.draftPrepared, metric(1, 1));
  assert.equal(draftSummary.textDrafts, 1);
  assert.equal(draftSummary.capabilityLimited, 1);
  assert.equal(draftSummary.browserActionAttempts, 0);
  assert.equal(draftSummary.taskSucceeded.rate, null);
  const attemptedFailure = { ...textDraft, repeat: 2, agent: { ...textDraft.agent, capabilityLimited: false, taskAttempted: true, taskSucceeded: false } };
  assert.deepEqual(summarize([textDraft, attemptedFailure]).overall.agent.taskSucceeded, metric(0, 1));
  return { passed: true };
}

async function main(args) {
  const option = (name, fallback) => { const index = args.indexOf(name); return index >= 0 ? args[index + 1] : fallback; };
  if (args.includes("--self-test")) { console.log(JSON.stringify(selfTest())); return; }
  if (args.includes("--post-release-baseline") && !args.includes("--compare")) throw new Error("--post-release-baseline requires --compare");
  let result;
  if (args.includes("--protocol")) result = PROTOCOL;
  else if (args.includes("--init")) result = observationTemplate(option("--phase", "before"), option("--products")?.split(","));
  else if (args.includes("--compare")) {
    const beforePath = option("--before");
    const afterPath = option("--after");
    if (!beforePath || !afterPath) throw new Error("--compare needs --before FILE --after FILE");
    result = compare(await loadObservations(beforePath), await loadObservations(afterPath), { postReleaseBaseline: args.includes("--post-release-baseline") });
  } else if (option("--input")) result = summarize(await loadObservations(option("--input")));
  else {
    console.log("node scripts/ai-search-measure.mjs --protocol [--output FILE]\nnode scripts/ai-search-measure.mjs --init --phase before|after [--products chatgpt-search,yandex-alice] --output FILE\nnode scripts/ai-search-measure.mjs --input FILE [--output FILE]\nnode scripts/ai-search-measure.mjs --compare --before FILE --after FILE [--post-release-baseline] [--output FILE]\nnode scripts/ai-search-measure.mjs --self-test\nObservation templates are pending, never fabricated AI answers. JSON/JSONL inputs accepted. Separate discovery/brand/url/agent denominators. --post-release-baseline compares two after waves without relabelling their original phase or reconstructing a pre-deployment baseline.");
    return;
  }
  const json = `${JSON.stringify(result, null, 2)}\n`;
  const output = option("--output");
  if (output) { await mkdir(path.dirname(path.resolve(output)), { recursive: true }); await writeFile(output, json); console.log(JSON.stringify({ output, ...(Array.isArray(result) ? { records: result.length, completed: result.filter((row) => row.status === "completed").length } : { protocolId: result.protocolId ?? result.id, overall: result.overall, matchedObservations: result.matchedObservations }) }, null, 2)); }
  else console.log(json.trimEnd());
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main(process.argv.slice(2)).catch((error) => { console.error(error.message); process.exitCode = 1; });
