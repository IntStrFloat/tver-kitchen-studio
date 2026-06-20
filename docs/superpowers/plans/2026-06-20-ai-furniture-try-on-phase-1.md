# AI Furniture Try-On Phase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a provider-neutral, locally testable furniture try-on vertical slice and produce the evidence required to select the production image-editing API.

**Architecture:** A dedicated `/primerka` route owns the mobile wizard. Pure TypeScript modules define the catalog, state machine, validation, analytics payloads, and provider contract; Next.js route handlers expose a development-only in-memory job service backed by a deterministic fake provider. A separate benchmark script validates blinded provider outputs and produces a comparable scorecard before any paid provider or production storage is integrated.

**Tech Stack:** Next.js 16 App Router, React 18, TypeScript, Tailwind CSS, Node 22 built-in test runner, browser Canvas API, existing Yandex Metrica/GA helpers. No new npm dependencies in this phase.

---

## Scope Boundary

This plan deliberately stops before production AI and storage integration. The approved design requires provider selection from evidence, while candidate APIs differ in mask format, reference-image limits, job lifecycle, retention, and pricing. Completing this plan yields:

- a complete mobile UX running against a fake provider;
- stable provider and repository interfaces;
- validated product/room benchmark inputs;
- blinded scoring and an ADR naming the selected provider;
- exact evidence needed for the Phase 2 production integration plan.

Do not add a paid provider SDK, object-storage SDK, database, or queue in Phase 1.

## File Map

- `src/features/try-on/types.ts`: shared serializable domain contracts.
- `src/features/try-on/catalog.ts`: initial product groups and product metadata.
- `src/features/try-on/state.ts`: pure wizard reducer and session restoration.
- `src/features/try-on/image-validation.ts`: client/server file constraints.
- `src/features/try-on/provider.ts`: provider interface and normalized failures.
- `src/features/try-on/fake-provider.ts`: deterministic development adapter.
- `src/features/try-on/job-store.ts`: development-only in-memory job repository.
- `src/features/try-on/analytics.ts`: typed event names and privacy-safe payloads.
- `tsconfig.try-on.json`: focused typecheck boundary that excludes unrelated legacy UI modules.
- `src/app/(main)/primerka/page.tsx`: metadata and route shell.
- `src/components/try-on/TryOnWizard.tsx`: wizard coordinator only.
- `src/components/try-on/ProductStep.tsx`: category and product selection.
- `src/components/try-on/PhotoStep.tsx`: camera/gallery upload and consent.
- `src/components/try-on/MaskStep.tsx`: automatic proposal preview and manual canvas correction.
- `src/components/try-on/GeneratingStep.tsx`: resumable processing state.
- `src/components/try-on/ResultStep.tsx`: before/after, retry, share, and lead CTA.
- `src/app/api/try-on/jobs/route.ts`: create a development job.
- `src/app/api/try-on/jobs/[id]/route.ts`: poll job state.
- `src/app/api/try-on/jobs/[id]/result/route.ts`: stream the fake result.
- `scripts/try-on/validate-dataset.mjs`: validate benchmark manifest and assets.
- `scripts/try-on/summarize-results.mjs`: aggregate blinded reviewer scores.
- `benchmark/try-on/dataset.example.json`: exact asset manifest contract.
- `docs/decisions/ai-image-provider.md`: final benchmark ADR.

### Task 1: Establish the test and workspace foundation

**Files:**
- Modify: `package.json`
- Create: `tsconfig.try-on.json`
- Modify: `.gitignore`
- Create: `src/features/try-on/types.ts`
- Test: `src/features/try-on/types.test.ts`

- [ ] **Step 1: Add a failing serialization contract test**

Create `types.test.ts` with a real round-trip assertion:

