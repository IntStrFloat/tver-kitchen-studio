import JsonLd from "@/components/seo/JsonLd";
import FaqDetails from "@/components/FaqDetails";
import { generateFAQSchema } from "@/lib/seo";
import { homepageFaqData } from "@/lib/data";

export default function FAQSection() {
  return <section id="faq" className="section-padding">
    <div className="container-custom">
      <JsonLd data={generateFAQSchema(homepageFaqData)} />
      <div className="text-center mb-12">
        <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">Вопросы и ответы</span>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Часто задаваемые вопросы</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Ответы на популярные вопросы о заказе кухонь в Kuhnitver</p>
      </div>
      <div className="max-w-3xl mx-auto">
        <FaqDetails items={homepageFaqData} />
        <div className="text-center mt-8"><a href="/faq" className="text-primary font-medium hover:underline">Все вопросы и ответы →</a></div>
      </div>
    </div>
  </section>;
}
