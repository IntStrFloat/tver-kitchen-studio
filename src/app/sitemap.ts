import type { MetadataRoute } from "next";
import { statSync, existsSync } from "node:fs";
import path from "node:path";
import { kitchenStyles, cities, blogPosts } from "@/lib/data";

const BASE_URL = "https://kuhnitver.ru";

// Возвращает mtime указанных файлов (берём максимальный = самое свежее
// изменение влияющих на страницу источников). Если файлы недоступны — now.
function mtime(...relativePaths: string[]): Date {
  const cwd = process.cwd();
  let latest = 0;
  for (const rel of relativePaths) {
    const abs = path.join(cwd, rel);
    if (!existsSync(abs)) continue;
    const t = statSync(abs).mtimeMs;
    if (t > latest) latest = t;
  }
  return latest > 0 ? new Date(latest) : new Date();
}

export default function sitemap(): MetadataRoute.Sitemap {
  const dataFile = "src/lib/data.ts";
  const layoutFile = "src/app/layout.tsx";

  const pageMtime = (segment: string) =>
    mtime(`src/app/(main)/${segment}/page.tsx`, dataFile, layoutFile);

  const homeMtime = mtime("src/app/(main)/page.tsx", dataFile, layoutFile);

  const mainPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: homeMtime,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/catalog`,
      lastModified: pageMtime("catalog"),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/price`,
      lastModified: pageMtime("price"),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/portfolio`,
      lastModified: pageMtime("portfolio"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: pageMtime("about"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/contacts`,
      lastModified: pageMtime("contacts"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/faq`,
      lastModified: pageMtime("faq"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/dostavka`,
      lastModified: pageMtime("dostavka"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: pageMtime("blog"),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/b2b`,
      lastModified: pageMtime("b2b"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  // Страницы стилей кухонь — mtime data.ts (там описания)
  const stylesLastModified = mtime(dataFile);
  const stylePages: MetadataRoute.Sitemap = kitchenStyles.map((style) => ({
    url: `${BASE_URL}/catalog/${style.slug}`,
    lastModified: stylesLastModified,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  // Городские лендинги — mtime data.ts
  const citiesLastModified = mtime(dataFile);
  const cityPages: MetadataRoute.Sitemap = cities.map((city) => ({
    url: `${BASE_URL}/kuhni/${city.slug}`,
    lastModified: citiesLastModified,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  // Блог-посты: используем дату публикации поста
  const blogPages: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...mainPages, ...stylePages, ...cityPages, ...blogPages];
}
