import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import test from "node:test";
import ts from "typescript";
// @ts-expect-error Node's type-stripping runtime requires the explicit extension.
import { getPhoneError } from "../lib/sendLead.ts";

const require = createRequire(import.meta.url);

// Exercise the actual form handlers and rendered React elements. Only the
// provider boundary and browser focus effect are replaced; no mail is sent.
function catalogHarness(deliver: () => Promise<void>) {
  const state: unknown[] = [];
  const goals: string[] = [];
  let cursor = 0;
  const source = readFileSync(new URL("./CatalogModal.tsx", import.meta.url), "utf8");
  const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX } }).outputText;
  const exports: { default?: (props: Record<string, unknown>) => unknown } = {};
  const modules: Record<string, unknown> = {
    react: { useState: (initial: unknown) => { const index = cursor++; if (!(index in state)) state[index] = initial; return [state[index], (value: unknown) => { state[index] = value; }]; } },
    "react/jsx-runtime": require("react/jsx-runtime"),
    "next/image": { default: "img" },
    "framer-motion": { motion: new Proxy({}, { get: (_obj, key) => `motion-${String(key)}` }), AnimatePresence: "animate-presence" },
    "lucide-react": { X: "icon-x", Check: "icon-check" },
    "@/components/ui/button": { Button: "button" },
    "@/lib/sendLead": { getPhoneError, sendLead: deliver },
    "@/lib/analytics": { GOALS: { catalogLead: "catalog_lead" }, trackGoal: (name: string) => goals.push(name) },
    "@/hooks/use-lead-dialog": { useLeadDialog: () => ({ current: null }) },
  };
  new Function("require", "exports", compiled)((name: string) => {
    if (!(name in modules)) throw new Error(`Unexpected dependency: ${name}`);
    return modules[name];
  }, exports);
  const render = () => {
    cursor = 0;
    return exports.default!({ isOpen: true, onClose() {}, kitchen: { id: 1, name: "Лофт", price: "", image: "/image.jpg", description: "Описание", materials: [] } });
  };
  return { render, goals };
}

function elements(tree: any): any[] {
  if (Array.isArray(tree)) return tree.flatMap(elements);
  if (!tree || typeof tree !== "object" || !tree.props) return [];
  return [tree, ...elements(tree.props.children)];
}

function text(tree: any): string {
  if (Array.isArray(tree)) return tree.map(text).join(" ");
  if (typeof tree === "string") return tree;
  return tree?.props ? text(tree.props.children) : "";
}

test("catalog does not claim success while delivery is pending or rejected", async () => {
  let reject!: (error: Error) => void;
  const harness = catalogHarness(() => new Promise<void>((_resolve, fail) => { reject = fail; }));
  const phone = elements(harness.render()).find((element) => element.type === "input");
  phone.props.onChange({ target: { value: "+7 (915) 000-00-00" } });
  const form = elements(harness.render()).find((element) => element.type === "form");
  const pending = form.props.onSubmit({ preventDefault() {} });
  assert.doesNotMatch(text(harness.render()), /Заявка отправлена!/);
  reject(new Error("offline"));
  await pending;
  const failed = harness.render();
  assert.match(text(failed), /Не удалось отправить заявку/);
  assert.doesNotMatch(text(failed), /Заявка отправлена!/);
  assert.equal(harness.goals.length, 0);
  assert.equal(elements(failed).find((element) => element.type === "input").props.value, "+7 (915) 000-00-00");
});

test("catalog reports successful delivery and conversion only after acknowledgement", async () => {
  let resolve!: () => void;
  const harness = catalogHarness(() => new Promise<void>((finish) => { resolve = finish; }));
  elements(harness.render()).find((element) => element.type === "input").props.onChange({ target: { value: "+7 (915) 000-00-00" } });
  const pending = elements(harness.render()).find((element) => element.type === "form").props.onSubmit({ preventDefault() {} });
  assert.equal(harness.goals.length, 0);
  resolve();
  await pending;
  assert.match(text(harness.render()), /Заявка отправлена!/);
  assert.deepEqual(harness.goals, ["catalog_lead"]);
});

test("catalog native fallback never puts submitted contact fields in a GET URL", () => {
  const harness = catalogHarness(async () => {});
  const form = elements(harness.render()).find((element) => element.type === "form");
  assert.equal(form.props.method, "post");
});

test("server-rendered blog lead form cannot submit contacts before hydration", () => {
  const source = readFileSync(new URL("./BlogLeadForm.tsx", import.meta.url), "utf8");
  const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX } }).outputText;
  const exports: { default?: (props: Record<string, unknown>) => unknown } = {};
  const modules: Record<string, unknown> = {
    react: require("react"),
    "react/jsx-runtime": require("react/jsx-runtime"),
    "@/lib/sendLead": { getPhoneError, sendLead: () => { throw new Error("SSR must not deliver a lead"); } },
    "@/lib/seo": { SITE_CONFIG: { phoneClean: "+74822477081", phone: "+7 (4822) 47-70-81" } },
    "@/lib/analytics": { getAcquisitionSource: () => "unknown", trackBlogEvent() {} },
  };
  new Function("require", "exports", compiled)((name: string) => {
    if (!(name in modules)) throw new Error(`Unexpected dependency: ${name}`);
    return modules[name];
  }, exports);
  const React = require("react");
  const { renderToStaticMarkup } = require("react-dom/server");
  const html = renderToStaticMarkup(React.createElement(exports.default, {
    slug: "test", title: "Test", placement: "inline",
    cta: { title: "Получить расчёт", description: "Оставьте пожелания", buttonLabel: "Отправить", context: "test" },
  }));
  const form = /<form\b[^>]*>([\s\S]*?)<\/form>/.exec(html);
  assert.ok(form);
  assert.match(form[0], /^<form\b[^>]*\bmethod="post"/);
  const fieldset = /<fieldset\b[^>]*\bdisabled=""[^>]*>([\s\S]*?)<\/fieldset>/.exec(form[1]);
  assert.ok(fieldset, "All contact controls must be inside a disabled SSR fieldset");
  assert.match(fieldset[1], /<input\b[^>]*\bname="name"/);
  assert.match(fieldset[1], /<input\b[^>]*\bname="phone"/);
  assert.doesNotMatch(form[1].replace(fieldset[0], ""), /<(input|button|textarea|select)\b/);
  assert.match(html, /<noscript>[\s\S]*href="tel:\+74822477081"/);
});
