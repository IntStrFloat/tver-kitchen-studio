import assert from "node:assert/strict";
import test from "node:test";
// @ts-expect-error Node's type-stripping runtime requires the explicit extension.
import { GOALS, trackGoal, trackBlogEvent, getAcquisitionSource, YM_COUNTER_IDS } from "./analytics.ts";

test("GA4 still receives conversions when Metrika is blocked", () => {
  const calls: unknown[][] = [];
  Object.defineProperty(globalThis, "window", { configurable: true, value: { gtag: (...args: unknown[]) => calls.push(args) } });
  try { trackGoal(GOALS.callbackRequest); assert.equal(calls[0]?.[1], "callback_request"); }
  finally { Reflect.deleteProperty(globalThis, "window"); }
});

test("one broken counter cannot suppress other counters or GA4", () => {
  const calls: unknown[][] = [];
  Object.defineProperty(globalThis, "window", { configurable: true, value: {
    ym: (id: number, ...args: unknown[]) => { if (id === YM_COUNTER_IDS[0]) throw new Error("blocked"); calls.push([id, ...args]); },
    gtag: (...args: unknown[]) => calls.push(args),
  } });
  try {
    trackBlogEvent("blog_lead", { article_slug: "test", article_title: "Test" });
    assert.equal(calls.length, 2);
    assert.equal(calls[0][0], YM_COUNTER_IDS[1]);
    assert.equal(calls[1][1], "blog_lead");
  } finally { Reflect.deleteProperty(globalThis, "window"); }
});

test("analytics is safe during server rendering", () => {
  assert.doesNotThrow(() => trackGoal(GOALS.quizLead));
});

test("acquisition keeps fixed sources and rejects lookalike hosts and arbitrary UTM", () => {
  assert.equal(getAcquisitionSource("https://chatgpt.com/?email=private", ""), "chatgpt");
  assert.equal(getAcquisitionSource("https://chatgpt.com.evil.example/", ""), "unknown");
  assert.equal(getAcquisitionSource("", "?utm_source=private@example.com"), "unknown");
  assert.equal(getAcquisitionSource("", "?utm_source=chatgpt.com"), "chatgpt");
  assert.equal(getAcquisitionSource("https://www.google.com/search?q=private", ""), "google");
});

test("the fixed acquisition category survives an internal navigation", () => {
  const saved = new Map<string, string>();
  const categories: unknown[] = [];
  const fakeWindow = {
    location: { search: "?utm_source=chatgpt.com&phone=private" },
    sessionStorage: { setItem: (key: string, value: string) => saved.set(key, value), getItem: (key: string) => saved.get(key) },
    gtag: (_command: string, _event: string, params: Record<string, unknown>) => categories.push(params.acquisition_source),
  };
  Object.defineProperty(globalThis, "window", { configurable: true, value: fakeWindow });
  try {
    trackGoal(GOALS.call);
    fakeWindow.location.search = "";
    trackGoal(GOALS.quizLead);
    assert.deepEqual(categories, ["chatgpt", "chatgpt"]);
    assert.deepEqual(Array.from(saved.values()), ["chatgpt"]);
  } finally { Reflect.deleteProperty(globalThis, "window"); }
});

test("conversion events strip contact details and raw URL parameters", () => {
  let payload: Record<string, unknown> = {};
  Object.defineProperty(globalThis, "window", { configurable: true, value: { gtag: (_cmd: string, _event: string, params: Record<string, unknown>) => { payload = params; } } });
  try {
    trackGoal(GOALS.quizLead, { phone: "+79150000000", email: "private@example.com", utm_campaign: "private", form_type: "quiz" });
    assert.deepEqual(payload, { form_type: "quiz", acquisition_source: "unknown" });
  } finally { Reflect.deleteProperty(globalThis, "window"); }
});
