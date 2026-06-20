import { getDevelopmentJobStore, isTryOnDevelopmentEnabled } from "../../../../../../features/try-on/job-api.ts";

const PRIVATE_NO_STORE = { "Cache-Control": "private, no-store" };

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
): Promise<Response> {
  if (!isTryOnDevelopmentEnabled()) {
    return Response.json({ error: "not_configured" }, { status: 503, headers: PRIVATE_NO_STORE });
  }

  const { id } = await context.params;
  const result = getDevelopmentJobStore().getResult(id);
  if (!result) {
    return Response.json({ error: "not_found" }, { status: 404, headers: PRIVATE_NO_STORE });
  }

  return new Response(result.bytes.buffer as ArrayBuffer, {
    headers: {
      ...PRIVATE_NO_STORE,
      "Content-Type": result.mimeType,
    },
  });
}
