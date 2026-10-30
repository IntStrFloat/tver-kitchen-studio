// ===== ANALYTICS =====
// Существующие счётчики учитываются отдельно; их аудитории нельзя складывать.
// Идентификаторы совпадают с init-вызовами в src/app/layout.tsx.

export const YM_COUNTER_IDS = [106971287, 110021238] as const;

// Идентификаторы целей. Эти же значения нужно завести в интерфейсе
// Яндекс.Метрики как цели типа «JavaScript-событие».
export const GOALS = {
  call: "call", // клик по любой ссылке tel:
  callbackRequest: "callback_request", // отправлена форма «Заказать звонок»
  quizLead: "quiz_lead", // отправлен квиз-расчёт стоимости
  catalogLead: "catalog_lead",
  b2bLead: "b2b_lead",
} as const;

export type GoalName = (typeof GOALS)[keyof typeof GOALS];

declare global {
  interface Window {
    ym?: (
      counterId: number,
      action: string,
      ...args: unknown[]
    ) => void;
    gtag?: (command: string, event: string, params?: Record<string, unknown>) => void;
  }
}

export type BlogEventName =
  | "blog_view"
  | "blog_scroll_50"
  | "blog_scroll_75"
  | "blog_scroll_90"
  | "blog_cta_click"
  | "blog_form_start"
  | "blog_lead"
  | "blog_related_click";

export interface BlogEventPayload {
  article_slug: string;
  article_title: string;
  cta_placement?: "inline" | "bottom";
  cta_context?: string;
}

const SOURCE_DOMAINS: Record<string, string[]> = {
  chatgpt: ["chatgpt.com", "chat.openai.com"],
  perplexity: ["perplexity.ai"],
  copilot: ["copilot.microsoft.com"],
  gemini: ["gemini.google.com"],
  alice: ["alice.yandex.ru", "alice.yandex.com"],
  gigachat: ["giga.chat"],
  google: ["google.com", "google.ru"],
  yandex: ["yandex.ru", "ya.ru", "yandex.com"],
  bing: ["bing.com"],
};

/** Fixed categories only: never forward arbitrary UTM, referrer paths or queries. */
export function getAcquisitionSource(referrer: string, search: string): string {
  const source = new URLSearchParams(search).get("utm_source")?.toLowerCase();
  if (source) {
    for (const [name, domains] of Object.entries(SOURCE_DOMAINS)) {
      if (source === name || domains.includes(source)) return name;
    }
  }
  try {
    const host = new URL(referrer).hostname.toLowerCase();
    for (const [name, domains] of Object.entries(SOURCE_DOMAINS)) {
      if (domains.some((domain) => host === domain || host.endsWith(`.${domain}`))) return name;
    }
  } catch { /* Missing or invalid referrer is unknown, never inferred as AI. */ }
  return "unknown";
}

function acquisition(): { acquisition_source: string } {
  let source = getAcquisitionSource(
    typeof document === "undefined" ? "" : document.referrer,
    window.location?.search ?? "",
  );
  try {
    if (source !== "unknown") window.sessionStorage?.setItem("kuhnitver_acquisition", source);
    else {
      const saved = window.sessionStorage?.getItem("kuhnitver_acquisition");
      if (saved && Object.hasOwn(SOURCE_DOMAINS, saved)) source = saved;
    }
  } catch { /* Storage can be disabled; only a fixed category is ever retained. */ }
  return { acquisition_source: source };
}

const SAFE_PARAMS = new Set([
  "article_slug", "article_title", "cta_placement", "cta_context", "form_type",
  "metric_name", "metric_id", "metric_rating", "metric_delta", "navigation_type",
  "value", "non_interaction",
]);

function safeParams(params?: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(Object.entries(params ?? {}).filter(([key, value]) =>
    SAFE_PARAMS.has(key) && ["string", "number", "boolean"].includes(typeof value),
  ));
}

function sendEvent(name: string, params?: Record<string, unknown>, metrikaAction = "reachGoal"): void {
  if (typeof window === "undefined") return;
  const payload = { ...safeParams(params), ...acquisition() };
  for (const id of YM_COUNTER_IDS) {
    try {
      if (metrikaAction === "params") window.ym?.(id, "params", { [name]: payload });
      else window.ym?.(id, "reachGoal", name, payload);
    } catch { /* A blocked counter must not suppress the other integrations. */ }
  }
  try { window.gtag?.("event", name, payload); }
  catch { /* Analytics never interrupts reading or lead delivery. */ }
}

export function trackBlogEvent(name: BlogEventName, payload: BlogEventPayload): void {
  sendEvent(name, { ...payload });
}

/**
 * Отправляет существующую цель в оба счётчика Метрики и GA4.
 * Безопасно вызывается на сервере и до загрузки счётчика — просто no-op.
 */
export function trackGoal(
  goal: GoalName,
  params?: Record<string, unknown>,
): void {
  sendEvent(goal, params);
}

export function trackWebVital(metric: {
  name: string; id: string; value: number; delta: number; rating: string; navigationType: string;
}): void {
  sendEvent("web_vital", {
    metric_name: metric.name,
    metric_id: metric.id,
    value: metric.value,
    metric_delta: metric.delta,
    metric_rating: metric.rating,
    navigation_type: metric.navigationType,
    non_interaction: true,
  }, "params");
}
