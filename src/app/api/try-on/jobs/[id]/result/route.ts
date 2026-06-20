import { NextResponse } from "next/server";

import { getDevelopmentJobStore, isTryOnDevelopmentEnabled } from "@/features/try-on/job-api";

const PRIVATE_NO_STORE = { "Cache-Control": "private, no-store" };

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
): Promise<Response> {
  if (!isTryOnDevelopmentEnabled()) {
    return NextResponse.json({ error: "not_configured" }, { status: 503, headers: PRIVATE_NO_STORE });
  }

  const { id } = await context.params;
  const job = getDevelopmentJobStore().get(id);
  if (!job || job.status !== "succeeded" || !job.resultKey) {
    return NextResponse.json({ error: "not_found" }, { status: 404, headers: PRIVATE_NO_STORE });
  }

  return new Response(job.room.slice().buffer, {
    headers: {
      ...PRIVATE_NO_STORE,
      "Content-Type": job.mimeType,
    },
  });
}
