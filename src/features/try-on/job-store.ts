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

export type TryOnJobMetadata = Omit<TryOnJobRecord, "room">;

export class StoreCapacityError extends Error {
  constructor() {
    super("Try-on job store capacity exceeded");
    this.name = "StoreCapacityError";
  }
}

export interface MemoryJobStore {
  put(job: TryOnJobRecord): TryOnJobRecord;
  get(id: string): TryOnJobRecord | null;
  getView(id: string): TryOnJobMetadata | null;
  getResult(id: string): { readonly bytes: Uint8Array; readonly mimeType: string } | null;
  update(id: string, updater: (job: TryOnJobRecord) => TryOnJobRecord): TryOnJobRecord | null;
}

export function createMemoryJobStore(options: {
  readonly ttlMs: number;
  readonly now: () => number;
  readonly maxJobs?: number;
  readonly maxBytes?: number;
}): MemoryJobStore {
  const jobs = new Map<string, TryOnJobRecord>();
  const maxJobs = options.maxJobs ?? 100;
  const maxBytes = options.maxBytes ?? 256 * 1024 * 1024;
  let retainedBytes = 0;

  function prune(): void {
    const now = options.now();
    for (const [id, job] of jobs) {
      if (job.createdAt + options.ttlMs <= now) {
        retainedBytes -= job.room.byteLength;
        jobs.delete(id);
      }
    }
  }

  function assertCapacity(jobCount: number, byteCount: number): void {
    if (jobCount > maxJobs || byteCount > maxBytes) throw new StoreCapacityError();
  }

  return {
    put(job) {
      prune();
      const stored = cloneJob(job);
      const previous = jobs.get(stored.id);
      const nextBytes = retainedBytes - (previous?.room.byteLength ?? 0) + stored.room.byteLength;
      assertCapacity(jobs.size + (previous ? 0 : 1), nextBytes);
      jobs.set(stored.id, stored);
      retainedBytes = nextBytes;
      return cloneJob(stored);
    },
    get(id) {
      prune();
      const job = jobs.get(id);
      return job ? cloneJob(job) : null;
    },
    getView(id) {
      prune();
      const job = jobs.get(id);
      return job ? cloneMetadata(job) : null;
    },
    getResult(id) {
      prune();
      const job = jobs.get(id);
      if (!job || job.status !== "succeeded" || !job.resultKey) return null;
      return { bytes: job.room.slice(), mimeType: job.mimeType };
    },
    update(id, updater) {
      prune();
      const current = jobs.get(id);
      if (!current) return null;

      const updated = cloneJob(updater(cloneJob(current)));
      const nextBytes = retainedBytes - current.room.byteLength + updated.room.byteLength;
      assertCapacity(jobs.size, nextBytes);
      jobs.set(id, updated);
      retainedBytes = nextBytes;
      return cloneJob(updated);
    },
  };
}

export function toPublicJobView(job: TryOnJobMetadata): TryOnJobView {
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

function cloneMetadata(job: TryOnJobRecord): TryOnJobMetadata {
  const { room: _room, ...metadata } = job;
  return {
    ...metadata,
    mask: {
      width: job.mask.width,
      height: job.mask.height,
      points: job.mask.points.map((point) => ({ ...point })),
    },
  };
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
