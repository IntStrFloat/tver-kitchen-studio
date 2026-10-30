import assert from "node:assert/strict";
import test from "node:test";
// @ts-expect-error Node's type-stripping runtime requires the explicit extension.
import { articlePlainText, parseArticleInline, parseArticleMarkdown } from "./article-markdown.ts";

test("article tables retain headers, rows and links as structured content", () => {
  const blocks = parseArticleMarkdown("## Сравнение\n\n| Материал | Уход |\n| --- | --- |\n| Кварц | [Инструкция](https://example.com/care) |\n| Мрамор | Бережный |\n\nИтог.");
  assert.deepEqual(blocks.map((block) => block.type), ["heading", "table", "paragraph"]);
  assert.deepEqual(blocks[1], { type: "table", headers: ["Материал", "Уход"], rows: [["Кварц", "[Инструкция](https://example.com/care)"], ["Мрамор", "Бережный"]] });
});

test("numbered items separated by paragraphs remain a single ordered list", () => {
  assert.deepEqual(parseArticleMarkdown("3. Согласовать проект\n\n4. Проверить смету\n\n## Дальше\n\n- Позвонить\n- Уточнить"), [
    { type: "list", ordered: true, start: 3, items: ["Согласовать проект", "Проверить смету"] },
    { type: "heading", level: 2, text: "Дальше" },
    { type: "list", ordered: false, start: 1, items: ["Позвонить", "Уточнить"] },
  ]);
});

test("links allow public sources and site paths, but never executable schemes", () => {
  const tokens = parseArticleInline("[Цена](/price) [Источник](https://example.com) [Вредный](javascript:alert(1)) [Внешний](//example.com) [Обход](/\\example.com)");
  assert.deepEqual(tokens.filter((token) => token.type === "link").map((token) => token.href), ["/price", "https://example.com"]);
});

test("raw markup stays text and malformed tables stay readable", () => {
  assert.deepEqual(parseArticleMarkdown('<script>alert("x")</script>\n\nМатериал | Уход\nне таблица'), [
    { type: "paragraph", text: '<script>alert("x")</script>' },
    { type: "paragraph", text: "Материал | Уход не таблица" },
  ]);
  assert.deepEqual(parseArticleInline("**Важно**: `размер`"), [{ type: "strong", text: "Важно" }, { type: "text", text: ": " }, { type: "code", text: "размер" }]);
});

test("RSS text preserves table meaning and source URLs without Markdown syntax", () => {
  assert.equal(articlePlainText("## Материалы\n\n| Материал | Уход |\n| --- | --- |\n| Кварц | [Инструкция](https://example.com/care) |\n\n1. Сравнить\n2. Проверить"),
    "Материалы\n\nМатериал: Кварц; Уход: Инструкция (https://example.com/care)\n\n1. Сравнить\n2. Проверить");
});
