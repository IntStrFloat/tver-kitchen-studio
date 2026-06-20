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

const metadataSizeCases: ReadonlyArray<{
  readonly name: string;
  readonly size: number;
  readonly expected: { readonly ok: true } | {
    readonly ok: false;
    readonly code: "empty" | "size";
  };
}> = [
  { name: "negative size", size: -1, expected: { ok: false, code: "empty" } },
  { name: "zero size", size: 0, expected: { ok: false, code: "empty" } },
  { name: "NaN size", size: Number.NaN, expected: { ok: false, code: "empty" } },
  { name: "infinite size", size: Number.POSITIVE_INFINITY, expected: { ok: false, code: "empty" } },
  { name: "fractional size", size: 1.5, expected: { ok: false, code: "empty" } },
  { name: "exactly 12 MiB", size: 12 * 1024 * 1024, expected: { ok: true } },
  { name: "one byte over 12 MiB", size: 12 * 1024 * 1024 + 1, expected: { ok: false, code: "size" } },
];

for (const metadataCase of metadataSizeCases) {
  test(`validates ${metadataCase.name}`, () => {
    assert.deepEqual(
      validateImageMetadata({ type: "image/webp", size: metadataCase.size }),
      metadataCase.expected,
    );
  });
}

const signatureCases: ReadonlyArray<{
  readonly name: string;
  readonly bytes: Uint8Array;
  readonly type: string;
  readonly expected: { readonly ok: true } | { readonly ok: false; readonly code: "signature" };
}> = [
  { name: "valid JPEG signature", bytes: Uint8Array.of(0xff, 0xd8, 0xff, 0xe0), type: "image/jpeg", expected: { ok: true } },
  { name: "disguised JPEG content", bytes: Uint8Array.of(0x89, 0x50, 0x4e, 0x47), type: "image/jpeg", expected: { ok: false, code: "signature" } },
  { name: "two-byte truncated JPEG signature", bytes: Uint8Array.of(0xff, 0xd8), type: "image/jpeg", expected: { ok: false, code: "signature" } },
  { name: "three-byte JPEG header without a marker", bytes: Uint8Array.of(0xff, 0xd8, 0xff), type: "image/jpeg", expected: { ok: false, code: "signature" } },
  { name: "JPEG signature with zero marker", bytes: Uint8Array.of(0xff, 0xd8, 0xff, 0x00), type: "image/jpeg", expected: { ok: false, code: "signature" } },
  { name: "JPEG signature with fill marker", bytes: Uint8Array.of(0xff, 0xd8, 0xff, 0xff), type: "image/jpeg", expected: { ok: false, code: "signature" } },
  { name: "valid lossy WebP chunk", bytes: webPBytes("VP8 "), type: "image/webp", expected: { ok: true } },
  { name: "valid lossless WebP chunk", bytes: webPBytes("VP8L"), type: "image/webp", expected: { ok: true } },
  { name: "valid extended WebP chunk", bytes: webPBytes("VP8X"), type: "image/webp", expected: { ok: true } },
  { name: "WebP MIME with disguised content", bytes: Uint8Array.of(0x52, 0x49, 0x46, 0x46, 0, 0, 0, 0, 0x4a, 0x50, 0x45, 0x47), type: "image/webp", expected: { ok: false, code: "signature" } },
  { name: "eleven-byte truncated WebP signature", bytes: Uint8Array.of(0x52, 0x49, 0x46, 0x46, 0, 0, 0, 0, 0x57, 0x45, 0x42), type: "image/webp", expected: { ok: false, code: "signature" } },
  { name: "twelve-byte WebP header without a chunk", bytes: Uint8Array.of(0x52, 0x49, 0x46, 0x46, 0, 0, 0, 0, 0x57, 0x45, 0x42, 0x50), type: "image/webp", expected: { ok: false, code: "signature" } },
  { name: "WebP header with an unsupported chunk", bytes: webPBytes("JUNK"), type: "image/webp", expected: { ok: false, code: "signature" } },
];

function webPBytes(chunkId: "VP8 " | "VP8L" | "VP8X" | "JUNK"): Uint8Array {
  return Uint8Array.of(
    0x52, 0x49, 0x46, 0x46,
    0, 0, 0, 0,
    0x57, 0x45, 0x42, 0x50,
    ...Array.from(chunkId, (character) => character.charCodeAt(0)),
  );
}

for (const signatureCase of signatureCases) {
  test(signatureCase.name, () => {
    assert.deepEqual(
      validateImageSignature(signatureCase.bytes, signatureCase.type),
      signatureCase.expected,
    );
  });
}
