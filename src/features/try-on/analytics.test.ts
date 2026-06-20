import assert from "node:assert/strict";
import test from "node:test";

import { sanitizeTryOnPayload, trackTryOnEvent } from "./analytics.ts";

test("sanitizeTryOnPayload keeps only compact allowlisted string values", () => {
  const payload = sanitizeTryOnPayload({
    product_id: "kitchen-modern-01",
    group_id: "kitchens",
    job_status: "succeeded",
    retry_reason: "provider_failed",
    elapsed_bucket: "15-45s",
    source: "AI-primerka",
    phone: "+79990000000",
    name: "Ivan",
    photo_url: "blob:https://example.test/room-photo",
    result_url: "https://example.test/api/try-on/jobs/1/result",
    data_url: "data:image/jpeg;base64,secret",
    unknown: "discard",
    count: 1,
  });

  assert.deepEqual(payload, {
    product_id: "kitchen-modern-01",
    group_id: "kitchens",
    job_status: "succeeded",
    retry_reason: "provider_failed",
    elapsed_bucket: "15-45s",
    source: "AI-primerka",
  });
});

test("sanitizeTryOnPayload drops oversized and non-string values", () => {
  assert.deepEqual(sanitizeTryOnPayload({
    product_id: "x".repeat(81),
    group_id: ["kitchens"],
    source: "AI-primerka",
  }), { source: "AI-primerka" });
});

test("trackTryOnEvent sends sanitized values to both counters", () => {
  const previousWindow = globalThis.window;
  const ymCalls: unknown[][] = [];
  const gtagCalls: unknown[][] = [];
  globalThis.window = {
    ym: (...args: unknown[]) => ymCalls.push(args),
    gtag: (...args: unknown[]) => gtagCalls.push(args),
  } as unknown as Window & typeof globalThis;

  try {
    trackTryOnEvent("try_on_generation_completed", {
      product_id: "kitchen-modern-01",
      job_status: "succeeded",
      photo_url: "blob:private-room",
    });
  } finally {
    globalThis.window = previousWindow;
  }

  assert.equal(ymCalls.length, 2);
  assert.deepEqual(ymCalls[0], [106971287, "reachGoal", "try_on_generation_completed", {
    product_id: "kitchen-modern-01",
    job_status: "succeeded",
  }]);
  assert.deepEqual(gtagCalls, [["event", "try_on_generation_completed", {
    product_id: "kitchen-modern-01",
    job_status: "succeeded",
  }]]);
});

test("trackTryOnEvent never throws when analytics globals are absent or fail", () => {
  const previousWindow = globalThis.window;
  globalThis.window = {
    ym: () => { throw new Error("counter unavailable"); },
    gtag: () => { throw new Error("counter unavailable"); },
  } as unknown as Window & typeof globalThis;

  try {
    assert.doesNotThrow(() => trackTryOnEvent("try_on_open", { result_url: "https://private.test" }));
    globalThis.window = {} as Window & typeof globalThis;
    assert.doesNotThrow(() => trackTryOnEvent("try_on_open"));
  } finally {
    globalThis.window = previousWindow;
  }
});
