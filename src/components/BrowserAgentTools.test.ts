import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import ts from "typescript";
// @ts-expect-error Node's type-stripping runtime requires the explicit extension.
import { SITE_CONFIG } from "../lib/seo.ts";

// Run the real component module with a simulated browser API, without a server,
// browser flags, extra packages, network requests or production form submissions.
function harness(withApi = true) {
  const effects: (() => (() => void) | undefined)[] = [];
  const registrations: { tool: { name: string; execute: (input: unknown) => Promise<Record<string, unknown>> }; signal: AbortSignal }[] = [];
  const mockData = {
    COMMERCIAL_TERMS: { pricingText: "Индивидуальный расчёт", deliveryText: "Доставка согласуется" },
    cities: [{ slug: "tveri", name: "Тверь", deliveryCost: "По договору", deliveryTime: "По готовности" }],
    kitchenStyles: [{ slug: "loft", name: "Лофт", materials: ["МДФ"], features: ["По размерам"] }],
  };
  const doc = withApi ? { modelContext: { async registerTool(tool: typeof registrations[number]["tool"], options: { signal: AbortSignal }) { registrations.push({ tool, signal: options.signal }); } } } : {};
  const source = readFileSync(new URL("./BrowserAgentTools.tsx", import.meta.url), "utf8");
  const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX } }).outputText;
  const exports: { default?: () => null; getBrowserTools?: () => { name: string; annotations: Record<string, unknown>; execute: (input: unknown) => Promise<Record<string, unknown>> }[] } = {};
  const requireMock = (name: string) => {
    if (name === "react") return { useEffect: (effect: typeof effects[number]) => effects.push(effect) };
    if (name === "@/lib/data") return mockData;
    if (name === "@/lib/seo") return { SITE_CONFIG };
    throw new Error(`Unexpected module: ${name}`);
  };
  new Function("require", "exports", "document", "window", compiled)(requireMock, exports, doc, { isSecureContext: true });
  exports.default!();
  return { tools: exports.getBrowserTools!(), effects, registrations };
}

test("WebMCP exposes public read-only tools, never a lead submission action", () => {
  const { tools } = harness();
  assert.deepEqual(tools.map((tool) => tool.name), ["get_business_info", "get_service_area", "get_kitchen_options"]);
  assert.ok(tools.every((tool) => tool.annotations.readOnlyHint === true));
});

test("WebMCP reads the same business conditions and city record as the pages", async () => {
  const { tools } = harness();
  const info = await tools[0].execute({});
  assert.equal((info.conditions as Record<string, string>).pricingText, "Индивидуальный расчёт");
  const result = await tools[1].execute({ city_slug: "tveri" });
  assert.equal((result.cities as Record<string, string>[])[0].delivery, "По договору");
});

test("runtime validation rejects unknown fields, invalid types and unknown options", async () => {
  const { tools } = harness();
  assert.ok((await tools[0].execute({ phone: "private" })).error);
  assert.ok((await tools[1].execute({ city_slug: [] })).error);
  assert.ok((await tools[1].execute({ city_slug: "missing" })).error);
  assert.ok((await tools[2].execute({ style_slug: "missing" })).error);
  assert.ok((await tools[2].execute(null)).error);
});

test("WebMCP omits the unconfirmed postal code of the moved address", async () => {
  const info = await harness().tools[0].execute({});
  const address = info.address as Record<string, unknown>;
  assert.equal(address.locality, "Тверь");
  assert.equal(Object.hasOwn(address, "postalCode"), false);
});

test("tools register on the current document API and unregister on cleanup", async () => {
  const { effects, registrations } = harness();
  const cleanup = effects[0]();
  await new Promise((resolve) => setTimeout(resolve, 0));
  assert.equal(registrations.length, 3);
  assert.equal(registrations[0].signal.aborted, false);
  cleanup!();
  assert.ok(registrations.every((registration) => registration.signal.aborted));
});

test("unsupported browsers continue without registration or errors", () => {
  const { effects, registrations } = harness(false);
  assert.doesNotThrow(() => effects[0]());
  assert.equal(registrations.length, 0);
});
