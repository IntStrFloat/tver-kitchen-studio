import assert from "node:assert/strict";
import test from "node:test";
// @ts-expect-error Node's type-stripping runner requires the explicit TypeScript extension.
import { isTryOnSession } from "./types.ts";

test("accepts a serializable selected-product session", () => {
  const value = JSON.parse(JSON.stringify({ version: 1, step: "photo", productId: "kitchen-modern-01", jobId: null }));
  assert.equal(isTryOnSession(value), true);
  assert.equal(isTryOnSession({ ...value, version: 2 }), false);
});
