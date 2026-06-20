import type { MetadataRoute } from "next";
import { execFileSync } from "node:child_process";
import { statSync, existsSync } from "node:fs";
import path from "node:path";
import { kitchenStyles, cities, blogPosts, getBlogMetadata } from "@/lib/data";

const BASE_URL = "https://kuhnitver.ru";

// Дата последнего РЕАЛЬНОГО изменения контента = последний git-коммит,
// затронувший файл-источник. В отличие от mtime файловой системы, git-дата
// НЕ сбрасывается при `git pull`/деплое — поэтому sitemap отдаёт честные
// lastmod, а не «сегодня для всех страниц». Кэш — чтобы не дёргать git по
// одному и тому же файлу несколько раз за сборку.
const gitDateCache = new Map<string, number>();

function gitCommitMs(relativePath: string): number {
  const cached = gitDateCache.get(relativePath);
  if (cached !== undefined) return cached;
  let ms = 0;
  try {
    const iso = execFileSync(
      "git",
      ["log", "-1", "--format=%cI", "--", relativePath],
      {
        cwd: process.cwd(),
        encoding: "utf8",
        stdio: ["ignore", "pipe", "ignore"],
        windowsHide: true,
      },
    ).trim();
    if (iso) ms = new Date(iso).getTime();
  } catch {
    ms = 0; // git недоступен или файл не в истории — уйдём в fallback
  }
  gitDateCache.set(relativePath, ms);
  return ms;
}

// Fallback: mtime указанных файлов (макс. = самое свежее изменение). Если
// файлы недоступны — now. Используется, только когда git-дату получить нельзя.
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

// Честная дата изменения страницы: максимальная git-дата по источникам,
// иначе mtime, иначе now.
function lastMod(...relativePaths: string[]): Date {
  let latest = 0;
  for (const rel of relativePaths) {
    const t = gitCommitMs(rel);
    if (t > latest) latest = t;
  }
  return latest > 0 ? new Date(latest) : mtime(...relativePaths);
}

export default function sitemap(): MetadataRoute.Sitemap {
  const dataFile = "src/lib/data.ts";
  const styleTemplate = "src/app/(main)/catalog/[style]/page.tsx";
  const cityTemplate = "src/app/(main)/kuhni/[city]/page.tsx";

  // Контент статической страницы = её page.tsx (+ data.ts там, где он реально
  // питает контент: каталог, цены, FAQ, b2b, блог-лента). layout.tsx
  // намеренно НЕ включаем: правка аналитики/мета в общем лэйауте не должна
  // «омолаживать» все URL разом — иначе lastmod снова станет датой деплоя.
  const pageLastMod = (segment: string, ...extra: string[]) =>
    lastMod(`src/app/(main)/${segment}/page.tsx`, ...extra);

  const homeLastMod = lastMod("src/app/(main)/page.tsx", dataFile);

  const mainPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: homeLastMod,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/catalog`,
      lastModified: pageLastMod("catalog", dataFile),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/price`,
      lastModified: pageLastMod("price", dataFile),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/portfolio`,
      lastModified: pageLastMod("portfolio"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: pageLastMod("about"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/contacts`,
      lastModified: pageLastMod("contacts"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/faq`,
      lastModified: pageLastMod("faq", dataFile),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/dostavka`,
      lastModified: pageLastMod("dostavka"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: pageLastMod("blog", dataFile),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/b2b`,
      lastModified: pageLastMod("b2b", dataFile),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: pageLastMod("privacy"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // Страницы стилей кухонь: контент живёт в data.ts (описания) и в общем
  // шаблоне [style]/page.tsx — берём свежайшую git-дату из этих двух.
  const stylesLastModified = lastMod(dataFile, styleTemplate);
  const stylePages: MetadataRoute.Sitemap = kitchenStyles.map((style) => ({
    url: `${BASE_URL}/catalog/${style.slug}`,
    lastModified: stylesLastModified,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  // Городские лендинги: контент в data.ts и шаблоне [city]/page.tsx.
  const citiesLastModified = lastMod(dataFile, cityTemplate);
  const cityPages: MetadataRoute.Sitemap = cities.map((city) => ({
    url: `${BASE_URL}/kuhni/${city.slug}`,
    lastModified: citiesLastModified,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  // Блог-посты: дата последнего изменения статьи (modifiedDate из метаданных
  // поста) — задаётся редакционно и не зависит от деплоя.
  const blogPages: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(getBlogMetadata(post).modifiedDate),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...mainPages, ...stylePages, ...cityPages, ...blogPages];
}