```ts
import assert from "node:assert/strict";
import test from "node:test";
import { isTryOnSession } from "./types.ts";

test("accepts a serializable selected-product session", () => {
  const value = JSON.parse(JSON.stringify({
    version: 1,
    step: "photo",
    productId: "kitchen-modern-01",
    jobId: null,
  }));
  assert.equal(isTryOnSession(value), true);
  assert.equal(isTryOnSession({ ...value, version: 2 }), false);
});
```

- [ ] **Step 2: Run the test and verify the missing module failure**

Run: `node --experimental-strip-types --test src/features/try-on/types.test.ts`  
Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `types.ts`.

- [ ] **Step 3: Add the contracts, test script, and generated-file ignore**

Create `types.ts`:

```ts
export type TryOnStep = "product" | "photo" | "mask" | "generating" | "result";
export type JobStatus = "queued" | "processing" | "succeeded" | "failed";

export interface TryOnSession {
  version: 1;
  step: TryOnStep;
  productId: string | null;
  jobId: string | null;
}

export interface PlacementMask {
  width: number;
  height: number;
  points: Array<{ x: number; y: number }>;
}

export interface TryOnJobView {
  id: string;
  status: JobStatus;
  resultUrl?: string;
  errorCode?: "invalid_image" | "provider_timeout" | "provider_failed";
}

export function isTryOnSession(value: unknown): value is TryOnSession {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<TryOnSession>;
  return item.version === 1 &&
    ["product", "photo", "mask", "generating", "result"].includes(item.step ?? "") &&
    (typeof item.productId === "string" || item.productId === null) &&
    (typeof item.jobId === "string" || item.jobId === null);
}
```

Add scripts to `package.json`:

```json
"test": "node --experimental-strip-types --test \"src/**/*.test.ts\"",
"test:try-on": "node --experimental-strip-types --test \"src/features/try-on/*.test.ts\"",
"typecheck:try-on": "tsc -p tsconfig.try-on.json"
```

Create `tsconfig.try-on.json`:

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": { "incremental": false },
  "include": [
    "next-env.d.ts",
    "src/features/try-on/**/*.ts",
    "src/components/try-on/**/*.tsx",
    "src/app/(main)/primerka/**/*.tsx",
    "src/app/api/try-on/**/*.ts"
  ]
}
```

Add to `.gitignore`:

```gitignore
.superpowers/
.data/try-on/
benchmark/try-on/private/
benchmark/try-on/outputs/
```

- [ ] **Step 4: Run the focused test and typecheck**

Run: `npm run test:try-on && npm run typecheck:try-on`  
Expected: all try-on tests PASS; the focused TypeScript check exits 0. Also run `npm run typecheck` and confirm it adds no errors beyond the recorded baseline of missing optional UI packages and the existing `src/lib/analytics.ts` errors.

- [ ] **Step 5: Commit**

```bash
git add package.json tsconfig.try-on.json .gitignore src/features/try-on/types.ts src/features/try-on/types.test.ts
git commit -m "Make try-on behavior testable before integration" -m "Constraint: Full typecheck has pre-existing optional UI dependency failures" -m "Confidence: high" -m "Scope-risk: narrow" -m "Tested: npm run test:try-on; npm run typecheck:try-on; full typecheck baseline compared"
```

### Task 2: Define the curated product catalog

**Files:**
- Create: `src/features/try-on/catalog.ts`
- Test: `src/features/try-on/catalog.test.ts`
- Create: `public/images/try-on/README.md`

- [ ] **Step 1: Write failing catalog integrity tests**

```ts
import assert from "node:assert/strict";
import test from "node:test";
import { TRY_ON_GROUPS, TRY_ON_PRODUCTS } from "./catalog.ts";

test("catalog exposes the four approved furniture groups", () => {
  assert.deepEqual(TRY_ON_GROUPS.map(({ id }) => id), ["kitchens", "wardrobes", "walk-in", "other"]);
});

