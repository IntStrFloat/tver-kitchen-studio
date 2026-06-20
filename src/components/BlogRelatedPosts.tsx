"use client";

import Link from "next/link";
import type { BlogPost } from "@/lib/data";
import { trackBlogEvent } from "@/lib/analytics";

export default function BlogRelatedPosts({ current, posts }: { current: BlogPost; posts: BlogPost[] }) {
  if (posts.length === 0) return null;
  return <section className="mb-16"><h2 className="text-2xl font-bold mb-8 text-center">Читайте также</h2><div className="grid md:grid-cols-3 gap-6">{posts.map((post) => <Link key={post.slug} href={`/blog/${post.slug}`} onClick={() => trackBlogEvent("blog_related_click", { article_slug: current.slug, article_title: current.title })} className="premium-card p-5"><h3 className="font-semibold">{post.title}</h3><p className="mt-2 text-sm text-muted-foreground">{post.excerpt}</p></Link>)}</div></section>;
}
