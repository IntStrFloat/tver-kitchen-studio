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

  if (metadata.size === 0) {
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
  const isJpeg = type === "image/jpeg"
    && bytes.length >= 3
    && bytes[0] === 0xff
    && bytes[1] === 0xd8
    && bytes[2] === 0xff;

  const isWebP = type === "image/webp"
    && bytes.length >= 12
    && bytes[0] === 0x52
    && bytes[1] === 0x49
    && bytes[2] === 0x46
    && bytes[3] === 0x46
    && bytes[8] === 0x57
    && bytes[9] === 0x45
    && bytes[10] === 0x42
    && bytes[11] === 0x50;

  return isJpeg || isWebP
    ? { ok: true }
    : { ok: false, code: "signature" };
}
