"use client";

import { useEffect } from "react";
import { trackBlogEvent } from "@/lib/analytics";

export default function BlogAnalytics({ slug, title }: { slug: string; title: string }) {
  useEffect(() => {
    const sent = new Set<number>();
    const payload = { article_slug: slug, article_title: title };
    trackBlogEvent("blog_view", payload);
    const onScroll = () => {
      const height = document.documentElement.scrollHeight - window.innerHeight;
      const percent = height > 0 ? (window.scrollY / height) * 100 : 100;
      ([50, 75, 90] as const).forEach((threshold) => {
        if (percent >= threshold && !sent.has(threshold)) {
          sent.add(threshold);
          trackBlogEvent(`blog_scroll_${threshold}`, payload);
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [slug, title]);
  return null;
}
