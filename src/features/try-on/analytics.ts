const PAYLOAD_KEYS = [
  "product_id",
  "group_id",
  "job_status",
  "retry_reason",
  "elapsed_bucket",
  "source",
] as const;

type TryOnPayloadKey = (typeof PAYLOAD_KEYS)[number];

export type TryOnEventName =
  | "try_on_open"
  | "try_on_group_select"
  | "try_on_product_select"
  | "try_on_photo_open"
  | "try_on_photo_uploaded"
  | "try_on_mask_confirmed"
  | "try_on_generation_started"
  | "try_on_generation_completed"
  | "try_on_retry"
  | "try_on_result_shared"
  | "try_on_lead_opened"
  | "try_on_lead_submitted"
  | "try_on_lead_failed";

export type TryOnEventPayload = Partial<Record<TryOnPayloadKey, string>>;

const YM_COUNTER_IDS = [106971287, 110021238] as const;
const UNSAFE_VALUE = /^\s*(blob:|data:|https?:|\/)/i;

type AnalyticsWindow = Window & {
  ym?: (counterId: number, action: string, ...args: unknown[]) => void;
  gtag?: (command: string, event: string, params?: Record<string, unknown>) => void;
};

export function sanitizeTryOnPayload(payload: unknown): TryOnEventPayload {
  if (payload === null || typeof payload !== "object" || Array.isArray(payload)) return {};
  const source = payload as Record<string, unknown>;
  const sanitized: TryOnEventPayload = {};
  for (const key of PAYLOAD_KEYS) {
    const value = source[key];
    if (typeof value === "string" && value.length <= 80 && !UNSAFE_VALUE.test(value)) sanitized[key] = value;
  }
  return sanitized;
}

export function trackTryOnEvent(name: TryOnEventName, payload?: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  let sanitized: TryOnEventPayload;
  try {
    sanitized = sanitizeTryOnPayload(payload);
  } catch {
    return;
  }
  const analyticsWindow = window as AnalyticsWindow;
  YM_COUNTER_IDS.forEach((id) => {
    try {
      analyticsWindow.ym?.(id, "reachGoal", name, sanitized);
    } catch {
      // A broken counter must not prevent other analytics providers.
    }
  });
  try {
    analyticsWindow.gtag?.("event", name, sanitized);
  } catch {
    // Analytics must never interrupt the try-on flow.
  }
}
