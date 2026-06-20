import assert from "node:assert/strict";
import test from "node:test";
import { isTryOnSession } from "./types.ts";

test("accepts a serializable selected-product session", () => {
  const value = JSON.parse(JSON.stringify({ version: 1, step: "photo", productId: "kitchen-modern-01", jobId: null }));
  assert.equal(isTryOnSession(value), true);
  assert.equal(isTryOnSession({ ...value, version: 2 }), false);
});

test("accepts valid nullable product and job combinations", () => {
  const sessions = [
    { version: 1, step: "product", productId: null, jobId: null },
    { version: 1, step: "photo", productId: "kitchen-modern-01", jobId: null },
    { version: 1, step: "generating", productId: null, jobId: "job-01" },
    { version: 1, step: "result", productId: "kitchen-modern-01", jobId: "job-01" },
  ];

  for (const session of sessions) {
    assert.equal(isTryOnSession(session), true);
  }
});

test("rejects malformed sessions", () => {
  const validSession = { version: 1, step: "mask", productId: "kitchen-modern-01", jobId: null };
  const invalidSessions = [
    null,
    [],
    { step: "mask", productId: "kitchen-modern-01", jobId: null },
    { version: 1, productId: "kitchen-modern-01", jobId: null },
    { version: 1, step: "mask", jobId: null },
    { version: 1, step: "mask", productId: "kitchen-modern-01" },
    { ...validSession, step: "uploading" },
    { ...validSession, productId: 42 },
    { ...validSession, jobId: false },
  ];

  for (const session of invalidSessions) {
    assert.equal(isTryOnSession(session), false);
  }
});
