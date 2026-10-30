import type { FaqItem } from "@/lib/data";

export default function FaqDetails({ items }: { items: FaqItem[] }) {
  return <div className="space-y-4">{items.map((item) => (
    <details key={item.question} className="premium-card px-6 group">
      <summary className="cursor-pointer py-5 font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
        {item.question}
      </summary>
      <p className="text-muted-foreground pb-5 leading-relaxed">{item.answer}</p>
    </details>
  ))}</div>;
}