test("every product has unique id, known group and 2-4 references", () => {
  assert.equal(new Set(TRY_ON_PRODUCTS.map(({ id }) => id)).size, TRY_ON_PRODUCTS.length);
  const groups = new Set(TRY_ON_GROUPS.map(({ id }) => id));
  for (const product of TRY_ON_PRODUCTS) {
    assert.equal(groups.has(product.groupId), true);
    assert.equal(product.references.length >= 2 && product.references.length <= 4, true);
  }
});
```

- [ ] **Step 2: Verify failure, then create the minimal catalog**

Run: `npm run test:try-on`  
Expected: FAIL because `catalog.ts` is missing.

Create `catalog.ts` with typed records. Use real asset paths supplied by the business; do not invent product claims:

```ts
export const TRY_ON_GROUPS = [
  { id: "kitchens", label: "Кухни" },
  { id: "wardrobes", label: "Шкафы" },
  { id: "walk-in", label: "Гардеробные" },
  { id: "other", label: "Другая мебель" },
] as const;

export type TryOnGroupId = (typeof TRY_ON_GROUPS)[number]["id"];
export interface TryOnProduct {
  id: string;
  groupId: TryOnGroupId;
  name: string;
  description: string;
  thumbnail: string;
  references: readonly string[];
}

export const TRY_ON_PRODUCTS: readonly TryOnProduct[] = [];
```

`README.md` must require WebP/JPEG, 1600 px minimum long edge, no people, 2–4 angles, and filenames `<product-id>-01.webp` through `-04.webp`. Before the feature can leave local development, populate 6–12 real products per group; the empty array is allowed only while building the shell.

- [ ] **Step 3: Run tests, noting the intentional empty-catalog state**

Run: `npm run test:try-on`  
Expected: PASS. Add a production-readiness assertion to the benchmark validator in Task 8 rather than blocking shell development.

- [ ] **Step 4: Commit**

```bash
git add src/features/try-on/catalog.ts src/features/try-on/catalog.test.ts public/images/try-on/README.md
git commit -m "Give try-on products a stable catalog contract" -m "Constraint: Real product renders are supplied outside source control preparation" -m "Confidence: high" -m "Scope-risk: narrow" -m "Tested: npm run test:try-on"
```

### Task 3: Implement the wizard state machine

**Files:**
- Create: `src/features/try-on/state.ts`
- Test: `src/features/try-on/state.test.ts`

- [ ] **Step 1: Write reducer tests for the happy path and restoration**

```ts
import assert from "node:assert/strict";
import test from "node:test";
import { initialTryOnState, reduceTryOn } from "./state.ts";

test("requires product, photo and mask before generation", () => {
  let state = reduceTryOn(initialTryOnState, { type: "select-product", productId: "p1" });
  state = reduceTryOn(state, { type: "set-photo", previewUrl: "blob:room" });
  state = reduceTryOn(state, { type: "set-mask", mask: { width: 100, height: 100, points: [] } });
  state = reduceTryOn(state, { type: "job-created", jobId: "j1" });
  assert.equal(state.step, "generating");
  assert.equal(state.jobId, "j1");
});

test("a completed job restores directly to result", () => {
  const state = reduceTryOn(initialTryOnState, { type: "job-succeeded", jobId: "j1" });
  assert.equal(state.step, "result");
});
```

- [ ] **Step 2: Run the test and verify failure**

Run: `npm run test:try-on`  
Expected: FAIL because `state.ts` is missing.

- [ ] **Step 3: Implement a discriminated-union reducer**

`state.ts` must export `TryOnState`, `TryOnAction`, `initialTryOnState`, `reduceTryOn`, `saveSession`, and `restoreSession`. Invalid actions return the unchanged state; browser storage contains only `version`, `step`, `productId`, and `jobId`, never photo URLs, masks, or image bytes.

```ts
export const initialTryOnState: TryOnState = {
  step: "product", productId: null, photoPreviewUrl: null, mask: null, jobId: null, error: null,
};

