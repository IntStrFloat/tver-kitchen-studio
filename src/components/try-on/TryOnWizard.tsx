"use client";

import { useEffect, useReducer, useRef, useState } from "react";
import ProductStep from "./ProductStep";
import PhotoStep from "./PhotoStep";
import MaskStep from "./MaskStep";
import GeneratingStep from "./GeneratingStep";
import ResultStep from "./ResultStep";
import { TRY_ON_PRODUCTS } from "@/features/try-on/catalog";
import { initialTryOnState, reduceTryOn, restoreSession, saveSession, type TryOnError } from "@/features/try-on/state";
import type { PlacementMask, TryOnJobView } from "@/features/try-on/types";

const errorText: Record<TryOnError, string> = { invalid_image: "Не удалось проверить изображение. Выберите JPEG или WebP.", provider_timeout: "Время ожидания обработки истекло. Попробуйте ещё раз.", provider_failed: "Не удалось выполнить примерку. Попробуйте ещё раз." };

export default function TryOnWizard() {
  const [state, dispatch] = useReducer(reduceTryOn, initialTryOnState); const [ready, setReady] = useState(false); const fileRef = useRef<File | null>(null); const urlRef = useRef<string |null>(null); const polling = useRef(false); const [resultUrl, setResultUrl] = useState<string | null>(null); const [requestError, setRequestError] = useState<string | null>(null);
  useEffect(() => { dispatch({ type: "restart" }); const session = restoreSession(); if (session.step !== "product") { if (session.step === "generating" && session.productId && session.jobId) { dispatch({ type: "select-product", productId: session.productId }); dispatch({ type: "job-created", jobId: session.jobId }); } } setReady(true); return () => { if (urlRef.current) URL.revokeObjectURL(urlRef.current); }; }, []);
  useEffect(() => { if (ready) saveSession(state); }, [state, ready]);
  const setPhoto = (file: File) => { if (urlRef.current) URL.revokeObjectURL(urlRef.current); fileRef.current = file; const url = URL.createObjectURL(file); urlRef.current = url; dispatch({ type: "set-photo", previewUrl: url }); };
  const create = async () => { if (!fileRef.current || !state.productId || !state.mask) return; setRequestError(null); try { const form = new FormData(); form.set("room", fileRef.current); form.set("productId", state.productId); form.set("mask", JSON.stringify(state.mask)); const response = await fetch("/api/try-on/jobs", { method: "POST", body: form }); if (!response.ok) { const message = response.status === 413 ? "Фото слишком большое для отправки." : response.status === 411 ? "Сервер просит повторить отправку. Фото и область сохранены." : response.status === 503 ? "Сервис временно недоступен или занят." : "Проверьте фото и выбранную область."; throw new Error(message); } const job = await response.json() as TryOnJobView; if (!job.id) throw new Error("Сервис вернул неполный ответ."); dispatch({ type: "job-created", jobId: job.id }); } catch (error) { setRequestError(error instanceof Error ? error.message : errorText.provider_failed); } };
  useEffect(() => { if (state.step !== "generating" || !state.jobId) return; let stopped = false; const check = async () => { if (polling.current || stopped) return; polling.current = true; try { const response = await fetch(`/api/try-on/jobs/${encodeURIComponent(state.jobId!)}`); if (!response.ok) throw new Error(); const job = await response.json() as TryOnJobView; if (job.status === "succeeded") { setResultUrl(job.resultUrl ?? `/api/try-on/jobs/${encodeURIComponent(job.id)}/result`); dispatch({ type: "job-succeeded", jobId: job.id }); } else if (job.status === "failed") dispatch({ type: "job-failed", jobId: job.id, error: job.errorCode ?? "provider_failed" }); } catch { dispatch({ type: "job-failed", jobId: state.jobId!, error: "provider_failed" }); } finally { polling.current = false; } }; void check(); const timer = window.setInterval(() => void check(), 2000); return () => { stopped = true; window.clearInterval(timer); }; }, [state.step, state.jobId]);
  if (!ready) return null; const product = TRY_ON_PRODUCTS.find((item) => item.id === state.productId);
  if (state.step === "product") return <ProductStep onSelect={(productId) => dispatch({ type: "select-product", productId })} />;
  if (!product) return <ProductStep onSelect={(productId) => dispatch({ type: "select-product", productId })} />;
  if (state.step === "photo") return <PhotoStep productName={product.name} previewUrl={state.photoPreviewUrl} onPhoto={setPhoto} onBack={() => dispatch({ type: "back" })} />;
  if (state.step === "mask" && state.photoPreviewUrl) return <MaskStep previewUrl={state.photoPreviewUrl} mask={state.mask} onChange={(mask: PlacementMask) => dispatch({ type: "set-mask", mask })} onConfirm={() => void create()} onBack={() => dispatch({ type: "back" })} error={requestError ?? (state.error ? errorText[state.error] : null)} />;
  if (state.step === "result" && state.photoPreviewUrl && resultUrl) return <ResultStep beforeUrl={state.photoPreviewUrl} resultUrl={resultUrl} productName={product.name} onRestart={() => dispatch({ type: "restart" })} />;
  return <GeneratingStep error={state.error ? errorText[state.error] : null} onBack={() => dispatch({ type: "back" })} onRetry={() => void create()} />;
}
