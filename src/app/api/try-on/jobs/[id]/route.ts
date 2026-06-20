import { getDevelopmentJobStore, isTryOnDevelopmentEnabled } from "../../../../../features/try-on/job-api.ts";
import { toPublicJobView } from "../../../../../features/try-on/job-store.ts";

const PRIVATE_NO_STORE = { "Cache-Control": "private, no-store" };

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
): Promise<Response> {
  if (!isTryOnDevelopmentEnabled()) {
    return Response.json({ error: "not_configured" }, { status: 503, headers: PRIVATE_NO_STORE });
  }

  const { id } = await context.params;
  const job = getDevelopmentJobStore().getView(id);
  if (!job) {
    return Response.json({ error: "not_found" }, { status: 404, headers: PRIVATE_NO_STORE });
  }

  return Response.json(toPublicJobView(job), { headers: PRIVATE_NO_STORE });
}
