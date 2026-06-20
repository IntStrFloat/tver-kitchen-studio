import type { PlacementMask, TryOnErrorCode } from "./types.ts";

export interface ProviderInput {
  readonly jobId: string;
  readonly productId: string;
  /** Borrowed bytes: providers must not mutate or retain them; clone when ownership is needed. */
  readonly room: Uint8Array;
  readonly mask: PlacementMask;
}

export type ProviderFailureCode = TryOnErrorCode;

export type ProviderResult =
  | { readonly status: "succeeded"; readonly resultKey: string }
  | { readonly status: "failed"; readonly errorCode: ProviderFailureCode };

export interface TryOnProvider {
  generate(input: ProviderInput): Promise<ProviderResult>;
}
