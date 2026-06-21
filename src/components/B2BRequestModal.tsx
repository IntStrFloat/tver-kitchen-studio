"use client";

import { useState } from "react";
import { FileText, X } from "lucide-react";
import { sendLead } from "@/lib/sendLead";

type Status = "idle" | "sending" | "success" | "error";

export default function B2BRequestModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [form, setForm] = useState({ organization: "", name: "", phone: "", email: "", city: "", deadline: "", comment: "" });

  const update = (key: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((current) => ({ ...current, [key]: event.target.value }));

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (status !== "idle") return;
    setStatus("sending");
    try {
      await sendLead({
        phone: form.phone,
        name: form.name,
        source: "B2B — ТЗ на расчёт",
        details: {
          Организация: form.organization,
          Email: form.email,
          "Город / объект": form.city,
          "Срок поставки": form.deadline,
          Комментарий: form.comment,
        },
      });
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  return <>
    <button type="button" onClick={() => { setStatus("idle"); setIsOpen(true); }} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-medium text-primary-foreground hover:opacity-90 transition-opacity">
      <FileText className="h-4 w-4" aria-hidden="true" />
      Отправить ТЗ на расчёт
    </button>
    {isOpen && <div className="fixed inset-0 z-[110] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="b2b-form-title">
      <button className="absolute inset-0 bg-foreground/50 backdrop-blur-sm" aria-label="Закрыть форму" onClick={() => setIsOpen(false)} />
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-card p-6 shadow-elevated md:p-8">
        <button type="button" onClick={() => setIsOpen(false)} className="absolute right-4 top-4 rounded-full p-2 hover:bg-muted" aria-label="Закрыть"><X className="h-5 w-5" /></button>
        {status === "success" ? <div className="py-12 text-center"><h2 id="b2b-form-title" className="text-2xl font-bold">Запрос отправлен</h2><p className="mt-3 text-muted-foreground">Подготовим ответ по вашему ТЗ и свяжемся с вами.</p></div> : <>
          <h2 id="b2b-form-title" className="text-2xl font-bold">Отправить ТЗ на расчёт</h2>
          <p className="mt-2 text-sm text-muted-foreground">Опишите объект и задачу. Файл ТЗ пока можно отправить ответным письмом после связи с менеджером.</p>
          <form onSubmit={submit} className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-medium">Организация<input required value={form.organization} onChange={update("organization")} className="premium-input mt-1" /></label>
            <label className="text-sm font-medium">Контактное лицо<input required value={form.name} onChange={update("name")} className="premium-input mt-1" /></label>
            <label className="text-sm font-medium">Телефон<input required type="tel" value={form.phone} onChange={update("phone")} className="premium-input mt-1" /></label>
            <label className="text-sm font-medium">Email<input required type="email" value={form.email} onChange={update("email")} className="premium-input mt-1" /></label>
            <label className="text-sm font-medium">Город / адрес объекта<input value={form.city} onChange={update("city")} className="premium-input mt-1" /></label>
            <label className="text-sm font-medium">Желаемый срок поставки<input value={form.deadline} onChange={update("deadline")} className="premium-input mt-1" /></label>
            <label className="text-sm font-medium sm:col-span-2">Комментарий<textarea value={form.comment} onChange={update("comment")} className="premium-input mt-1 min-h-28" /></label>
            {status === "error" && <p role="alert" className="sm:col-span-2 text-sm text-destructive">Не удалось отправить запрос. Позвоните нам или попробуйте ещё раз.</p>}
            <div className="sm:col-span-2"><button disabled={status === "sending"} className="min-h-11 w-full rounded-xl bg-primary px-5 font-semibold text-primary-foreground disabled:opacity-50">{status === "sending" ? "Отправляем..." : "Отправить запрос"}</button><p className="mt-3 text-center text-xs text-muted-foreground">Отправляя форму, вы соглашаетесь с <a className="underline" href="/privacy" target="_blank" rel="noreferrer">политикой конфиденциальности</a>.</p></div>
          </form>
        </>}
      </div>
    </div>}
  </>;
}