export function saveSession(state: TryOnState): void {
  if (typeof sessionStorage === "undefined") return;
  sessionStorage.setItem("kuhnitver.try-on.v1", JSON.stringify({
    version: 1, step: state.step, productId: state.productId, jobId: state.jobId,
  }));
}
```

- [ ] **Step 4: Run focused tests and typecheck**

Run: `npm run test:try-on && npm run typecheck:try-on`  
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/features/try-on/state.ts src/features/try-on/state.test.ts
git commit -m "Keep try-on progress recoverable without retaining photos" -m "Confidence: high" -m "Scope-risk: narrow" -m "Tested: npm run test:try-on; npm run typecheck:try-on"
```

### Task 4: Normalize image validation and provider behavior

**Files:**
- Create: `src/features/try-on/image-validation.ts`
- Test: `src/features/try-on/image-validation.test.ts`
- Create: `src/features/try-on/provider.ts`
- Create: `src/features/try-on/fake-provider.ts`
- Test: `src/features/try-on/fake-provider.test.ts`

- [ ] **Step 1: Write failures for unsafe files and normalized provider output**

```ts
import assert from "node:assert/strict";
import test from "node:test";
import { validateImageMetadata } from "./image-validation.ts";

test("accepts JPEG/WebP up to 12 MiB and rejects disguised content", () => {
  assert.deepEqual(validateImageMetadata({ type: "image/jpeg", size: 1000 }), { ok: true });
  assert.deepEqual(validateImageMetadata({ type: "image/svg+xml", size: 1000 }), { ok: false, code: "type" });
  assert.deepEqual(validateImageMetadata({ type: "image/webp", size: 13 * 1024 * 1024 }), { ok: false, code: "size" });
});
```

Fake-provider test:

```ts
test("fake provider returns a completed result without a network call", async () => {
  const result = await fakeTryOnProvider.generate({ jobId: "j1", productId: "p1", room: new Uint8Array([1]), mask: { width: 1, height: 1, points: [] } });
  assert.deepEqual(result, { status: "succeeded", resultKey: "j1" });
});
```

- [ ] **Step 2: Implement the pure validator and provider contract**

```ts
const ALLOWED_TYPES = new Set(["image/jpeg", "image/webp"]);
const MAX_BYTES = 12 * 1024 * 1024;
export function validateImageMetadata(input: { type: string; size: number }) {
  if (!ALLOWED_TYPES.has(input.type)) return { ok: false as const, code: "type" as const };
  if (input.size > MAX_BYTES) return { ok: false as const, code: "size" as const };
  return { ok: true as const };
}
```

`provider.ts` defines `TryOnProvider.generate(input): Promise<ProviderResult>` and a `ProviderFailure` union. `fake-provider.ts` must never import browser APIs or call `fetch`; it returns the input room as a deterministic fake result key.

- [ ] **Step 3: Verify**

