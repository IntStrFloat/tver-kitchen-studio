import type { PlacementMask } from "./types.ts";

export interface ProviderInput {
  readonly jobId: string;
  readonly productId: string;
  readonly room: Uint8Array;
  readonly mask: PlacementMask;
}

export type ProviderFailureCode =
  | "invalid_image"
  | "provider_timeout"
  | "provider_failed";

export type ProviderResult =
  | { readonly status: "succeeded"; readonly resultKey: string }
  | { readonly status: "failed"; readonly errorCode: ProviderFailureCode };

export interface TryOnProvider {
  generate(input: ProviderInput): Promise<ProviderResult>;
}
