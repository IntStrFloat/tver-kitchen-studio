import assert from "node:assert/strict";
import test from "node:test";

import { createMemoryJobStore, type TryOnJobRecord } from "./job-store.ts";
import { MAX_MASK_CHARS, MAX_MASK_POINTS, parsePlacementMask, runJobGeneration } from "./job-api.ts";

const job: TryOnJobRecord = {
  id: "job-1",
  createdAt: 1,
  status: "queued",
  attempts: 0,
  productId: "product-1",
  mimeType: "image/jpeg",
  room: Uint8Array.of(0xff, 0xd8, 0xff, 0xe0),
  mask: { width: 1, height: 1, points: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }] },
};

test("parses a valid normalized placement mask", () => {
  assert.deepEqual(parsePlacementMask(JSON.stringify({
    width: 1200,
    height: 800,
    points: [{ x: 0, y: 1 }, { x: 0.5, y: 0.25 }, { x: 1, y: 0 }],
  })), {
    width: 1200,
    height: 800,
    points: [{ x: 0, y: 1 }, { x: 0.5, y: 0.25 }, { x: 1, y: 0 }],
  });
});

for (const [name, value] of [
  ["invalid JSON", "{"],
  ["non-object", "null"],
  ["root array", "[]"],
  ["extra root key", JSON.stringify({ width: 1, height: 1, points: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }], extra: true })],
  ["unsafe width", JSON.stringify({ width: Number.MAX_SAFE_INTEGER + 1, height: 1, points: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }] })],
  ["zero height", JSON.stringify({ width: 1, height: 0, points: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }] })],
  ["missing points", JSON.stringify({ width: 1, height: 1 })],
  ["empty points", JSON.stringify({ width: 1, height: 1, points: [] })],
  ["one point", JSON.stringify({ width: 1, height: 1, points: [{ x: 0, y: 0 }] })],
  ["two points", JSON.stringify({ width: 1, height: 1, points: [{ x: 0, y: 0 }, { x: 1, y: 1 }] })],
  ["array point", JSON.stringify({ width: 1, height: 1, points: [[0, 0], { x: 1, y: 0 }, { x: 0, y: 1 }] })],
  ["missing point key", JSON.stringify({ width: 1, height: 1, points: [{ x: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }] })],
  ["extra point key", JSON.stringify({ width: 1, height: 1, points: [{ x: 0, y: 0, z: 1 }, { x: 1, y: 0 }, { x: 0, y: 1 }] })],
  ["null coordinate", JSON.stringify({ width: 1, height: 1, points: [{ x: null, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }] })],
  ["string coordinate", JSON.stringify({ width: 1, height: 1, points: [{ x: "0", y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }] })],
  ["coordinate below zero", JSON.stringify({ width: 1, height: 1, points: [{ x: -0.1, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }] })],
  ["coordinate above one", JSON.stringify({ width: 1, height: 1, points: [{ x: 0, y: 1.1 }, { x: 1, y: 0 }, { x: 0, y: 1 }] })],
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

test("does not consume an attempt when the provider returns failure", async () => {
  const store = createMemoryJobStore({ ttlMs: 100, now: () => 1 });
  store.put(job);

  await runJobGeneration(store, "job-1", {
    async generate() {
      return { status: "failed", errorCode: "provider_timeout" };
    },
  });

  assert.equal(store.get("job-1")!.attempts, 0);
  assert.equal(store.get("job-1")!.errorCode, "provider_timeout");
});

test("counts a successful provider result as one completed generation", async () => {
  const store = createMemoryJobStore({ ttlMs: 100, now: () => 1 });
  store.put(job);

  await runJobGeneration(store, "job-1", {
    async generate() {
      return { status: "succeeded", resultKey: "job-1" };
    },
  });

  assert.equal(store.get("job-1")!.attempts, 1);
  assert.equal(store.get("job-1")!.status, "succeeded");
});

test("rejects masks above the raw input limit", () => {
  assert.equal(parsePlacementMask(" ".repeat(MAX_MASK_CHARS + 1)), null);
});

test("rejects masks above the point count limit", () => {
  const points = Array.from({ length: MAX_MASK_POINTS + 1 }, () => ({ x: 0.5, y: 0.5 }));
  assert.equal(parsePlacementMask(JSON.stringify({ width: 1, height: 1, points })), null);
});
