"use client";

import { useState } from "react";
import { FileText, X } from "lucide-react";
import { getPhoneError, sendLead } from "@/lib/sendLead";
import { GOALS, trackGoal } from "@/lib/analytics";
import { useLeadDialog } from "@/hooks/use-lead-dialog";

type Status = "idle" | "sending" | "success" | "error";
const fields = [
  { name: "organization", label: "Организация", type: "text", autoComplete: "organization", required: true },
  { name: "name", label: "Контактное лицо", type: "text", autoComplete: "name", required: true },
  { name: "phone", label: "Телефон", type: "tel", autoComplete: "tel", required: true },
  { name: "email", label: "Email", type: "email", autoComplete: "email", required: true },
  { name: "city", label: "Город / адрес объекта", type: "text", autoComplete: "address-level2", required: false },
  { name: "deadline", label: "Желаемый срок поставки", type: "text", autoComplete: "off", required: false },
] as const;

export default function B2BRequestModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({ organization: "", name: "", phone: "", email: "", city: "", deadline: "", comment: "" });
  const close = () => { if (status !== "sending") setIsOpen(false); };
  const dialogRef = useLeadDialog(isOpen, close);
  const update = (key: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((current) => ({ ...current, [key]: event.target.value }));
    setErrors((current) => ({ ...current, [key]: "" }));
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (status === "sending") return;
    const phoneError = getPhoneError(form.phone);
    if (phoneError) { setErrors((current) => ({ ...current, phone: phoneError })); return; }
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
      trackGoal(GOALS.b2bLead);
      setStatus("success");
    } catch { setStatus("error"); }
  };

  return <>
    <button type="button" onClick={() => { setStatus("idle"); setErrors({}); setIsOpen(true); }} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-medium text-primary-foreground hover:opacity-90 transition-opacity">
      <FileText className="h-4 w-4" aria-hidden="true" />Отправить ТЗ на расчёт
    </button>
    {isOpen && <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-foreground/50 backdrop-blur-sm" onClick={close} />
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby="b2b-form-title" tabIndex={-1} className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-card p-6 shadow-elevated md:p-8">
        <button type="button" onClick={close} disabled={status === "sending"} className="absolute right-4 top-4 rounded-full p-2 hover:bg-muted" aria-label="Закрыть"><X className="h-5 w-5" /></button>
        {status === "success" ? <div className="py-12 text-center"><h2 id="b2b-form-title" className="text-2xl font-bold">Запрос отправлен</h2><p role="status" className="mt-3 text-muted-foreground">Подготовим ответ по вашему ТЗ и свяжемся с вами.</p></div> : <>
          <h2 id="b2b-form-title" className="text-2xl font-bold">Отправить ТЗ на расчёт</h2>
          <p className="mt-2 text-sm text-muted-foreground">Опишите объект и задачу. Файл ТЗ можно отправить ответным письмом после связи с менеджером.</p>
          <form method="post" onSubmit={submit} aria-busy={status === "sending"} className="mt-6 grid gap-4 sm:grid-cols-2">
            {fields.map((field, index) => <div key={field.name}>
              <label htmlFor={`b2b-${field.name}`} className="text-sm font-medium">{field.label}</label>
              <input id={`b2b-${field.name}`} name={field.name} type={field.type} autoComplete={field.autoComplete} required={field.required} maxLength={field.type === "tel" ? 30 : 200} data-dialog-initial-focus={index === 0 ? "" : undefined} value={form[field.name]} onChange={update(field.name)} onInvalid={(event) => { const message = event.currentTarget.validationMessage; setErrors((current) => ({ ...current, [field.name]: message })); }} aria-invalid={Boolean(errors[field.name])} aria-describedby={errors[field.name] ? `b2b-${field.name}-error` : undefined} className="premium-input mt-1" />
              {errors[field.name] && <p id={`b2b-${field.name}-error`} role="alert" className="mt-1 text-sm text-destructive">{errors[field.name]}</p>}
            </div>)}
            <div className="sm:col-span-2"><label htmlFor="b2b-comment" className="text-sm font-medium">Комментарий</label><textarea id="b2b-comment" name="comment" maxLength={5000} value={form.comment} onChange={update("comment")} className="premium-input mt-1 min-h-28" /></div>
            {status === "error" && <p role="alert" className="sm:col-span-2 text-sm text-destructive">Не удалось отправить запрос. Данные сохранены: попробуйте ещё раз или позвоните нам.</p>}
            <div className="sm:col-span-2"><button type="submit" disabled={status === "sending"} className="min-h-11 w-full rounded-xl bg-primary px-5 font-semibold text-primary-foreground disabled:opacity-50">{status === "sending" ? "Отправляем…" : "Отправить запрос"}</button><p role="status" className="sr-only">{status === "sending" ? "Запрос отправляется, дождитесь подтверждения." : ""}</p><p className="mt-3 text-center text-xs text-muted-foreground">Отправляя форму, вы соглашаетесь с <a className="underline" href="/privacy" target="_blank" rel="noreferrer">политикой конфиденциальности</a>.</p></div>
          </form>
        </>}
      </div>
    </div>}
  </>;
}
