const MAX_IMAGE_SIZE = 12 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/webp"]);

export type ImageValidationResult =
  | { readonly ok: true }
  | { readonly ok: false; readonly code: "type" | "size" | "empty" };

export type ImageSignatureValidationResult =
  | { readonly ok: true }
  | { readonly ok: false; readonly code: "signature" };

export function validateImageMetadata(metadata: {
  readonly type: string;
  readonly size: number;
}): ImageValidationResult {
  if (!ALLOWED_IMAGE_TYPES.has(metadata.type)) {
    return { ok: false, code: "type" };
  }

  if (!Number.isSafeInteger(metadata.size) || metadata.size <= 0) {
    return { ok: false, code: "empty" };
  }

  if (metadata.size > MAX_IMAGE_SIZE) {
    return { ok: false, code: "size" };
  }

  return { ok: true };
}

export function validateImageSignature(
  bytes: Uint8Array,
  type: string,
): ImageSignatureValidationResult {
  // This screens known container signatures only; callers still need a real image decoder.
  const isJpeg = type === "image/jpeg"
    && bytes.length >= 4
    && bytes[0] === 0xff
    && bytes[1] === 0xd8
    && bytes[2] === 0xff
    && bytes[3] !== 0x00
    && bytes[3] !== 0xff;

  const isWebP = type === "image/webp"
    && bytes.length >= 16
    && bytes[0] === 0x52
    && bytes[1] === 0x49
    && bytes[2] === 0x46
    && bytes[3] === 0x46
    && bytes[8] === 0x57
    && bytes[9] === 0x45
    && bytes[10] === 0x42
    && bytes[11] === 0x50
    && isWebPChunk(bytes);

  return isJpeg || isWebP
    ? { ok: true }
    : { ok: false, code: "signature" };
}

function isWebPChunk(bytes: Uint8Array): boolean {
  return bytes[12] === 0x56
    && bytes[13] === 0x50
    && bytes[14] === 0x38
    && (bytes[15] === 0x20 || bytes[15] === 0x4c || bytes[15] === 0x58);
}
