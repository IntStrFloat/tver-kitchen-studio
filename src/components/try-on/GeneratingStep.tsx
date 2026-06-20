"use client";

export default function GeneratingStep({ error, canRetry, onRetry, onBack }: { error: string | null; canRetry: boolean; onRetry: () => void; onBack: () => void }) {
  return <section className="mx-auto w-full max-w-xl px-4 py-16 text-center" aria-live="polite"><h1 className="text-3xl font-bold">Готовим примерку</h1>{error ? <><p className="mt-4 text-destructive">{error}</p><div className="mt-6 flex justify-center gap-3"><button className="min-h-11 rounded-lg border px-4" onClick={onBack}>Назад</button>{canRetry ? <button className="min-h-11 rounded-lg bg-primary px-4 text-primary-foreground" onClick={onRetry}>Повторить</button> : <button className="min-h-11 rounded-lg bg-primary px-4 text-primary-foreground" onClick={onBack}>Загрузить фото заново</button>}</div></> : <p className="mt-4 text-muted-foreground">Обрабатываем фото. Это может занять некоторое время.</p>}</section>;
}
