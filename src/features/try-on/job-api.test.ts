import assert from "node:assert/strict";
import test from "node:test";

import { createMemoryJobStore, type TryOnJobRecord } from "./job-store.ts";
import { parsePlacementMask, runJobGeneration } from "./job-api.ts";

const job: TryOnJobRecord = {
  id: "job-1",
  createdAt: 1,
  status: "queued",
  attempts: 0,
  productId: "product-1",
  mimeType: "image/jpeg",
  room: Uint8Array.of(0xff, 0xd8, 0xff, 0xe0),
  mask: { width: 1, height: 1, points: [] },
};

test("parses a valid normalized placement mask", () => {
  assert.deepEqual(parsePlacementMask(JSON.stringify({
    width: 1200,
    height: 800,
    points: [{ x: 0, y: 1 }, { x: 0.5, y: 0.25 }],
  })), {
    width: 1200,
    height: 800,
    points: [{ x: 0, y: 1 }, { x: 0.5, y: 0.25 }],
  });
});

for (const [name, value] of [
  ["invalid JSON", "{"],
  ["non-object", "null"],
  ["unsafe width", JSON.stringify({ width: Number.MAX_SAFE_INTEGER + 1, height: 1, points: [] })],
  ["zero height", JSON.stringify({ width: 1, height: 0, points: [] })],
  ["missing points", JSON.stringify({ width: 1, height: 1 })],
  ["non-finite coordinate", JSON.stringify({ width: 1, height: 1, points: [{ x: "NaN", y: 0 }] })],
  ["coordinate below zero", JSON.stringify({ width: 1, height: 1, points: [{ x: -0.1, y: 0 }] })],
  ["coordinate above one", JSON.stringify({ width: 1, height: 1, points: [{ x: 0, y: 1.1 }] })],
] as const) {
  test(`rejects ${name}`, () => {
    assert.equal(parsePlacementMask(value), null);
  });
}

test("does not consume an attempt when the provider operation rejects", async () => {
  const store = createMemoryJobStore({ ttlMs: 100, now: () => 1 });
  store.put(job);

  await runJobGeneration(store, "job-1", {
    async generate() {
      throw new Error("provider did not start");
    },
  });

  assert.equal(store.get("job-1")!.attempts, 0);
  assert.equal(store.get("job-1")!.status, "failed");
});

test("counts a resolved provider operation as one generation start", async () => {
  const store = createMemoryJobStore({ ttlMs: 100, now: () => 1 });
  store.put(job);

  await runJobGeneration(store, "job-1", {
    async generate() {
      return { status: "failed", errorCode: "provider_timeout" };
    },
  });

  assert.equal(store.get("job-1")!.attempts, 1);
  assert.equal(store.get("job-1")!.errorCode, "provider_timeout");
});
