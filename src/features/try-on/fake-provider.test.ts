import assert from "node:assert/strict";
import test from "node:test";

import { fakeTryOnProvider } from "./fake-provider.ts";
import type { ProviderInput } from "./provider.ts";

test("fake provider returns the job id without network or input mutation", async () => {
  const originalFetch = globalThis.fetch;
  let fetchCalls = 0;
  globalThis.fetch = (() => {
    fetchCalls += 1;
    throw new Error("fake provider must not call fetch");
  }) as typeof fetch;

  const input: ProviderInput = {
    jobId: "job-123",
    productId: "kitchen-1",
    room: Uint8Array.of(1, 2, 3),
    mask: {
      width: 640,
      height: 480,
      points: [{ x: 10, y: 20 }],
    },
  };
  const roomBefore = Uint8Array.from(input.room);
  const maskBefore = structuredClone(input.mask);

  try {
    assert.deepEqual(await fakeTryOnProvider.generate(input), {
      status: "succeeded",
      resultKey: "job-123",
    });
  } finally {
    globalThis.fetch = originalFetch;
  }

  assert.equal(fetchCalls, 0);
  assert.deepEqual(input.room, roomBefore);
  assert.deepEqual(input.mask, maskBefore);
});
