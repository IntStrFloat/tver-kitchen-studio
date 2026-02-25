import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import { SITE_CONFIG, generateWebPageSchema } from "@/lib/seo";
import { blogPosts } from "@/lib/data";

export const metadata: Metadata = {
  title: "Блог о кухнях — статьи, советы и руководства по выбору | TverKuhni",
  description:
    "Экспертные статьи от производителя кухонь TverKuhni. Как выбрать материал для фасадов: МДФ, массив или акрил? Какая планировка кухни лучше? Сколько стоит кухня на заказ? Сравнение фурнитуры Blum и Hettich. Тренды дизайна кухонь 2025–2026. Читайте и делайте осознанный выбор.",
  keywords:
    "блог кухни, статьи о кухнях, как выбрать кухню, советы по кухне, кухня на заказ статьи, материалы для кухни, дизайн кухни тренды, планировка кухни",
  alternates: {
    canonical: `${SITE_CONFIG.url}/blog`,
  },
};

export default function BlogPage() {
  return (
    <div className="min-h-screen pt-24">
      <JsonLd
        data={generateWebPageSchema(
          "Блог о кухнях — статьи и советы",
          "Полезные статьи о выборе кухни на заказ в Твери",
          `${SITE_CONFIG.url}/blog`,
        )}
      />

      <div className="container-custom">
        <Breadcrumbs
          items={[{ name: "Блог", url: `${SITE_CONFIG.url}/blog` }]}
          className="mb-8"
        />

        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Блог о кухнях
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Полезные статьи, советы и руководства по выбору кухни на заказ
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {blogPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group premium-card overflow-hidden"
            >
              <div className="aspect-[16/10] overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  width={600}
                  height={375}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
                  <time dateTime={post.date}>
                    {new Date(post.date).toLocaleDateString("ru-RU", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </time>
                  <span>&middot;</span>
                  <span>{post.readTime}</span>
                </div>
                <h2 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                  {post.title}
                </h2>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {post.excerpt}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
