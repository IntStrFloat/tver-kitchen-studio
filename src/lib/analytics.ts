// ===== ANALYTICS =====
// Централизованная отправка целей в Яндекс.Метрику.
// Идентификатор счётчика совпадает с инициализацией в src/app/layout.tsx.

export const YM_COUNTER_ID = 106971287;

// Идентификаторы целей. Эти же значения нужно завести в интерфейсе
// Яндекс.Метрики как цели типа «JavaScript-событие».
export const GOALS = {
  call: "call", // клик по любой ссылке tel:
  callbackRequest: "callback_request", // отправлена форма «Заказать звонок»
  quizLead: "quiz_lead", // отправлен квиз-расчёт стоимости
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

export function trackBlogEvent(name: BlogEventName, payload: BlogEventPayload): void {
  if (typeof window === "undefined") return;
  try {
    window.ym?.(YM_COUNTER_ID, "reachGoal", name, payload as Record<string, unknown>);
    window.gtag?.("event", name, payload);
  } catch {
    // Analytics must not interrupt article reading or lead submission.
  }
}

/**
 * Отправляет достижение цели в Яндекс.Метрику.
 * Безопасно вызывается на сервере и до загрузки счётчика — просто no-op.
 */
export function trackGoal(
  goal: GoalName,
  params?: Record<string, unknown>,
): void {
  if (typeof window === "undefined" || typeof window.ym !== "function") return;
  try {
    window.ym(YM_COUNTER_ID, "reachGoal", goal, params);
  } catch {
    // аналитика не должна ломать UX
  }
}
