import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import { getPortfolioCase, getPublishedPortfolioCases } from "@/lib/portfolio";
import { SITE_CONFIG, generateWebPageSchema } from "@/lib/seo";

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return getPublishedPortfolioCases().map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getPortfolioCase(slug);
  if (!project) return {};
  const url = `${SITE_CONFIG.url}/portfolio/${project.slug}`;
  return {
    title: `${project.title} | Kuhnitver`,
    description: `${project.city}. ${project.task} Материалы, состав стоимости на ${project.cost.calculatedAt} и фактические сроки выполненной кухни.`,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: project.title,
      description: project.task,
      url,
      publishedTime: project.publishedAt,
      modifiedTime: project.updatedAt,
      images: project.photos.map((photo) => ({ url: `${SITE_CONFIG.url}${photo.src}`, width: photo.width, height: photo.height, alt: photo.alt })),
    },
  };
}

function dateLabel(value: string) {
  return new Date(value).toLocaleDateString("ru-RU", { timeZone: "UTC" });
}

export default async function PortfolioCasePage({ params }: Props) {
  const { slug } = await params;
  const project = getPortfolioCase(slug);
  if (!project) notFound();
  const url = `${SITE_CONFIG.url}/portfolio/${project.slug}`;
  const schema = {
    ...generateWebPageSchema(project.title, project.task, url),
    datePublished: project.publishedAt,
    dateModified: project.updatedAt,
    mainEntity: {
      "@type": "CreativeWork",
      name: project.title,
      description: project.task,
      url,
      creator: { "@id": `${SITE_CONFIG.url}/#organization` },
      dateCreated: project.timing.completedAt,
      image: project.photos.map((photo) => `${SITE_CONFIG.url}${photo.src}`),
    },
  };

  return (
    <article className="min-h-screen pt-24">
      <JsonLd data={schema} />
      <div className="container-custom pb-16">
        <Breadcrumbs items={[{ name: "Идеи кухонь и проекты", url: `${SITE_CONFIG.url}/portfolio` }, { name: project.title, url }]} className="mb-8" />
        <header className="max-w-3xl mb-10">
          <p className="text-sm font-medium text-primary mb-3">Выполненный проект · {project.city}</p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">{project.title}</h1>
          <p className="text-lg text-muted-foreground mb-4">{project.task}</p>
          <p className="text-sm text-muted-foreground">Описание: {project.author}. Опубликовано <time dateTime={project.publishedAt}>{dateLabel(project.publishedAt)}</time>, обновлено <time dateTime={project.updatedAt}>{dateLabel(project.updatedAt)}</time>.</p>
        </header>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {project.photos.map((photo, index) => (
            <figure key={photo.src} className="premium-card overflow-hidden">
              <Image src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} className="w-full h-auto" priority={index === 0} sizes="(max-width: 768px) 100vw, 50vw" />
              <figcaption className="px-4 py-3 text-sm text-muted-foreground">{photo.alt}</figcaption>
            </figure>
          ))}
        </div>

        <div className="max-w-3xl space-y-10">
          <section>
            <h2 className="text-2xl font-bold mb-4">Размеры и ограничения</h2>
            <p className="text-muted-foreground mb-4">{project.dimensions}</p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">{project.constraints.map((item) => <li key={item}>{item}</li>)}</ul>
          </section>
          <section>
            <h2 className="text-2xl font-bold mb-4">Предложенное решение</h2>
            <p className="text-muted-foreground">{project.solution}</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold mb-4">Материалы и фурнитура</h2>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">{[...project.materials, ...project.hardware].map((item) => <li key={item}>{item}</li>)}</ul>
          </section>
          <section className="premium-card p-6">
            <h2 className="text-2xl font-bold mb-4">Стоимость этого проекта</h2>
            <p className="text-3xl font-bold text-primary mb-2">{project.cost.totalRub.toLocaleString("ru-RU")} ₽</p>
            <p className="text-sm text-muted-foreground mb-6">Расчёт на <time dateTime={project.cost.calculatedAt}>{dateLabel(project.cost.calculatedAt)}</time>. Сумма относится к указанной комплектации выполненного проекта.</p>
            <h3 className="font-semibold mb-3">Что вошло в стоимость</h3>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-6">{project.cost.includes.map((item) => <li key={item}>{item}</li>)}</ul>
            <h3 className="font-semibold mb-3">Что оплачивалось отдельно</h3>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-6">{project.cost.excludes.map((item) => <li key={item}>{item}</li>)}</ul>
            <p className="text-sm text-muted-foreground">Изменение размеров, материалов и наполнения меняет смету. <Link href="/price" className="text-primary hover:underline">Как получить индивидуальный расчёт</Link>.</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold mb-4">Фактические сроки</h2>
            <p className="text-muted-foreground mb-3">{project.timing.description}</p>
            <p className="text-muted-foreground">Проект завершён <time dateTime={project.timing.completedAt}>{dateLabel(project.timing.completedAt)}</time>.</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold mb-4">Выводы по проекту</h2>
            <p className="text-muted-foreground mb-6">{project.conclusion}</p>
            <div className="flex flex-wrap gap-4">
              <a href={`tel:${SITE_CONFIG.phoneClean}`} className="text-primary font-medium hover:underline">Обсудить похожую задачу: {SITE_CONFIG.phone}</a>
              <Link href="/#quiz" className="text-primary font-medium hover:underline">Получить предварительный расчёт</Link>
            </div>
          </section>
        </div>
      </div>
    </article>
  );
}
