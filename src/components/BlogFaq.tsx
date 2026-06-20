import type { BlogFaqItem } from "@/lib/data";

export default function BlogFaq({ items }: { items: BlogFaqItem[] }) {
  if (items.length === 0) return null;
  return (
    <section className="mt-12" aria-labelledby="article-faq">
      <h2 id="article-faq" className="text-2xl font-bold mb-5">Частые вопросы</h2>
      <div className="space-y-3">
        {items.map((item) => (
          <details key={item.question} className="rounded-xl border border-border p-5">
            <summary className="cursor-pointer font-semibold">{item.question}</summary>
            <p className="mt-3 text-muted-foreground leading-relaxed">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