Run: `npm run test:try-on && npm run typecheck:try-on`  
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add src/features/try-on/image-validation* src/features/try-on/provider.ts src/features/try-on/fake-provider*
git commit -m "Isolate image and provider rules from the user interface" -m "Rejected: Bind the UI directly to one AI API | benchmark must precede vendor selection" -m "Confidence: high" -m "Scope-risk: narrow" -m "Tested: npm run test:try-on; npm run typecheck:try-on"
```

### Task 5: Add the development job API

**Files:**
- Create: `src/features/try-on/job-store.ts`
- Test: `src/features/try-on/job-store.test.ts`
- Create: `src/app/api/try-on/jobs/route.ts`
- Create: `src/app/api/try-on/jobs/[id]/route.ts`
- Create: `src/app/api/try-on/jobs/[id]/result/route.ts`

- [ ] **Step 1: Test job expiry and one-free-retry accounting**

```ts
test("expired jobs disappear and failed jobs do not consume a retry", () => {
  const store = createMemoryJobStore({ ttlMs: 1000, now: () => 2000 });
  store.put({ id: "old", createdAt: 0, status: "succeeded", attempts: 1 });
  assert.equal(store.get("old"), null);
  const failed = store.put({ id: "new", createdAt: 2000, status: "failed", attempts: 0 });
  assert.equal(failed.attempts, 0);
});
```

- [ ] **Step 2: Implement the in-memory store and route handlers**

The POST route accepts multipart fields `room`, `productId`, and `mask`, validates them, rejects unknown products, creates a crypto-random job id, and invokes only `fakeTryOnProvider`. Guard the route:

```ts
if (process.env.TRY_ON_PROVIDER !== "fake" || process.env.NODE_ENV === "production") {
  return Response.json({ error: "not_configured" }, { status: 503 });
}
```

GET returns only `TryOnJobView`. The result route streams the retained room bytes with `Cache-Control: private, no-store`. All jobs expire after 24 hours; the store prunes on every read/write. Never log multipart bodies or image bytes.

- [ ] **Step 3: Verify route compilation and unit behavior**

Run: `npm run test:try-on && npm run typecheck:try-on && npm run build:local`  
Expected: tests PASS, focused typecheck exits 0, Next build completes.

- [ ] **Step 4: Commit**

```bash
git add src/features/try-on/job-store* src/app/api/try-on
git commit -m "Exercise the try-on lifecycle without exposing a fake production service" -m "Constraint: Fake jobs are development-only and process-local" -m "Confidence: high" -m "Scope-risk: moderate" -m "Tested: npm run test:try-on; npm run typecheck:try-on; npm run build:local"
```

### Task 6: Build the mobile wizard

**Files:**
- Create: `src/app/(main)/primerka/page.tsx`
- Create: `src/components/try-on/TryOnWizard.tsx`
- Create: `src/components/try-on/ProductStep.tsx`
- Create: `src/components/try-on/PhotoStep.tsx`
- Create: `src/components/try-on/MaskStep.tsx`
- Create: `src/components/try-on/GeneratingStep.tsx`
- Create: `src/components/try-on/ResultStep.tsx`

- [ ] **Step 1: Create the server route shell**

```tsx
import type { Metadata } from "next";
import TryOnWizard from "@/components/try-on/TryOnWizard";

export const metadata: Metadata = {
  title: "Примерить мебель в своём интерьере | Kuhnitver",
  description: "Загрузите фото комнаты и посмотрите выбранную мебель Kuhnitver в своём интерьере.",
  robots: { index: false, follow: false },
};

export default function TryOnPage() {
  return <main className="min-h-screen pt-20"><TryOnWizard /></main>;
}
```

- [ ] **Step 2: Implement focused step components**

`TryOnWizard` owns one reducer, one selected `File`, polling, and object-URL cleanup. Each step receives typed values/callbacks and contains no API calls. `PhotoStep` uses:

```tsx
<input
  type="file"
  accept="image/jpeg,image/webp"
  capture="environment"
  onChange={(event) => event.target.files?.[0] && onSelect(event.target.files[0])}
/>
```

`MaskStep` starts with a centered rectangular proposal covering 60% width and 55% height. Manual editing uses pointer events on a canvas and stores normalized coordinates, so display size does not affect the submitted mask. `GeneratingStep` polls every 2 seconds, stops after success/failure, and resumes from restored `jobId`. `ResultStep` uses a range input for a before/after reveal and exposes native share when available.

- [ ] **Step 3: Add accessible and failure states**

All controls need visible labels, keyboard focus, 44 px minimum targets, `aria-live="polite"` for job state, and Russian user messages for `invalid_image`, `provider_timeout`, and `provider_failed`. Revoke every `URL.createObjectURL` in an effect cleanup.

- [ ] **Step 4: Verify locally in a real browser**

Run: `$env:TRY_ON_PROVIDER='fake'; npm run dev`  
Check at `http://localhost:3000/primerka`: product → photo → zone → generation → result; reload during generation; back navigation; JPEG/WebP rejection; 375 px and 1440 px layouts.  
Expected: no console errors, no horizontal scroll, full fake flow completes.

