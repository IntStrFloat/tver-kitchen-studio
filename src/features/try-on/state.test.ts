import assert from "node:assert/strict";
import test from "node:test";

import {
  initialTryOnState,
  reduceTryOn,
  restoreSession,
  saveSession,
  type TryOnState,
} from "./state.ts";
import type { PlacementMask } from "./types.ts";

const mask: PlacementMask = {
  width: 640,
  height: 480,
  points: [{ x: 10, y: 20 }, { x: 100, y: 120 }],
};

function readyState(): TryOnState {
  let state = reduceTryOn(initialTryOnState, { type: "select-product", productId: "table-1" });
  state = reduceTryOn(state, { type: "set-photo", previewUrl: "blob:private-photo" });
  return reduceTryOn(state, { type: "set-mask", mask });
}

class MemoryStorage implements Storage {
  private readonly values = new Map<string, string>();

  get length(): number { return this.values.size; }
  clear(): void { this.values.clear(); }
  getItem(key: string): string | null { return this.values.get(key) ?? null; }
  key(index: number): string | null { return [...this.values.keys()][index] ?? null; }
  removeItem(key: string): void { this.values.delete(key); }
  setItem(key: string, value: string): void { this.values.set(key, value); }
}

test("product -> photo -> mask -> job-created reaches generating with jobId", () => {
  const state = reduceTryOn(readyState(), { type: "job-created", jobId: "job-1" });

  assert.equal(state.step, "generating");
  assert.equal(state.jobId, "job-1");
  assert.deepEqual(state.mask, mask);
});

test("job-succeeded reaches result for the current job", () => {
  const generating = reduceTryOn(readyState(), { type: "job-created", jobId: "job-1" });
  const state = reduceTryOn(generating, { type: "job-succeeded", jobId: "job-1" });

  assert.equal(state.step, "result");
  assert.equal(state.jobId, "job-1");
  assert.equal(state.error, null);
});

test("step-guarded editing actions preserve identity outside their allowed step", () => {
  const photo = reduceTryOn(initialTryOnState, { type: "select-product", productId: "table-1" });
  const awaitingMask = reduceTryOn(photo, { type: "set-photo", previewUrl: "blob:private-photo" });
  const maskReady = reduceTryOn(awaitingMask, { type: "set-mask", mask });
  const generating = reduceTryOn(maskReady, { type: "job-created", jobId: "job-1" });
  const result = reduceTryOn(generating, { type: "job-succeeded", jobId: "job-1" });

  for (const state of [initialTryOnState, awaitingMask, generating, result]) {
    assert.strictEqual(reduceTryOn(state, { type: "set-photo", previewUrl: "blob:stale" }), state);
  }

  for (const state of [initialTryOnState, photo, generating, result]) {
    assert.strictEqual(reduceTryOn(state, { type: "set-mask", mask }), state);
  }

  for (const state of [initialTryOnState, photo, generating, result]) {
    assert.strictEqual(reduceTryOn(state, { type: "job-created", jobId: "stale-job" }), state);
  }
});

test("stale job callbacks preserve object identity", () => {
  const generating = reduceTryOn(readyState(), { type: "job-created", jobId: "job-1" });
  const result = reduceTryOn(generating, { type: "job-succeeded", jobId: "job-1" });

  assert.strictEqual(
    reduceTryOn(generating, { type: "job-succeeded", jobId: "other-job" }),
    generating,
  );
  assert.strictEqual(
    reduceTryOn(generating, { type: "job-failed", jobId: "other-job", error: "invalid_image" }),
    generating,
  );
  assert.strictEqual(
    reduceTryOn(result, { type: "job-failed", jobId: "job-1", error: "provider_timeout" }),
    result,
  );
});

test("job failure stays generating and normalizes a missing error", () => {
  const generating = reduceTryOn(readyState(), { type: "job-created", jobId: "job-1" });
  const failed = reduceTryOn(generating, { type: "job-failed", jobId: "job-1" });

  assert.equal(failed.step, "generating");
  assert.equal(failed.error, "provider_failed");
});

