"use client";

import { useEffect, useRef, useState } from "react";
import { getPhoneError, sendLead } from "@/lib/sendLead";
import { SITE_CONFIG } from "@/lib/seo";
import { getAcquisitionSource, trackBlogEvent } from "@/lib/analytics";
import type { BlogCta } from "@/lib/data";

export default function BlogLeadForm({ slug, title, placement, cta }: { slug: string; title: string; placement: "inline" | "bottom"; cta: BlogCta }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState<string>();
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [isHydrated, setIsHydrated] = useState(false);
  useEffect(() => { setIsHydrated(true); }, []);
  const started = useRef(false);
  const formId = `blog-${placement}-${slug}`;
  const trackStart = () => {
    if (!started.current) {
      started.current = true;
      trackBlogEvent("blog_form_start", { article_slug: slug, article_title: title, cta_placement: placement });
    }
  };
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!isHydrated || status === "sending") return;
    const error = getPhoneError(phone);
    setPhoneError(error);
    if (error) return;
    setStatus("sending");
    trackBlogEvent("blog_cta_click", { article_slug: slug, article_title: title, cta_placement: placement, cta_context: cta.context });
    try {
      await sendLead({
        name, phone, source: `Блог: ${slug}`,
        details: {
          Статья: title,
          "URL статьи": `${window.location.origin}${window.location.pathname}`,
          "Место CTA": placement,
          "Контекст CTA": cta.context,
          "Источник перехода": getAcquisitionSource(document.referrer, window.location.search),
        },
      });
      trackBlogEvent("blog_lead", { article_slug: slug, article_title: title, cta_placement: placement, cta_context: cta.context });
      setStatus("success");
    } catch { setStatus("error"); }
  };
  if (status === "success") return <section className="mt-10 p-6 rounded-2xl bg-primary/5 text-center"><h2 className="text-xl font-bold">Спасибо, заявка отправлена</h2><p role="status" className="text-muted-foreground mt-2">Мы свяжемся с вами для уточнения комплектации.</p></section>;
  return <section className="mt-10 p-6 rounded-2xl bg-primary/5" aria-labelledby={`${formId}-title`}>
    <h2 id={`${formId}-title`} className="text-xl font-bold">{cta.title}</h2>
    <p className="text-muted-foreground mt-2">{cta.description}</p>
    <form method="post" onSubmit={submit} aria-busy={status === "sending"} className="mt-4">
      <fieldset disabled={!isHydrated || status === "sending"} className="grid gap-3 sm:grid-cols-2">
      <legend className="sr-only">Контакты для предварительного расчёта</legend>
      <div><label htmlFor={`${formId}-name`} className="mb-1 block text-sm font-medium">Ваше имя</label><input id={`${formId}-name`} name="name" type="text" autoComplete="name" required maxLength={120} value={name} onFocus={trackStart} onChange={(event) => setName(event.target.value)} className="premium-input" /></div>
      <div><label htmlFor={`${formId}-phone`} className="mb-1 block text-sm font-medium">Телефон</label><input id={`${formId}-phone`} name="phone" type="tel" autoComplete="tel" inputMode="tel" required maxLength={30} value={phone} onFocus={trackStart} onChange={(event) => { setPhone(event.target.value); setPhoneError(undefined); }} onInvalid={() => setPhoneError("Укажите телефон для связи.")} aria-invalid={Boolean(phoneError)} aria-describedby={phoneError ? `${formId}-phone-error` : undefined} placeholder="+7 (___) ___-__-__" className="premium-input" />{phoneError && <p id={`${formId}-phone-error`} role="alert" className="mt-1 text-sm text-destructive">{phoneError}</p>}</div>
      <button type="submit" disabled={!isHydrated || status === "sending"} className="sm:col-span-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium">{status === "sending" ? "Отправляем…" : cta.buttonLabel}</button>
      <p role="status" className="sr-only">{status === "sending" ? "Заявка отправляется, дождитесь подтверждения." : ""}</p>
      </fieldset>
    </form>
    <noscript><p className="mt-3 text-sm">Для предварительного расчёта позвоните: <a className="underline" href={`tel:${SITE_CONFIG.phoneClean}`}>{SITE_CONFIG.phone}</a>.</p></noscript>
    {status === "error" && <p role="alert" className="mt-3 text-sm text-destructive">Не удалось отправить заявку. Попробуйте ещё раз или позвоните: <a className="underline" href={`tel:${SITE_CONFIG.phoneClean}`}>{SITE_CONFIG.phone}</a></p>}
    <p className="mt-3 text-xs text-muted-foreground">Отправляя форму, вы соглашаетесь с <a className="underline" href="/privacy">политикой конфиденциальности</a>.</p>
  </section>;
}
