import { randomUUID } from "node:crypto";

import { NextResponse } from "next/server";

import { TRY_ON_PRODUCTS } from "@/features/try-on/catalog";
import { fakeTryOnProvider } from "@/features/try-on/fake-provider";
import { validateImageMetadata, validateImageSignature } from "@/features/try-on/image-validation";
import { getDevelopmentJobStore, isTryOnDevelopmentEnabled, parsePlacementMask, runJobGeneration } from "@/features/try-on/job-api";
import { toPublicJobView, type TryOnJobRecord } from "@/features/try-on/job-store";

export async function POST(request: Request): Promise<Response> {
  if (!isTryOnDevelopmentEnabled()) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "invalid_image" }, { status: 400 });
  }

  const room = form.get("room");
  if (!(room instanceof File) || !validateImageMetadata(room).ok) {
    return NextResponse.json({ error: "invalid_image" }, { status: 400 });
  }

  const productId = form.get("productId");
  if (typeof productId !== "string" || !TRY_ON_PRODUCTS.some((product) => product.id === productId)) {
    return NextResponse.json({ error: "unknown_product" }, { status: 400 });
  }

  const mask = parsePlacementMask(form.get("mask"));
  if (!mask) {
    return NextResponse.json({ error: "invalid_mask" }, { status: 400 });
  }

  const roomBytes = new Uint8Array(await room.arrayBuffer());
  if (!validateImageSignature(roomBytes, room.type).ok) {
    return NextResponse.json({ error: "invalid_image" }, { status: 400 });
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
  store.put(job);
  await runJobGeneration(store, job.id, fakeTryOnProvider);

  return NextResponse.json(toPublicJobView(store.get(job.id)!), { status: 202 });
}