- [ ] **Step 5: Commit**

```bash
git add 'src/app/(main)/primerka' src/components/try-on
git commit -m "Let visitors complete the try-on journey before signup" -m "Constraint: Phase 1 uses a development-only fake result" -m "Confidence: medium" -m "Scope-risk: moderate" -m "Tested: manual Chrome mobile and desktop flow; npm run typecheck:try-on"
```

### Task 7: Add privacy-safe analytics and the post-result lead

**Files:**
- Modify: `src/lib/analytics.ts`
- Create: `src/features/try-on/analytics.ts`
- Test: `src/features/try-on/analytics.test.ts`
- Modify: `src/components/try-on/TryOnWizard.tsx`
- Modify: `src/components/try-on/ResultStep.tsx`

- [ ] **Step 1: Test the analytics allowlist**

```ts
test("drops image-like and personal values", () => {
  assert.deepEqual(sanitizeTryOnPayload({ product_id: "p1", photo_url: "blob:x", phone: "+7", retry_reason: "size" }), {
    product_id: "p1", retry_reason: "size",
  });
});
```

- [ ] **Step 2: Implement event types and sanitization**

Allow only `product_id`, `group_id`, `job_status`, `retry_reason`, `elapsed_bucket`, and `source`. Add the ten approved funnel event names. `trackTryOnEvent` sends the sanitized object to both Metrica counters and GA, mirroring `trackBlogEvent` and swallowing analytics failures.

- [ ] **Step 3: Add post-result contact capture**

Reuse `sendLead` only after the result is shown. Send `productId`, `jobId`, retry reason, and current page URL as details; never send the room or result URL through analytics. The lead button text is `Получить расчёт этого варианта`, and the privacy-policy link remains visible next to the phone field.

- [ ] **Step 4: Verify tests and the lead fallback**

Run: `npm run test:try-on && npm run typecheck:try-on`  
Manual: block `api.web3forms.com`, submit once, and verify the existing call fallback appears without losing the result.  
Expected: tests PASS; failed lead does not reset the wizard.

- [ ] **Step 5: Commit**

```bash
git add src/lib/analytics.ts src/features/try-on/analytics* src/components/try-on
git commit -m "Measure try-on value without leaking room data" -m "Constraint: Contact is requested only after the first result" -m "Confidence: high" -m "Scope-risk: moderate" -m "Tested: npm run test:try-on; npm run typecheck:try-on; blocked-network lead fallback"
```

### Task 8: Build the blinded provider benchmark

**Files:**
- Create: `benchmark/try-on/dataset.example.json`
- Create: `scripts/try-on/validate-dataset.mjs`
- Create: `scripts/try-on/summarize-results.mjs`
- Create: `scripts/try-on/validate-dataset.test.mjs`
- Modify: `package.json`
- Create: `docs/decisions/ai-image-provider.md`

- [ ] **Step 1: Define and test the manifest contract**

Example manifest:

```json
{
  "products": [{ "id": "product-001", "group": "kitchens", "references": ["private/products/product-001-01.webp", "private/products/product-001-02.webp"] }],
  "rooms": [{ "id": "room-001", "image": "private/rooms/room-001.webp", "mask": "private/masks/room-001.png" }],
  "cases": [{ "id": "case-001", "productId": "product-001", "roomId": "room-001" }]
}
```

The validator must fail duplicate ids, missing files, fewer than 30 products, fewer than 30 rooms, fewer than two product references, unknown links, and groups outside the approved four. Tests use a temporary directory and assert each failure message.

- [ ] **Step 2: Implement blinded score aggregation**

Input CSV columns:

