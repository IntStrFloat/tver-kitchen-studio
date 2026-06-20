import assert from "node:assert/strict";
import test from "node:test";

import { createMemoryJobStore, StoreCapacityError, toPublicJobView, type TryOnJobRecord } from "./job-store.ts";

const mask = { width: 100, height: 80, points: [{ x: 0.25, y: 0.75 }] };

function record(overrides: Partial<TryOnJobRecord> = {}): TryOnJobRecord {
  return {
    id: "job/1",
    createdAt: 1_000,
    status: "queued",
    attempts: 0,
    productId: "product-1",
    mimeType: "image/jpeg",
    room: Uint8Array.of(0xff, 0xd8, 0xff, 0xe0),
    mask,
    ...overrides,
  };
}

test("expires jobs on reads without a timer", () => {
  let now = 1_000;
  const store = createMemoryJobStore({ ttlMs: 100, now: () => now });
  store.put(record());

  assert.equal(store.get("job/1")?.id, "job/1");
  now = 1_100;
  assert.equal(store.get("job/1"), null);
});

test("owns copies of mutable room bytes at storage boundaries", () => {
  const store = createMemoryJobStore({ ttlMs: 100, now: () => 1_000 });
  const input = record();
  store.put(input);
  input.room[0] = 0;

  const firstRead = store.get("job/1")!;
  assert.equal(firstRead.room[0], 0xff);
  firstRead.room[1] = 0;
  assert.equal(store.get("job/1")!.room[1], 0xd8);
});

test("updates stored state while public views expose only the API contract", () => {
  const store = createMemoryJobStore({ ttlMs: 100, now: () => 1_000 });
  store.put(record());
  const updated = store.update("job/1", (job) => ({
    ...job,
    status: "succeeded",
    attempts: job.attempts + 1,
    resultKey: "private-key",
  }))!;

  assert.deepEqual(toPublicJobView(updated), {
    id: "job/1",
    status: "succeeded",
    resultUrl: "/api/try-on/jobs/job%2F1/result",
  });
  assert.deepEqual(Object.keys(toPublicJobView(updated)).sort(), ["id", "resultUrl", "status"]);

  const failed = record({ id: "failed", status: "failed", errorCode: "provider_failed" });
  assert.deepEqual(toPublicJobView(failed), {
    id: "failed",
    status: "failed",
    errorCode: "provider_failed",
  });
});

test("does not consume an attempt when an update operation fails", () => {
  const store = createMemoryJobStore({ ttlMs: 100, now: () => 1_000 });
  store.put(record());

  assert.throws(() => store.update("job/1", (job) => {
    job.attempts += 1;
    throw new Error("provider did not start");
  }));
  assert.equal(store.get("job/1")!.attempts, 0);
});

test("rejects new jobs above the job count limit", () => {
  const store = createMemoryJobStore({ ttlMs: 100, now: () => 1_000, maxJobs: 1, maxBytes: 100 });
  store.put(record());
  assert.throws(() => store.put(record({ id: "job-2" })), StoreCapacityError);
});

test("rejects retained rooms above the byte limit", () => {
  const store = createMemoryJobStore({ ttlMs: 100, now: () => 1_000, maxJobs: 2, maxBytes: 4 });
  store.put(record());
  assert.throws(() => store.put(record({ id: "job-2", room: Uint8Array.of(1) })), StoreCapacityError);
});

test("rejects oversized updates without changing retained bytes", () => {
  const store = createMemoryJobStore({ ttlMs: 100, now: () => 1_000, maxJobs: 1, maxBytes: 4 });
  store.put(record());
  assert.throws(
    () => store.update("job/1", (job) => ({ ...job, room: Uint8Array.of(1, 2, 3, 4, 5) })),
    StoreCapacityError,
  );
  assert.equal(store.get("job/1")!.room.length, 4);
});

test("accounts for replacement bytes without increasing the job count", () => {
  const store = createMemoryJobStore({ ttlMs: 100, now: () => 1_000, maxJobs: 1, maxBytes: 5 });
  store.put(record({ status: "succeeded", resultKey: "job/1" }));
  store.put(record({ status: "succeeded", resultKey: "job/1", room: Uint8Array.of(1, 2, 3, 4, 5) }));
  assert.equal(store.getResult("job/1")!.bytes.length, 5);
});

test("expired jobs free count and byte capacity", () => {
  let now = 1_000;
  const store = createMemoryJobStore({ ttlMs: 10, now: () => now, maxJobs: 1, maxBytes: 4 });
  store.put(record());
  now = 1_010;
  assert.doesNotThrow(() => store.put(record({ id: "job-2" })));
});

test("metadata reads omit room bytes and result reads return one owned copy", () => {
  const store = createMemoryJobStore({ ttlMs: 100, now: () => 1_000 });
  store.put(record({ status: "succeeded", resultKey: "job/1" }));

  const view = store.getView("job/1")!;
  assert.equal("room" in view, false);
  const result = store.getResult("job/1")!;
  result.bytes[0] = 0;
  assert.equal(store.getResult("job/1")!.bytes[0], 0xff);
});
