export type TryOnStep = "product" | "photo" | "mask" | "generating" | "result";

export type JobStatus = "queued" | "processing" | "succeeded" | "failed";

export type TryOnErrorCode = "invalid_image" | "provider_timeout" | "provider_failed";

export interface TryOnSession {
  version: 1;
  step: TryOnStep;
  productId: string | null;
  jobId: string | null;
}

export interface PlacementMask {
  width: number;
  height: number;
  points: Array<{ x: number; y: number }>;
}

export interface TryOnJobView {
  id: string;
  status: JobStatus;
  resultUrl?: string;
  errorCode?: TryOnErrorCode;
}

const TRY_ON_STEPS: readonly TryOnStep[] = ["product", "photo", "mask", "generating", "result"];

export function isTryOnSession(value: unknown): value is TryOnSession {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }

  const session = value as Record<string, unknown>;

  return session.version === 1
    && typeof session.step === "string"
    && TRY_ON_STEPS.includes(session.step as TryOnStep)
    && (typeof session.productId === "string" || session.productId === null)
    && (typeof session.jobId === "string" || session.jobId === null);
}
