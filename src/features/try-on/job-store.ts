import type { PlacementMask, TryOnErrorCode, TryOnJobView, JobStatus } from "./types.ts";

export interface TryOnJobRecord {
  id: string;
  createdAt: number;
  status: JobStatus;
  attempts: number;
  productId: string;
  mimeType: string;
  room: Uint8Array;
  mask: PlacementMask;
  resultKey?: string;
  errorCode?: TryOnErrorCode;
}

export interface MemoryJobStore {
  put(job: TryOnJobRecord): TryOnJobRecord;
  get(id: string): TryOnJobRecord | null;
  update(id: string, updater: (job: TryOnJobRecord) => TryOnJobRecord): TryOnJobRecord | null;
}

export function createMemoryJobStore(options: {
  readonly ttlMs: number;
  readonly now: () => number;
}): MemoryJobStore {
  const jobs = new Map<string, TryOnJobRecord>();

  function prune(): void {
    const now = options.now();
    for (const [id, job] of jobs) {
      if (job.createdAt + options.ttlMs <= now) jobs.delete(id);
    }
  }

  return {
    put(job) {
      prune();
      const stored = cloneJob(job);
      jobs.set(stored.id, stored);
      return cloneJob(stored);
    },
    get(id) {
      prune();
      const job = jobs.get(id);
      return job ? cloneJob(job) : null;
    },
    update(id, updater) {
      prune();
      const current = jobs.get(id);
      if (!current) return null;

      const updated = cloneJob(updater(cloneJob(current)));
      jobs.set(id, updated);
      return cloneJob(updated);
    },
  };
}

export function toPublicJobView(job: TryOnJobRecord): TryOnJobView {
  if (job.status === "succeeded") {
    return {
      id: job.id,
      status: job.status,
      resultUrl: `/api/try-on/jobs/${encodeURIComponent(job.id)}/result`,
    };
  }

  if (job.status === "failed") {
    return { id: job.id, status: job.status, errorCode: job.errorCode ?? "provider_failed" };
  }

  return { id: job.id, status: job.status };
}

function cloneJob(job: TryOnJobRecord): TryOnJobRecord {
  return {
    ...job,
    room: job.room.slice(),
    mask: {
      width: job.mask.width,
      height: job.mask.height,
      points: job.mask.points.map((point) => ({ ...point })),
    },
  };
}
