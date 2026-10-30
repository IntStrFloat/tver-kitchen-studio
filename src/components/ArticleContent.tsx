import { parseArticleInline, parseArticleMarkdown } from "@/lib/article-markdown";

function Inline({ text }: { text: string }) {
  return parseArticleInline(text).map((token, index) => {
    if (token.type === "link") return <a key={index} href={token.href}>{token.text}</a>;
    if (token.type === "strong") return <strong key={index}>{token.text}</strong>;
    if (token.type === "code") return <code key={index}>{token.text}</code>;
    return <span key={index}>{token.text}</span>;
  });
}

export default function ArticleContent({ content }: { content: string }) {
  return (
    <div className="prose prose-lg max-w-none">
      {parseArticleMarkdown(content).map((block, index) => {
        if (block.type === "heading") {
          const Heading = `h${block.level}` as "h2" | "h3" | "h4";
          return <Heading key={index}><Inline text={block.text} /></Heading>;
        }
        if (block.type === "list") {
          const items = block.items.map((item, itemIndex) => <li key={itemIndex}><Inline text={item} /></li>);
          return block.ordered
            ? <ol key={index} start={block.start}>{items}</ol>
            : <ul key={index}>{items}</ul>;
        }
        if (block.type === "table") return (
          <div key={index} className="overflow-x-auto my-8" tabIndex={0} role="region" aria-label={`Таблица: ${block.headers.join(", ")}`}>
            <table>
              <thead><tr>{block.headers.map((header, column) => <th scope="col" key={column}><Inline text={header} /></th>)}</tr></thead>
              <tbody>{block.rows.map((row, rowIndex) => (
                <tr key={rowIndex}>{row.map((cell, column) => column === 0
                  ? <th scope="row" key={column}><Inline text={cell} /></th>
                  : <td key={column}><Inline text={cell} /></td>)}</tr>
              ))}</tbody>
            </table>
          </div>
        );
        return <p key={index}><Inline text={block.text} /></p>;
      })}
    </div>
  );
}
