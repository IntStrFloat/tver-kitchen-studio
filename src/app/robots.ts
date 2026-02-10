import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/", "/private/"],
      },
      {
        userAgent: "Yandex",
        allow: "/",
        crawlDelay: 1,
      },
    ],
    sitemap: "https://tverkuhni.ru/sitemap.xml",
    host: "https://tverkuhni.ru",
  };
}
