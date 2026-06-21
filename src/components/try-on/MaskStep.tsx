"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import type { PlacementMask } from "@/features/try-on/types";
const MAX_CANVAS_EDGE = 1600;
const VERTEX_HIT_RADIUS = 24;
const proposal = (): PlacementMask => ({ width: 1, height: 1, points: [{ x: .2, y: .2 }, { x: .8, y: .2 }, { x: .8, y: .75 }, { x: .2, y: .75 }] });
export default function MaskStep({ previewUrl, mask, onChange, onConfirm, onBack, error, submitting }: {
    previewUrl: string;
    mask: PlacementMask | null;
    onChange: (mask: PlacementMask) => void;
    onConfirm: () => void;
    onBack: () => void;
    error: string | null;
    submitting: boolean;
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imageRef = useRef<HTMLImageElement | null>(null);
    const [loaded, setLoaded] = useState(false);
    const [editing, setEditing] = useState(false);
    const [drag, setDrag] = useState<number | null>(null);
    const current = mask ?? proposal();
    useEffect(() => { if (mask === null)
        onChange(proposal()); }, [mask, onChange]);
    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        const image = imageRef.current;
        if (!canvas || !image)
            return;
        const context = canvas.getContext("2d");
        if (!context)
            return;
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        context.fillStyle = "rgba(59,130,246,.25)";
        context.strokeStyle = "#2563eb";
        context.lineWidth = Math.max(3, canvas.width / 250);
        context.beginPath();
        current.points.forEach((point, index) => index ? context.lineTo(point.x * canvas.width, point.y * canvas.height) : context.moveTo(point.x * canvas.width, point.y * canvas.height));
        context.closePath();
        context.fill();
        context.stroke();
        current.points.forEach((point) => { context.beginPath(); context.fillStyle = "white"; context.arc(point.x * canvas.width, point.y * canvas.height, Math.max(8, canvas.width / 80), 0, Math.PI * 2); context.fill(); context.stroke(); });
    }, [current.points]);
    useEffect(() => {
        let active = true;
        setLoaded(false);
        imageRef.current = null;
        const image = new Image();
        image.onload = () => { if (!active)
            return; const canvas = canvasRef.current; if (!canvas)
            return; const scale = Math.min(1, MAX_CANVAS_EDGE / Math.max(image.naturalWidth || 1, image.naturalHeight || 1)); canvas.width = Math.max(1, Math.round((image.naturalWidth || 800) * scale)); canvas.height = Math.max(1, Math.round((image.naturalHeight || 600) * scale)); imageRef.current = image; setLoaded(true); };
        image.src = previewUrl;
        return () => { active = false; image.onload = null; };
    }, [previewUrl]);
    useEffect(() => { if (loaded)
        draw(); }, [loaded, draw]);
    const pointAt = (event: React.PointerEvent<HTMLCanvasElement>) => { const rect = event.currentTarget.getBoundingClientRect(); return { x: Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width)), y: Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height)), rect }; };
    const findVertex = (event: React.PointerEvent<HTMLCanvasElement>) => { const point = pointAt(event); return current.points.findIndex((vertex) => Math.hypot((vertex.x - point.x) * point.rect.width, (vertex.y - point.y) * point.rect.height) <= VERTEX_HIT_RADIUS); };
    const clearDrag = () => setDrag(null);
    return <section className="mx-auto w-full max-w-2xl px-4 py-8"><p className="text-sm font-medium text-primary">Шаг 3 из 3</p><h1 className="mt-2 text-3xl font-bold">Область размещения</h1><p className="mt-3 text-sm text-muted-foreground">Это редактируемое предложение, а не автоматическое определение зоны.</p><div className="relative mt-5 overflow-hidden rounded-xl border"><canvas ref={canvasRef} className="block h-auto w-full touch-none" aria-label="Редактируемая область размещения на фото" onPointerDown={(event) => { if (!editing)
        return; const index = findVertex(event); if (index >= 0) {
        event.currentTarget.setPointerCapture(event.pointerId);
        setDrag(index);
    } }} onPointerMove={(event) => { if (drag === null)
        return; const point = pointAt(event); onChange({ ...current, points: current.points.map((vertex, index) => index === drag ? { x: point.x, y: point.y } : vertex) }); }} onPointerUp={clearDrag} onPointerCancel={clearDrag} onLostPointerCapture={clearDrag}/></div><div className="mt-4 flex flex-wrap gap-3"><button type="button" className="min-h-11 rounded-lg border px-4" onClick={() => setEditing(!editing)}>{editing ? "Готово" : "Изменить область"}</button><button type="button" className="min-h-11 rounded-lg border px-4" onClick={() => onChange(proposal())}>Сбросить предложение</button></div>{error && <p role="alert" className="mt-4 text-sm text-destructive">{error}</p>}<div className="mt-6 flex flex-wrap gap-3"><button className="min-h-11 rounded-lg border px-4" type="button" onClick={onBack}>Назад</button><button className="min-h-11 rounded-lg bg-primary px-4 text-primary-foreground disabled:opacity-50" type="button" disabled={submitting} onClick={onConfirm}>{submitting ? "Создаём примерку..." : "Подтвердить и создать примерку"}</button></div></section>;
}
