import assert from "node:assert/strict";
import test from "node:test";
// @ts-expect-error Node's type-stripping runtime requires the explicit extension.
import { prefersMarkdown } from "./accept.ts";

test("selects Markdown only when explicitly requested and preferred", () => {
  for (const accept of [
    "text/markdown",
    "text/markdown, */*",
    "text/html, text/markdown",
    'TEXT/MARKDOWN; charset="UTF-8"; q=0.8, text/*; q=0.7',
    "text/markdown;q=0.8, text/html;q=0.5, */*;q=1",
  ]) {
    assert.equal(prefersMarkdown(accept), true, accept);
  }
});

test("retains HTML for wildcard, excluded, or unsupported Markdown ranges", () => {
  for (const accept of [
    null,
    "*/*",
    "text/*",
    "text/html, text/markdown;q=0.8",
    "text/markdown;q=0, */*",
    "text/markdown, text/markdown;charset=utf-8;q=0",
    "text/markdown;charset=iso-8859-1",
    "text/markdown;q=2",
    'text/html;example="a,text/markdown,b"',
  ]) {
    assert.equal(prefersMarkdown(accept), false, accept ?? "Accept omitted");
  }
});
