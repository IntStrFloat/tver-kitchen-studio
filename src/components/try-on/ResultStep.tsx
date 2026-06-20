"use client";

import { useState } from "react";
import { sendLead } from "@/lib/sendLead";
import { trackTryOnEvent } from "@/features/try-on/analytics";

export default function ResultStep({ beforeUrl, resultUrl, productName, productId, jobId, onRestart }: { beforeUrl: string | null; resultUrl: string; productName: string; productId: string; jobId: string | null; onRestart: () => void }) {
  const [reveal, setReveal] = useState(50);
  const [shareError, setShareError] = useState<string | null>(null);
  const [leadOpen, setLeadOpen] = useState(false);
  const [leadStatus, setLeadStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const shared = () => trackTryOnEvent("try_on_result_shared", { product_id: productId, job_status: "succeeded" });
  const share = async () => {
    setShareError(null);
    try {
      if (navigator.share) {
        await navigator.share({ title: `Примерка: ${productName}`, url: resultUrl });
        shared();
        return;
      }
      await navigator.clipboard.writeText(resultUrl);
      shared();
      setShareError("Ссылка скопирована в буфер обмена.");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setShareError("Не удалось поделиться ссылкой. Скачайте результат или скопируйте ссылку вручную.");
    }
  };
  const download = async () => {
    setShareError(null);
    try {
      const response = await fetch(resultUrl);
      if (!response.ok) throw new Error("download failed");
      const blobUrl = URL.createObjectURL(await response.blob());
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = "primerka-result";
      link.click();
      URL.revokeObjectURL(blobUrl);
    } catch {
      setShareError("Не удалось скачать результат. Попробуйте ещё раз или скопируйте ссылку вручную.");
    }
  };
  const openLead = () => {
    setLeadOpen(true);
    trackTryOnEvent("try_on_lead_opened", { product_id: productId, source: "AI-primerka" });
  };
  const submitLead = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (leadStatus === "sending" || leadStatus === "success") return;
    const form = new FormData(event.currentTarget);
    const phone = String(form.get("phone") ?? "").trim();
    const name = String(form.get("name") ?? "").trim();
    if (!phone) return;
    setLeadStatus("sending");
    try {
      await sendLead({
        phone,
        name: name || undefined,
        source: "AI-примерка",
        details: {
          "ID товара": productId,
          "ID примерки": jobId ?? "",
          "Страница": window.location.href,
        },
      });
      trackTryOnEvent("try_on_lead_submitted", { product_id: productId, source: "AI-primerka" });
      setLeadStatus("success");
    } catch {
      trackTryOnEvent("try_on_lead_failed", { product_id: productId, source: "AI-primerka" });
      setLeadStatus("error");
    }
  };

  return <section className="mx-auto w-full max-w-3xl px-4 py-8"><h1 className="text-3xl font-bold">Результат примерки</h1><p className="mt-2 text-muted-foreground">{productName}</p><div className="relative mt-6 aspect-video overflow-hidden rounded-xl bg-secondary">{beforeUrl && <img src={beforeUrl} alt="Фото комнаты до примерки" className="absolute inset-0 h-full w-full object-cover" />}<img src={resultUrl} alt="Результат примерки мебели в комнате" className="absolute inset-0 h-full w-full object-cover" style={beforeUrl ? { clipPath: `inset(0 ${100 - reveal}% 0 0)` } : undefined} /></div>{beforeUrl && <label className="mt-4 block text-sm font-medium">Показать результат: {reveal}%<input className="mt-2 min-h-11 w-full" aria-label="Степень показа результата" type="range" min="0" max="100" value={reveal} onChange={(e) => setReveal(Number(e.target.value))} /></label>}{shareError && <p className="mt-4 text-sm" role="status" aria-live="polite">{shareError}</p>}<div className="mt-6 flex flex-wrap gap-3"><button className="min-h-11 rounded-lg border px-4" onClick={onRestart}>Начать заново</button><button className="min-h-11 rounded-lg border px-4" onClick={() => void download()}>Скачать</button><button className="min-h-11 rounded-lg bg-primary px-4 text-primary-foreground" onClick={() => void share()}>Поделиться</button></div><div className="mt-8 rounded-xl border p-5"><h2 className="text-xl font-semibold">Хотите расчёт этого варианта?</h2>{!leadOpen ? <button className="mt-4 min-h-11 rounded-lg bg-primary px-4 text-primary-foreground" type="button" onClick={openLead}>Получить расчёт этого варианта</button> : <form className="mt-4 grid gap-3" onSubmit={(event) => void submitLead(event)}><label className="text-sm font-medium">Телефон<input className="mt-1 min-h-11 w-full rounded border p-2" name="phone" type="tel" required autoComplete="tel" /></label><label className="text-sm font-medium">Имя (необязательно)<input className="mt-1 min-h-11 w-full rounded border p-2" name="name" type="text" autoComplete="name" /></label><p className="text-sm text-muted-foreground">Отправляя форму, вы соглашаетесь с <a className="underline" href="/privacy">политикой конфиденциальности</a>.</p><button className="min-h-11 rounded-lg bg-primary px-4 text-primary-foreground disabled:opacity-50" disabled={leadStatus === "sending"} type="submit">{leadStatus === "sending" ? "Отправляем..." : "Получить расчёт"}</button>{leadStatus === "success" && <p className="text-sm" role="status">Спасибо! Мы свяжемся с вами для расчёта.</p>}{leadStatus === "error" && <p className="text-sm text-destructive" role="alert">Не удалось отправить заявку. Попробуйте ещё раз или позвоните нам.</p>}</form>}</div></section>;
}
