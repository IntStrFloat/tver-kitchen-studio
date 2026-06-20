"use client";
import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import ProductStep from "./ProductStep";
import PhotoStep from "./PhotoStep";
import MaskStep from "./MaskStep";
import GeneratingStep from "./GeneratingStep";
import ResultStep from "./ResultStep";
import { TRY_ON_PRODUCTS } from "@/features/try-on/catalog";
import { trackTryOnEvent } from "@/features/try-on/analytics";
import { initialTryOnState, reduceTryOn, restoreSession, saveSession, type TryOnError } from "@/features/try-on/state";
import type { PlacementMask, TryOnJobView } from "@/features/try-on/types";
const errorText: Record<TryOnError, string> = { invalid_image: "Не удалось проверить изображение. Выберите JPEG или WebP.", provider_timeout: "Время ожидания обработки истекло. Попробуйте ещё раз.", provider_failed: "Не удалось выполнить примерку. Попробуйте ещё раз." };
export default function TryOnWizard() {
    const [state, dispatch] = useReducer(reduceTryOn, initialTryOnState);
    const [ready, setReady] = useState(false);
    const fileRef = useRef<File | null>(null);
    const urlRef = useRef<string | null>(null);
    const polling = useRef(false);
    const creationInFlight = useRef(false);
    const [creating, setCreating] = useState(false);
    const opened = useRef(false);
    const generationStartedAt = useRef<number | null>(null);
    const completedJobs = useRef(new Set<string>());
    const [resultUrl, setResultUrl] = useState<string | null>(null);
    const [requestError, setRequestError] = useState<string | null>(null);
    const clearPhoto = useCallback(() => { const previousUrl = urlRef.current; urlRef.current = null; fileRef.current = null; if (previousUrl)
        URL.revokeObjectURL(previousUrl); }, []);
    useEffect(() => { const restored = restoreSession(); dispatch({ type: "restore-session", session: { version: 1, step: restored.step, productId: restored.productId, jobId: restored.jobId } }); if (restored.step === "result" && restored.jobId)
        setResultUrl(`/api/try-on/jobs/${encodeURIComponent(restored.jobId)}/result`); setReady(true); return clearPhoto; }, [clearPhoto]);
    useEffect(() => { if (!opened.current) {
        opened.current = true;
        trackTryOnEvent("try_on_open");
    } }, []);
    useEffect(() => { if (ready)
        saveSession(state); }, [state, ready]);
    const setPhoto = (file: File) => { clearPhoto(); setRequestError(null); fileRef.current = file; const url = URL.createObjectURL(file); urlRef.current = url; dispatch({ type: "set-photo", previewUrl: url }); trackTryOnEvent("try_on_photo_uploaded", { product_id: state.productId ?? undefined }); };
    const elapsedBucket = () => { const elapsed = generationStartedAt.current === null ? 46000 : Date.now() - generationStartedAt.current; return elapsed < 15000 ? "<15s" : elapsed <= 45000 ? "15-45s" : ">45s"; };
    const create = async () => { if (creationInFlight.current || !fileRef.current || !state.productId || !state.mask)
        return; creationInFlight.current = true; setCreating(true); const retryReason = state.step === "generating" && state.error ? state.error : null; if (retryReason)
        trackTryOnEvent("try_on_retry", { product_id: state.productId, retry_reason: retryReason }); generationStartedAt.current = Date.now(); trackTryOnEvent("try_on_generation_started", { product_id: state.productId }); setRequestError(null); try {
        const form = new FormData();
        form.set("room", fileRef.current);
        form.set("productId", state.productId);
        form.set("mask", JSON.stringify(state.mask));
        const response = await fetch("/api/try-on/jobs", { method: "POST", body: form });
        if (!response.ok) {
            const message = response.status === 413 ? "Фото слишком большое для отправки." : response.status === 411 ? "Сервер просит повторить отправку. Фото и область сохранены." : response.status === 503 ? "Сервис временно недоступен или занят." : "Проверьте фото и выбранную область.";
            throw new Error(message);
        }
        const job = await response.json() as TryOnJobView;
        if (!job.id)
            throw new Error("Сервис вернул неполный ответ.");
        setRequestError(null);
        dispatch(retryReason ? { type: "retry-job-created", jobId: job.id } : { type: "job-created", jobId: job.id });
    }
    catch (error) {
        setRequestError(error instanceof Error ? error.message : errorText.provider_failed);
    }
    finally {
        creationInFlight.current = false;
        setCreating(false);
    } };
    useEffect(() => { if (state.step !== "generating" || !state.jobId)
        return; let stopped = false; const check = async () => { if (polling.current || stopped)
        return; polling.current = true; try {
        const response = await fetch(`/api/try-on/jobs/${encodeURIComponent(state.jobId!)}`);
        if (!response.ok)
            throw new Error();
        const job = await response.json() as TryOnJobView;
        if (job.status === "succeeded") {
            if (!completedJobs.current.has(job.id)) {
                completedJobs.current.add(job.id);
                trackTryOnEvent("try_on_generation_completed", { product_id: state.productId ?? undefined, job_status: "succeeded", elapsed_bucket: elapsedBucket() });
            }
            setResultUrl(job.resultUrl ?? `/api/try-on/jobs/${encodeURIComponent(job.id)}/result`);
            dispatch({ type: "job-succeeded", jobId: job.id });
        }
        else if (job.status === "failed")
            dispatch({ type: "job-failed", jobId: job.id, error: job.errorCode ?? "provider_failed" });
    }
    catch {
        dispatch({ type: "job-failed", jobId: state.jobId!, error: "provider_failed" });
    }
    finally {
        polling.current = false;
    } }; void check(); const timer = window.setInterval(() => void check(), 2000); return () => { stopped = true; window.clearInterval(timer); }; }, [state.step, state.jobId, state.productId]);
    useEffect(() => { if (state.step !== "result" || !state.jobId)
        return; let cancelled = false; void (async () => { try {
        const response = await fetch(`/api/try-on/jobs/${encodeURIComponent(state.jobId!)}`);
        if (!response.ok || cancelled) {
            if (!cancelled) {
                dispatch({ type: "job-pending", jobId: state.jobId! });
                dispatch({ type: "job-failed", jobId: state.jobId!, error: "provider_failed" });
            }
            return;
        }
        const job = await response.json() as TryOnJobView;
        if (cancelled)
            return;
        if (job.status === "failed") {
            dispatch({ type: "job-pending", jobId: job.id });
            dispatch({ type: "job-failed", jobId: job.id, error: job.errorCode ?? "provider_failed" });
        }
        else if (job.status !== "succeeded")
            dispatch({ type: "job-pending", jobId: job.id });
    }
    catch {
        if (!cancelled) {
            dispatch({ type: "job-pending", jobId: state.jobId! });
            dispatch({ type: "job-failed", jobId: state.jobId!, error: "provider_failed" });
        }
    } })(); return () => { cancelled = true; }; }, [state.step, state.jobId]);
    const goBack = () => { if (state.step === "photo")
        clearPhoto(); setRequestError(null); dispatch({ type: "back" }); };
    const restart = () => { clearPhoto(); setResultUrl(null); setRequestError(null); dispatch({ type: "restart" }); };
    if (!ready)
        return null;
    const product = TRY_ON_PRODUCTS.find((item) => item.id === state.productId);
    const productStep = <ProductStep onGroupSelect={(groupId) => trackTryOnEvent("try_on_group_select", { group_id: groupId })} onSelect={(productId) => { const selected = TRY_ON_PRODUCTS.find((item) => item.id === productId); trackTryOnEvent("try_on_product_select", { product_id: productId, group_id: selected?.groupId }); dispatch({ type: "select-product", productId }); }}/>;
    if (state.step === "product")
        return productStep;
    if (!product)
        return productStep;
    if (state.step === "photo")
        return <PhotoStep productName={product.name} previewUrl={state.photoPreviewUrl} onPhoto={setPhoto} onPhotoOpen={() => trackTryOnEvent("try_on_photo_open", { product_id: state.productId })} onBack={goBack}/>;
    if (state.step === "mask" && state.photoPreviewUrl)
        return <MaskStep previewUrl={state.photoPreviewUrl} mask={state.mask} onChange={(mask: PlacementMask) => dispatch({ type: "set-mask", mask })} onConfirm={() => { if (creationInFlight.current) return; trackTryOnEvent("try_on_mask_confirmed", { product_id: state.productId }); void create(); }} onBack={goBack} error={requestError ?? (state.error ? errorText[state.error] : null)} submitting={creating}/>;
    if (state.step === "result" && resultUrl)
        return <ResultStep beforeUrl={state.photoPreviewUrl} resultUrl={resultUrl} productName={product.name} productId={product.id} jobId={state.jobId} onRestart={restart}/>;
    return <GeneratingStep error={requestError ?? (state.error ? errorText[state.error] : null)} canRetry={fileRef.current !== null && state.mask !== null} onBack={goBack} onRetry={() => void create()}/>;
}
