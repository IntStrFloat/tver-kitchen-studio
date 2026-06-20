import assert from "node:assert/strict";
import test from "node:test";

import {
  validateImageMetadata,
  validateImageSignature,
} from "./image-validation.ts";

test("accepts JPEG metadata from the product plan example", () => {
  assert.deepEqual(validateImageMetadata({ type: "image/jpeg", size: 1_000 }), { ok: true });
});

test("rejects unsupported image metadata", () => {
  assert.deepEqual(validateImageMetadata({ type: "image/svg+xml", size: 1_000 }), {
    ok: false,
    code: "type",
  });
});

test("rejects image metadata over 12 MiB", () => {
  assert.deepEqual(validateImageMetadata({ type: "image/webp", size: 13 * 1024 * 1024 }), {
    ok: false,
    code: "size",
  });
});

test("rejects empty image metadata", () => {
  assert.deepEqual(validateImageMetadata({ type: "image/jpeg", size: 0 }), {
    ok: false,
    code: "empty",
  });
});

const signatureCases: ReadonlyArray<{
  readonly name: string;
  readonly bytes: Uint8Array;
  readonly type: string;
  readonly expected: { readonly ok: true } | { readonly ok: false; readonly code: "signature" };
}> = [
  {
    name: "valid JPEG signature",
    bytes: Uint8Array.of(0xff, 0xd8, 0xff, 0x00),
    type: "image/jpeg",
    expected: { ok: true },
  },
  {
    name: "disguised JPEG content",
    bytes: Uint8Array.of(0x89, 0x50, 0x4e, 0x47),
    type: "image/jpeg",
    expected: { ok: false, code: "signature" },
  },
  {
    name: "truncated JPEG signature",
    bytes: Uint8Array.of(0xff, 0xd8),
    type: "image/jpeg",
    expected: { ok: false, code: "signature" },
  },
  {
    name: "valid WebP signature",
    bytes: Uint8Array.of(0x52, 0x49, 0x46, 0x46, 0, 0, 0, 0, 0x57, 0x45, 0x42, 0x50),
    type: "image/webp",
    expected: { ok: true },
  },
  {
    name: "WebP MIME with disguised content",
    bytes: Uint8Array.of(0x52, 0x49, 0x46, 0x46, 0, 0, 0, 0, 0x4a, 0x50, 0x45, 0x47),
    type: "image/webp",
    expected: { ok: false, code: "signature" },
  },
  {
    name: "truncated WebP signature",
    bytes: Uint8Array.of(0x52, 0x49, 0x46, 0x46, 0, 0, 0, 0, 0x57, 0x45, 0x42),
    type: "image/webp",
    expected: { ok: false, code: "signature" },
  },
];

for (const signatureCase of signatureCases) {
  test(signatureCase.name, () => {
    assert.deepEqual(
      validateImageSignature(signatureCase.bytes, signatureCase.type),
      signatureCase.expected,
    );
  });
}
