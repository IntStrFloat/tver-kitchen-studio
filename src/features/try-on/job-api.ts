import type { PlacementMask } from "./types.ts";
import { createMemoryJobStore, type MemoryJobStore } from "./job-store.ts";
import type { TryOnProvider } from "./provider.ts";

const STORE_KEY = Symbol.for("kuhnitver.try-on.development-job-store");
const JOB_TTL_MS = 24 * 60 * 60 * 1_000;

type DevelopmentGlobal = typeof globalThis & { [STORE_KEY]?: MemoryJobStore };

export function isTryOnDevelopmentEnabled(): boolean {
  return process.env.NODE_ENV !== "production" && process.env.TRY_ON_PROVIDER === "fake";
}

export function getDevelopmentJobStore(): MemoryJobStore {
  if (!isTryOnDevelopmentEnabled()) {
    throw new Error("The in-memory try-on store is development-only");
  }

  const global = globalThis as DevelopmentGlobal;
  global[STORE_KEY] ??= createMemoryJobStore({ ttlMs: JOB_TTL_MS, now: Date.now });
  return global[STORE_KEY];
}

export function parsePlacementMask(value: unknown): PlacementMask | null {
  if (typeof value !== "string") return null;

  let parsed: unknown;
  try {
    parsed = JSON.parse(value);
  } catch {
    return null;
  }

  if (!isRecord(parsed)
    || !isPositiveSafeInteger(parsed.width)
    || !isPositiveSafeInteger(parsed.height)
    || !Array.isArray(parsed.points)) {
    return null;
  }

  const points: PlacementMask["points"] = [];
  for (const point of parsed.points) {
    if (!isRecord(point) || !isNormalizedNumber(point.x) || !isNormalizedNumber(point.y)) {
      return null;
    }
    points.push({ x: point.x, y: point.y });
  }

  return { width: parsed.width, height: parsed.height, points };
}

export async function runJobGeneration(
  store: MemoryJobStore,
  jobId: string,
  provider: TryOnProvider,
): Promise<void> {
  const job = store.update(jobId, (current) => ({ ...current, status: "processing" }));
  if (!job) return;

  try {
    const result = await provider.generate({
      jobId: job.id,
      productId: job.productId,
      room: job.room,
      mask: job.mask,
    });
    store.update(jobId, (current) => result.status === "succeeded"
      ? { ...current, status: "succeeded", attempts: current.attempts + 1, resultKey: result.resultKey }
      : { ...current, status: "failed", attempts: current.attempts + 1, errorCode: result.errorCode });
  } catch {
    store.update(jobId, (current) => ({ ...current, status: "failed", errorCode: "provider_failed" }));
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isPositiveSafeInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isSafeInteger(value) && value > 0;
}

function isNormalizedNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= 1;
}