test("back and restart clear downstream job state", () => {
  const generating = reduceTryOn(readyState(), { type: "job-created", jobId: "job-1" });
  const failed = reduceTryOn(generating, {
    type: "job-failed",
    jobId: "job-1",
    error: "provider_timeout",
  });
  const maskState = reduceTryOn(failed, { type: "back" });
  assert.deepEqual(maskState, { ...failed, step: "mask", jobId: null, error: null });

  const photoState = reduceTryOn(maskState, { type: "back" });
  assert.equal(photoState.step, "photo");
  assert.equal(photoState.mask, null);

  const productState = reduceTryOn(photoState, { type: "back" });
  assert.deepEqual(productState, initialTryOnState);
  assert.strictEqual(reduceTryOn(failed, { type: "restart" }), initialTryOnState);
});

test("select-product clears stale photo, mask, job, and error state", () => {
  const generating = reduceTryOn(readyState(), { type: "job-created", jobId: "job-1" });
  const failed = reduceTryOn(generating, {
    type: "job-failed",
    jobId: "job-1",
    error: "invalid_image",
  });

  assert.deepEqual(reduceTryOn(failed, { type: "select-product", productId: "chair-2" }), {
    ...initialTryOnState,
    step: "photo",
    productId: "chair-2",
  });
});

test("saveSession persists only the versioned progress allowlist", () => {
  const storage = new MemoryStorage();
  const state = reduceTryOn(readyState(), { type: "job-created", jobId: "job-1" });

  saveSession({ ...state, error: "provider_timeout" }, storage);

  assert.deepEqual(JSON.parse(storage.getItem("kuhnitver.try-on.v1")!), {
    version: 1,
    step: "generating",
    productId: "table-1",
    jobId: "job-1",
  });
  assert.doesNotMatch(storage.getItem("kuhnitver.try-on.v1")!, /photo|mask|error|blob:/);
});

test("restoreSession handles malformed data and normalizes impossible steps", () => {
  const storage = new MemoryStorage();
  storage.setItem("kuhnitver.try-on.v1", "not-json");
  assert.strictEqual(restoreSession(storage), initialTryOnState);

  storage.setItem("kuhnitver.try-on.v1", JSON.stringify({ version: 1, step: "product", productId: "x", jobId: null }));
  assert.strictEqual(restoreSession(storage), initialTryOnState);

  storage.setItem("kuhnitver.try-on.v1", JSON.stringify({ version: 1, step: "mask", productId: "x", jobId: null }));
  assert.deepEqual(restoreSession(storage), { ...initialTryOnState, step: "photo", productId: "x" });

  storage.setItem("kuhnitver.try-on.v1", JSON.stringify({ version: 1, step: "result", productId: "x", jobId: "job-1" }));
  assert.deepEqual(restoreSession(storage), {
    ...initialTryOnState,
    step: "result",
    productId: "x",
    jobId: "job-1",
  });

  storage.setItem("kuhnitver.try-on.v1", JSON.stringify({ version: 1, step: "generating", productId: "x", jobId: null }));
  assert.deepEqual(restoreSession(storage), { ...initialTryOnState, step: "photo", productId: "x" });
});

test("back from restored generating and result sessions returns to photo", () => {
  for (const step of ["generating", "result"] as const) {
    const storage = new MemoryStorage();
    storage.setItem("kuhnitver.try-on.v1", JSON.stringify({
      version: 1,
      step,
      productId: "table-1",
      jobId: "job-1",
    }));

    const state = reduceTryOn(restoreSession(storage), { type: "back" });

    assert.deepEqual(state, {
      ...initialTryOnState,
      step: "photo",
      productId: "table-1",
    });
  }
});

test("storage helpers are server-safe when sessionStorage is unavailable", () => {
  assert.doesNotThrow(() => saveSession(initialTryOnState));
  assert.strictEqual(restoreSession(), initialTryOnState);
});
