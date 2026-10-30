import type { MetadataRoute } from "next";
import { kitchenStyles, cities, blogPosts, getBlogMetadata } from "@/lib/data";
import { getPublishedPortfolioCases } from "@/lib/portfolio";
import { SITE_CONFIG } from "@/lib/seo";

// Редакционные даты: меняйте только при содержательном изменении страницы.
// Git, mtime и время сборки не определяют дату изменения материала.
const pages = [
  ["", "2026-10-30", 1], ["catalog", "2026-10-30", 0.9],
  ["price", "2026-10-30", 0.9], ["portfolio", "2026-10-30", 0.8],
  ["about", "2026-10-30", 0.7], ["contacts", "2026-10-31", 0.7],
  ["faq", "2026-10-30", 0.7], ["dostavka", "2026-10-30", 0.7],
  ["blog", "2026-10-30", 0.7], ["b2b", "2026-10-30", 0.8],
  ["privacy", "2026-10-30", 0.3],
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...pages.map(([slug, date, priority]) => ({
      url: `${SITE_CONFIG.url}${slug ? `/${slug}` : ""}`, lastModified: date, priority,
    })),
    ...kitchenStyles.map((style) => ({
      url: `${SITE_CONFIG.url}/catalog/${style.slug}`, lastModified: style.updatedAt, priority: 0.8,
    })),
    ...cities.map((city) => ({
      url: `${SITE_CONFIG.url}/kuhni/${city.slug}`, lastModified: city.updatedAt, priority: 0.8,
    })),
    ...blogPosts.map((post) => ({
      url: `${SITE_CONFIG.url}/blog/${post.slug}`, lastModified: getBlogMetadata(post).modifiedDate, priority: 0.6,
    })),
    ...getPublishedPortfolioCases().map((project) => ({
      url: `${SITE_CONFIG.url}/portfolio/${project.slug}`, lastModified: project.updatedAt, priority: 0.7,
    })),
  ];
}
