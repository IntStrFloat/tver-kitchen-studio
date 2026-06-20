import { SITE_CONFIG } from "@/lib/seo";
import { blogPosts } from "@/lib/data";

// RSS-фид блога для раздела «Свежее и актуальное» Вебмастера Яндекса.
// Формат — RSS 2.0 с обязательными namespace yandex/media; у item обязательны
// title, link, pubDate (RFC-822) и yandex:full-text. Яндекс считает «свежими»
// материалы за последние 8 дней — поэтому ценность фида в регулярных публикациях.
// Доступен по адресу https://kuhnitver.ru/blog.rss
export const dynamic = "force-static";

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// "YYYY-MM-DD" -> RFC-822 во временной зоне Твери (+0300), время фиксируем 09:00.
function rfc822(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const dow = DAYS[new Date(Date.UTC(y, m - 1, d, 12)).getUTCDay()];
  const day = String(d).padStart(2, "0");
  return `${dow}, ${day} ${MONTHS[m - 1]} ${y} 09:00:00 +0300`;
}

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// Текст статьи для yandex:full-text: убираем markdown-заголовки (## ...),
// оставляя их текст и абзацы.
function plainText(content: string): string {
  return content.replace(/^#{1,6}\s+/gm, "").trim();
}

export async function GET(): Promise<Response> {
  const base = SITE_CONFIG.url;

  // Новые статьи сверху; берём до 30 последних (фид не должен быть пустым,
  // «свежесть» Яндекс определяет по pubDate на своей стороне).
  const posts = [...blogPosts]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 30);

  const items = posts.map((p) =>
    [
      `    <item>`,
      `      <title>${esc(p.title)}</title>`,
      `      <link>${base}/blog/${p.slug}</link>`,
      `      <pubDate>${rfc822(p.date)}</pubDate>`,
      `      <author>${esc(SITE_CONFIG.name)}</author>`,
      `      <category>Кухни на заказ</category>`,
      `      <description>${esc(p.excerpt)}</description>`,
      `      <yandex:genre>article</yandex:genre>`,
      `      <yandex:full-text>${esc(plainText(p.content))}</yandex:full-text>`,
      `    </item>`,
    ].join("\n"),
  );

  const xml = `<?xml version="1.0" encoding="utf-8"?>
<rss xmlns:yandex="http://news.yandex.ru" xmlns:media="http://search.yahoo.com/mrss/" version="2.0">
  <channel>
    <title>Блог Kuhnitver — кухни на заказ в Твери</title>
    <link>${base}</link>
    <description>Статьи и руководства о выборе, материалах и дизайне кухонь на заказ в Твери</description>
    <language>ru</language>
${items.join("\n")}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
