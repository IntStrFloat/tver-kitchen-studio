"use client";

import { useRef, useState } from "react";
import { sendLead } from "@/lib/sendLead";
import { SITE_CONFIG } from "@/lib/seo";
import { trackBlogEvent } from "@/lib/analytics";
import type { BlogCta } from "@/lib/data";

export default function BlogLeadForm({ slug, title, placement, cta }: { slug: string; title: string; placement: "inline" | "bottom"; cta: BlogCta }) {
  const [name, setName] = useState(""); const [phone, setPhone] = useState(""); const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const started = useRef(false);
  const trackStart = () => { if (!started.current) { started.current = true; trackBlogEvent("blog_form_start", { article_slug: slug, article_title: title, cta_placement: placement }); } };
  const submit = async (event: React.FormEvent) => { event.preventDefault(); setStatus("sending"); trackBlogEvent("blog_cta_click", { article_slug: slug, article_title: title, cta_placement: placement, cta_context: cta.context }); const p = new URLSearchParams(window.location.search); try { await sendLead({ name, phone, source: `Блог: ${slug}`, details: { "Статья": title, "URL статьи": window.location.href, "Место CTA": placement, "Контекст CTA": cta.context, "UTM source": p.get("utm_source") ?? "", "UTM medium": p.get("utm_medium") ?? "", "UTM campaign": p.get("utm_campaign") ?? "" } }); trackBlogEvent("blog_lead", { article_slug: slug, article_title: title, cta_placement: placement, cta_context: cta.context }); setStatus("success"); } catch { setStatus("error"); } };
  if (status === "success") return <section className="mt-10 p-6 rounded-2xl bg-primary/5 text-center"><h2 className="text-xl font-bold">Спасибо, заявка отправлена</h2><p className="text-muted-foreground mt-2">Мы свяжемся с вами в ближайшее время.</p></section>;
  return <section className="mt-10 p-6 rounded-2xl bg-primary/5"><h2 className="text-xl font-bold">{cta.title}</h2><p className="text-muted-foreground mt-2">{cta.description}</p><form onSubmit={submit} className="mt-4 grid gap-3 sm:grid-cols-2"><input required value={name} onFocus={trackStart} onChange={(e) => setName(e.target.value)} placeholder="Ваше имя" className="premium-input" /><input required type="tel" value={phone} onFocus={trackStart} onChange={(e) => setPhone(e.target.value)} placeholder="+7 (___) ___-__-__" className="premium-input" /><button disabled={status === "sending"} className="sm:col-span-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium">{status === "sending" ? "Отправляем..." : cta.buttonLabel}</button></form>{status === "error" && <p className="mt-3 text-sm text-destructive">Не удалось отправить заявку. Позвоните нам: <a className="underline" href={`tel:${SITE_CONFIG.phoneClean}`}>{SITE_CONFIG.phone}</a></p>}<p className="mt-3 text-xs text-muted-foreground">Отправляя форму, вы соглашаетесь с <a className="underline" href="/privacy">политикой конфиденциальности</a>.</p></section>;
}
