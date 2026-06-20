"use client";

import { useState } from "react";
import { TRY_ON_GROUPS, TRY_ON_PRODUCTS, type TryOnGroupId } from "@/features/try-on/catalog";

export default function ProductStep({ onSelect, onGroupSelect }: { onSelect: (productId: string) => void; onGroupSelect: (groupId: TryOnGroupId) => void }) {
  const [groupId, setGroupId] = useState<TryOnGroupId>(TRY_ON_GROUPS[0].id);
  const products = TRY_ON_PRODUCTS.filter((product) => product.groupId === groupId);
  return <section className="mx-auto w-full max-w-3xl px-4 py-8">
    <p className="text-sm font-medium text-primary">Шаг 1 из 3</p>
    <h1 className="mt-2 text-3xl font-bold">Выберите мебель</h1>
    <p className="mt-3 text-muted-foreground">Сначала выберите категорию, затем модель для примерки.</p>
    <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4" role="group" aria-label="Категории мебели">
      {TRY_ON_GROUPS.map((group) => <button key={group.id} type="button" onClick={() => { setGroupId(group.id); onGroupSelect(group.id); }} aria-pressed={groupId === group.id} className={`min-h-11 rounded-lg border px-3 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${groupId === group.id ? "border-primary bg-primary text-primary-foreground" : "bg-background hover:bg-secondary"}`}>{group.label}</button>)}
    </div>
    {products.length === 0 ? <div className="mt-8 rounded-xl border bg-secondary/30 p-6" role="status"><h2 className="text-lg font-semibold">Примеры мебели готовятся</h2><p className="mt-2 text-sm text-muted-foreground">Мы добавим реальные модели и ракурсы после подготовки материалов. Сейчас выбрать мебель для примерки нельзя.</p></div> : <div className="mt-8 grid gap-4 sm:grid-cols-2">{products.map((product) => <button key={product.id} type="button" onClick={() => onSelect(product.id)} className="min-h-11 rounded-xl border p-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary hover:bg-secondary"><strong>{product.name}</strong><span className="mt-2 block text-sm text-muted-foreground">{product.description}</span></button>)}</div>}
  </section>;
}
