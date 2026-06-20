import { randomUUID } from "node:crypto";

import { TRY_ON_PRODUCTS } from "../../../../features/try-on/catalog.ts";
import { fakeTryOnProvider } from "../../../../features/try-on/fake-provider.ts";
import { validateImageMetadata, validateImageSignature } from "../../../../features/try-on/image-validation.ts";
import { getDevelopmentJobStore, isTryOnDevelopmentEnabled, parsePlacementMask, runJobGeneration, validateRequestContentLength } from "../../../../features/try-on/job-api.ts";
import { StoreCapacityError, toPublicJobView, type TryOnJobRecord } from "../../../../features/try-on/job-store.ts";

export async function POST(request: Request): Promise<Response> {
  if (!isTryOnDevelopmentEnabled()) {
    return Response.json({ error: "not_configured" }, { status: 503 });
  }

  const lengthError = validateRequestContentLength(request);
  if (lengthError !== null) {
    return Response.json(
      { error: lengthError === 411 ? "length_required" : "payload_too_large" },
      { status: lengthError },
    );
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return Response.json({ error: "invalid_image" }, { status: 400 });
  }

  const room = form.get("room");
  if (!(room instanceof File) || !validateImageMetadata(room).ok) {
    return Response.json({ error: "invalid_image" }, { status: 400 });
  }

  const productId = form.get("productId");
  if (typeof productId !== "string" || !TRY_ON_PRODUCTS.some((product) => product.id === productId)) {
    return Response.json({ error: "unknown_product" }, { status: 400 });
  }

  const mask = parsePlacementMask(form.get("mask"));
  if (!mask) {
    return Response.json({ error: "invalid_mask" }, { status: 400 });
  }

  const roomBytes = new Uint8Array(await room.arrayBuffer());
  if (!validateImageSignature(roomBytes, room.type).ok) {
    return Response.json({ error: "invalid_image" }, { status: 400 });
  }

  const store = getDevelopmentJobStore();
  const job: TryOnJobRecord = {
    id: randomUUID(),
    createdAt: Date.now(),
    status: "queued",
    attempts: 0,
    productId,
    mimeType: room.type,
    room: roomBytes,
    mask,
  };
  try {
    store.put(job);
  } catch (error) {
    if (error instanceof StoreCapacityError) {
      return Response.json({ error: "capacity" }, { status: 503 });
    }
    throw error;
  }
  await runJobGeneration(store, job.id, fakeTryOnProvider);

  return Response.json(toPublicJobView(store.getView(job.id)!), { status: 202 });
}
