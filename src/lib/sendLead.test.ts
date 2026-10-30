import assert from "node:assert/strict";
import test from "node:test";
// @ts-expect-error Node's type-stripping runtime requires the explicit extension.
import { sendLead } from "./sendLead.ts";

test("invalid contact details never reach the lead provider", async () => {
  const original = globalThis.fetch;
  let requests = 0;
  globalThis.fetch = async () => { requests++; return new Response('{"success":true}'); };
  try {
    await assert.rejects(sendLead({ phone: "123", source: "test" }));
    assert.equal(requests, 0);
  } finally { globalThis.fetch = original; }
});

test("a provider failure never resolves as a sent lead", async () => {
  const original = globalThis.fetch;
  globalThis.fetch = async () => new Response('{"success":false}', { status: 200 });
  try { await assert.rejects(sendLead({ phone: "+7 (915) 000-00-00", source: "test" })); }
  finally { globalThis.fetch = original; }
});

test("delivery preserves the existing client endpoint and waits for success", async () => {
  const original = globalThis.fetch;
  let body: Record<string, string> = {};
  globalThis.fetch = async (url, options) => {
    assert.equal(url, "https://api.web3forms.com/submit");
    body = JSON.parse(String(options?.body));
    return new Response('{"success":true}', { status: 200 });
  };
  try {
    await sendLead({ phone: " +7 (915) 000-00-00 ", name: " Test ", source: "regression", details: { Layout: "straight" } });
    assert.equal(body["Телефон"], "+7 (915) 000-00-00");
    assert.equal(body["Имя"], "Test");
    assert.equal(body.Layout, "straight");
  } finally { globalThis.fetch = original; }
});
