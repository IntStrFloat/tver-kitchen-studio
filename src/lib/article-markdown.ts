// A limited format for our own articles: data only, never raw HTML.
export type ArticleBlock =
  | { type: "heading"; level: 2 | 3 | 4; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; ordered: boolean; start: number; items: string[] }
  | { type: "table"; headers: string[]; rows: string[][] };

export type ArticleInline =
  | { type: "text" | "strong" | "code"; text: string }
  | { type: "link"; text: string; href: string };

function safeLink(href: string): boolean {
  if (/[\s\\\u0000-\u001f]/.test(href)) return false;
  if (href.startsWith("#")) return true;
  if (href.startsWith("/") && !href.startsWith("//")) return true;
  try { return ["https:", "http:"].includes(new URL(href).protocol); }
  catch { return false; }
}

export function parseArticleInline(text: string): ArticleInline[] {
  const tokens: ArticleInline[] = [];
  const pattern = /\[([^\]]+)\]\(([^\s)]+)\)|\*\*([^*]+)\*\*|`([^`]+)`/g;
  let cursor = 0;
  for (const match of text.matchAll(pattern)) {
    const index = match.index ?? 0;
    if (index > cursor) tokens.push({ type: "text", text: text.slice(cursor, index) });
    if (match[1] !== undefined) tokens.push(safeLink(match[2])
      ? { type: "link", text: match[1], href: match[2] }
      : { type: "text", text: match[1] });
    else if (match[3] !== undefined) tokens.push({ type: "strong", text: match[3] });
    else tokens.push({ type: "code", text: match[4] });
    cursor = index + match[0].length;
  }
  if (cursor < text.length) tokens.push({ type: "text", text: text.slice(cursor) });
  return tokens;
}

const listItem = (line: string) => line.match(/^\s*(?:(\d+)\.|([-*]))\s+(.+)$/);
const heading = (line: string) => line.match(/^(#{2,4})\s+(.+)$/);
const cells = (line: string) => line.trim().replace(/^\|/, "").replace(/\|$/, "")
  .split("|").map((cell) => cell.trim());
const tableSeparator = (line: string) => line.includes("|") && cells(line)
  .every((cell) => /^:?-{3,}:?$/.test(cell));

export function parseArticleMarkdown(markdown: string): ArticleBlock[] {
  const lines = markdown.replace(/\r\n?/g, "\n").split("\n");
  const blocks: ArticleBlock[] = [];
  let index = 0;
  while (index < lines.length) {
    const line = lines[index].trim();
    if (!line) { index++; continue; }
    const title = heading(line);
    if (title) {
      blocks.push({ type: "heading", level: title[1].length as 2 | 3 | 4, text: title[2] });
      index++;
      continue;
    }
    if (line.includes("|") && tableSeparator(lines[index + 1] ?? "")) {
      const headers = cells(line);
      const rows: string[][] = [];
      index += 2;
      while (index < lines.length && lines[index].trim().includes("|")) {
        const row = cells(lines[index]);
        rows.push(headers.map((_, column) => row[column] ?? ""));
        index++;
      }
      blocks.push({ type: "table", headers, rows });
      continue;
    }
    const firstItem = listItem(line);
    if (firstItem) {
      const ordered = firstItem[1] !== undefined;
      const items: string[] = [];
      const start = ordered ? Number(firstItem[1]) : 1;
      while (index < lines.length) {
        const item = listItem(lines[index]);
        if (!item || (item[1] !== undefined) !== ordered) break;
        items.push(item[3]);
        index++;
        while (index < lines.length && !lines[index].trim()) index++;
      }
      blocks.push({ type: "list", ordered, start, items });
      continue;
    }
    const paragraph = [line];
    index++;
    while (index < lines.length && lines[index].trim()
      && !heading(lines[index]) && !listItem(lines[index])
      && !(lines[index].includes("|") && tableSeparator(lines[index + 1] ?? ""))) {
      paragraph.push(lines[index].trim());
      index++;
    }
    blocks.push({ type: "paragraph", text: paragraph.join(" ") });
  }
  return blocks;
}

export function articlePlainText(markdown: string): string {
  const inline = (text: string) => parseArticleInline(text)
    .map((token) => token.type === "link" ? `${token.text} (${token.href})` : token.text).join("");
  return parseArticleMarkdown(markdown).map((block) => {
    if (block.type === "list") return block.items.map((item, index) =>
      `${block.ordered ? `${block.start + index}.` : "•"} ${inline(item)}`).join("\n");
    if (block.type === "table") return block.rows.map((row) => row
      .map((cell, index) => `${inline(block.headers[index])}: ${inline(cell)}`).join("; ")).join("\n");
    return inline(block.text);
  }).join("\n\n");
}
