"use client";

import { useRef, useState } from "react";
import { validateImageMetadata } from "@/features/try-on/image-validation";

function imageError(code: "type" | "size" | "empty") { return ({ type: "Выберите фото в формате JPEG или WebP.", size: "Размер фото не должен превышать 12 МБ.", empty: "Файл фотографии пуст." })[code]; }

export default function PhotoStep({ productName, previewUrl, onPhoto, onBack, onPhotoOpen }: { productName: string; previewUrl: string | null; onPhoto: (file: File) => void; onBack: () => void; onPhotoOpen: () => void }) {
  const input = useRef<HTMLInputElement>(null); const [error, setError] = useState<string | null>(null); const [consent, setConsent] = useState(false); const [file, setFile] = useState<File | null>(null);
  const choose = (selected?: File) => { if (!selected) return; const valid = validateImageMetadata(selected); if (!valid.ok) { setFile(null); if (input.current) input.current.value = ""; setError(imageError(valid.code)); return; } setError(null); setFile(selected); };
  return <section className="mx-auto w-full max-w-2xl px-4 py-8">
    <p className="text-sm font-medium text-primary">Шаг 2 из 3</p><h1 className="mt-2 text-3xl font-bold">Фото комнаты</h1><p className="mt-3 text-muted-foreground">Модель: <strong>{productName}</strong></p>
    <label className="mt-6 block text-sm font-medium" htmlFor="try-on-photo">Загрузите фото комнаты</label>
    <input ref={input} id="try-on-photo" className="mt-2 block min-h-11 w-full rounded border p-2" type="file" accept="image/jpeg,image/webp" capture="environment" onClick={onPhotoOpen} onChange={(event) => choose(event.target.files?.[0])} />
    {error && <p className="mt-3 text-sm text-destructive" role="alert">{error}</p>}
    {previewUrl && <img className="mt-5 max-h-80 w-full rounded-xl object-contain" src={previewUrl} alt="Предпросмотр загруженной комнаты" />}
    <label className="mt-5 flex min-h-11 items-start gap-3 text-sm"><input className="mt-1 h-5 w-5" type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} /> <span>Я согласен на обработку фото только для выполнения этой примерки.</span></label>
    <div className="mt-6 flex flex-wrap gap-3"><button className="min-h-11 rounded-lg border px-4 focus-visible:ring-2 focus-visible:ring-primary" type="button" onClick={onBack}>Назад</button><button className="min-h-11 rounded-lg border px-4 focus-visible:ring-2 focus-visible:ring-primary" type="button" onClick={() => input.current?.click()}>Выбрать другое фото</button><button disabled={!file || !consent} className="min-h-11 rounded-lg bg-primary px-4 text-primary-foreground disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-primary" type="button" onClick={() => file && onPhoto(file)}>Далее: область размещения</button></div>
  </section>;
}
