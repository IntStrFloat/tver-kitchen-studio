import type { TryOnProvider } from "./provider.ts";

export const fakeTryOnProvider: TryOnProvider = {
  async generate(input) {
    return { status: "succeeded", resultKey: input.jobId };
  },
};
