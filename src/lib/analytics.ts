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
