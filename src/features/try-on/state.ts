import {
  isTryOnSession,
  type PlacementMask,
  type TryOnJobView,
  type TryOnSession,
  type TryOnStep,
} from "./types.ts";

const STORAGE_KEY = "kuhnitver.try-on.v1";

export type TryOnError = NonNullable<TryOnJobView["errorCode"]>;

export interface TryOnState {
  step: TryOnStep;
  productId: string | null;
  photoPreviewUrl: string | null;
  mask: PlacementMask | null;
  jobId: string | null;
  error: TryOnError | null;
}

export type TryOnAction =
  | { type: "select-product"; productId: string }
  | { type: "set-photo"; previewUrl: string }
  | { type: "set-mask"; mask: PlacementMask }
  | { type: "job-created"; jobId: string }
  | { type: "job-succeeded"; jobId: string }
  | { type: "job-failed"; jobId: string; error?: TryOnError }
  | { type: "restart" }
  | { type: "back" };

export const initialTryOnState: TryOnState = {
  step: "product",
  productId: null,
  photoPreviewUrl: null,
  mask: null,
  jobId: null,
  error: null,
};

export function reduceTryOn(state: TryOnState, action: TryOnAction): TryOnState {
  switch (action.type) {
    case "select-product":
      return {
        ...initialTryOnState,
        step: "photo",
        productId: action.productId,
      };
    case "set-photo":
      if (state.step !== "photo" || state.productId === null) return state;
      return {
        ...state,
        step: "mask",
        photoPreviewUrl: action.previewUrl,
        mask: null,
        jobId: null,
        error: null,
      };
    case "set-mask":
      if (state.step !== "mask" || state.productId === null || state.photoPreviewUrl === null) return state;
      return { ...state, step: "mask", mask: action.mask };
    case "job-created":
      if (
        state.step !== "mask"
        || state.productId === null
        || state.photoPreviewUrl === null
        || state.mask === null
      ) return state;
      return { ...state, step: "generating", jobId: action.jobId, error: null };
    case "job-succeeded":
      if (state.step !== "generating" || state.productId === null || state.jobId !== action.jobId) return state;
      return { ...state, step: "result", jobId: action.jobId, error: null };
    case "job-failed":
      if (state.step !== "generating" || state.jobId !== action.jobId) return state;
      return { ...state, error: action.error ?? "provider_failed" };
    case "restart":
      return initialTryOnState;
    case "back":
      return reduceBack(state);
  }
}

function reduceBack(state: TryOnState): TryOnState {
  if (state.step === "result" || state.step === "generating") {
    if (state.photoPreviewUrl !== null && state.mask !== null) {
      return { ...state, step: "mask", jobId: null, error: null };
    }

    if (state.productId === null) return state;
    return { ...initialTryOnState, step: "photo", productId: state.productId };
  }

  if (state.step === "mask") {
    return { ...state, step: "photo", mask: null, jobId: null, error: null };
  }

  if (state.step === "photo") {
    return initialTryOnState;
  }

  return state;
}

export function saveSession(state: TryOnState, storage = getSessionStorage()): void {
  if (storage === null) return;

  const session: TryOnSession = {
    version: 1,
    step: state.step,
    productId: state.productId,
    jobId: state.jobId,
  };

  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch {
    // Storage may be disabled or full; wizard progress remains usable in memory.
  }
}

export function restoreSession(storage = getSessionStorage()): TryOnState {
  if (storage === null) return initialTryOnState;

  try {
    const serialized = storage.getItem(STORAGE_KEY);
    if (serialized === null) return initialTryOnState;

    const session: unknown = JSON.parse(serialized);
    return isTryOnSession(session) ? normalizeSession(session) : initialTryOnState;
  } catch {
    return initialTryOnState;
  }
}

function normalizeSession(session: TryOnSession): TryOnState {
  if (session.step === "product" || session.productId === null) {
    return initialTryOnState;
  }

  if ((session.step === "generating" || session.step === "result") && session.jobId !== null) {
    return {
      ...initialTryOnState,
      step: session.step,
      productId: session.productId,
      jobId: session.jobId,
    };
  }

  return {
    ...initialTryOnState,
    step: "photo",
    productId: session.productId,
  };
}

function getSessionStorage(): Storage | null {
  try {
    return typeof sessionStorage === "undefined" ? null : sessionStorage;
  } catch {
    return null;
  }
}