```text
reviewer,case_id,candidate,product_fidelity,room_preservation,perspective,mask_quality,latency_ms,cost_rub,technical_success
```

The script validates integer human scores from 1–5, reports medians and technical success by anonymous candidate code, and refuses to rank a candidate with missing cases. It must not contain provider names; a separate local key maps candidate codes to vendors.

- [ ] **Step 3: Add exact commands**

```json
"benchmark:validate": "node scripts/try-on/validate-dataset.mjs benchmark/try-on/private/dataset.json",
"benchmark:summarize": "node scripts/try-on/summarize-results.mjs benchmark/try-on/private/scores.csv"
```

- [ ] **Step 4: Run the real benchmark and record the decision**

For every candidate, generate the same 30+ cases with equivalent quality settings. Randomize candidate codes before at least two reviewers score outputs. Run both commands. Fill the ADR with date, tested API versions, fidelity/success/latency/cost medians, retention policy, chosen provider, and rejected alternatives. This is evidence entry, not a code placeholder; do not start Phase 2 without the completed table.

- [ ] **Step 5: Commit scripts and, separately, the completed ADR**

```bash
git add benchmark/try-on/dataset.example.json scripts/try-on package.json
git commit -m "Make image-provider selection reproducible" -m "Confidence: high" -m "Scope-risk: narrow" -m "Tested: benchmark validator and score aggregation tests"

git add docs/decisions/ai-image-provider.md
git commit -m "Select the provider from blinded furniture-placement evidence" -m "Constraint: Production integration follows measured fidelity and retention requirements" -m "Confidence: medium" -m "Scope-risk: broad" -m "Tested: 30 products across 30 rooms with two reviewers"
```

### Task 9: Phase 1 release gate

**Files:**
- Modify: `.env.example`
- Modify: `README.md`
- Create: `docs/superpowers/plans/2026-06-20-ai-furniture-try-on-phase-2.md` only after Task 8 selects a provider

- [ ] **Step 1: Document the development-only configuration**

Add:

```dotenv
# Local try-on shell only. Production rejects the fake provider.
TRY_ON_PROVIDER=fake
```

README must state that `/primerka` returns 503 from its API in production until Phase 2, and must link the design, this plan, and the provider ADR.

- [ ] **Step 2: Run the complete verification sequence**

Run sequentially:

```powershell
npm run test
npm run typecheck:try-on
npm run build:local
npm run benchmark:validate
git diff --check
```

Expected: all listed commands exit 0. Run `npm run typecheck` separately and compare its output with the recorded baseline; Phase 1 must introduce no additional full-repository errors. Then perform the real-browser flow on iOS Safari and Android Chrome, including camera capture, refresh during generation, manual mask correction, share fallback, lead success, and lead failure.

- [ ] **Step 3: Write the Phase 2 plan from the selected API contract**

The next plan must name exact production resources and files for: chosen provider adapter, private object storage, durable job repository, rate limiting, 24-hour deletion, deployment environment variables, data-processing terms, production smoke tests, and rollback. Do not copy generic calls from this plan; use the API version and limits recorded in the ADR.

- [ ] **Step 4: Commit documentation**

```bash
git add .env.example README.md docs/superpowers/plans/2026-06-20-ai-furniture-try-on-phase-2.md
git commit -m "Make the production try-on boundary explicit" -m "Constraint: Fake generation must remain unavailable in production" -m "Confidence: high" -m "Scope-risk: narrow" -m "Tested: full Phase 1 verification sequence and mobile browser matrix"
```

## Completion Criteria

Phase 1 is complete only when:

- the fake flow works end to end without registration;
- no photo bytes or URLs enter analytics or session storage;
- production cannot invoke the fake provider;
- the benchmark dataset meets the 30-product/30-room minimum;
- blinded scores and the provider ADR are complete;
- tests, typecheck, build, benchmark validation, and mobile-browser checks pass;
- the Phase 2 plan names the selected provider and real infrastructure.
