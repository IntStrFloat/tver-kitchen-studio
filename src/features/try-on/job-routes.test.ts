import assert from "node:assert/strict";
import test from "node:test";

import { MAX_TRY_ON_REQUEST_BYTES } from "./job-api.ts";
import { POST } from "../../app/api/try-on/jobs/route.ts";
import { GET as pollJob } from "../../app/api/try-on/jobs/[id]/route.ts";
import { GET as getResult } from "../../app/api/try-on/jobs/[id]/result/route.ts";

function withEnvironment(provider: string | undefined, nodeEnv: string, run: () => Promise<void>): Promise<void> {
  const environment = process.env as Record<string, string | undefined>;
  const previousProvider = environment.TRY_ON_PROVIDER;
  const previousNodeEnv = environment.NODE_ENV;
  if (provider === undefined) delete environment.TRY_ON_PROVIDER;
  else environment.TRY_ON_PROVIDER = provider;
  environment.NODE_ENV = nodeEnv;

  return run().finally(() => {
    if (previousProvider === undefined) delete environment.TRY_ON_PROVIDER;
    else environment.TRY_ON_PROVIDER = previousProvider;
    if (previousNodeEnv === undefined) delete environment.NODE_ENV;
    else environment.NODE_ENV = previousNodeEnv;
  });
}

test("production guard rejects before parsing a request body", async () => {
  await withEnvironment("fake", "production", async () => {
    let parsed = false;
    const response = await POST({
      headers: new Headers(),
      async formData() { parsed = true; throw new Error("must not parse"); },
    } as unknown as Request);
    assert.equal(response.status, 503);
    assert.deepEqual(await response.json(), { error: "not_configured" });
    assert.equal(parsed, false);
  });
});

test("missing fake provider configuration rejects before parsing a request body", async () => {
  await withEnvironment(undefined, "development", async () => {
    let parsed = false;
    const response = await POST({
      headers: new Headers(),
      async formData() { parsed = true; throw new Error("must not parse"); },
    } as unknown as Request);
    assert.equal(response.status, 503);
    assert.deepEqual(await response.json(), { error: "not_configured" });
    assert.equal(parsed, false);
  });
});

for (const [name, contentLength, status] of [
  ["missing content length", undefined, 411],
  ["invalid content length", "not-a-number", 413],
  ["oversized content length", String(MAX_TRY_ON_REQUEST_BYTES + 1), 413],
] as const) {
  test(`${name} rejects before parsing multipart`, async () => {
    await withEnvironment("fake", "development", async () => {
      let parsed = false;
      const headers = new Headers();
      if (contentLength !== undefined) headers.set("content-length", contentLength);
      const response = await POST({
        headers,
        async formData() { parsed = true; throw new Error("must not parse"); },
      } as unknown as Request);
      assert.equal(response.status, status);
      assert.equal(parsed, false);
    });
  });
}

test("valid-length multipart with the empty catalog rejects unknown products", async () => {
  await withEnvironment("fake", "development", async () => {
    const form = new FormData();
    form.set("room", new File([Uint8Array.of(0xff, 0xd8, 0xff, 0xe0)], "room.jpg", { type: "image/jpeg" }));
    form.set("productId", "not-in-empty-catalog");
    form.set("mask", JSON.stringify({ width: 1, height: 1, points: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }] }));
    const encoded = new Request("http://localhost/api/try-on/jobs", { method: "POST", body: form });
    const body = await encoded.arrayBuffer();
    const response = await POST(new Request(encoded.url, {
      method: "POST",
      headers: {
        "content-type": encoded.headers.get("content-type")!,
        "content-length": String(body.byteLength),
      },
      body,
    }));
    assert.equal(response.status, 400);
    assert.deepEqual(await response.json(), { error: "unknown_product" });
  });
});

test("poll and result routes await params and return private uncached 404s", async () => {
  await withEnvironment("fake", "development", async () => {
    const context = { params: Promise.resolve({ id: "missing" }) };
    for (const response of [
      await pollJob(new Request("http://localhost"), context),
      await getResult(new Request("http://localhost"), context),
    ]) {
      assert.equal(response.status, 404);
      assert.equal(response.headers.get("cache-control"), "private, no-store");
    }
  });
});

// Success and capacity responses cannot be reached until the asset-backed product catalog is populated.
