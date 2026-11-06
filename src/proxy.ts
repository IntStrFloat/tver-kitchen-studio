import { NextResponse, type NextRequest } from "next/server";
import { prefersMarkdown } from "@/lib/accept";
import { homepageMarkdown } from "@/lib/homepage-markdown";
import { SITE_CONFIG } from "@/lib/seo";

export function proxy(request: NextRequest) {
  if (request.method !== "GET" && request.method !== "HEAD") {
    return NextResponse.next();
  }

  const headers = new Headers({
    Link: `<${SITE_CONFIG.url}/llms.txt>; rel="describedby"; type="text/plain"`,
  });

  if (!prefersMarkdown(request.headers.get("accept"))) {
    return NextResponse.next({ headers });
  }

  headers.set("Vary", "Accept, RSC");
  headers.set("Content-Type", "text/markdown; charset=utf-8");
  headers.set("Cache-Control", "no-cache");
  return new NextResponse(request.method === "HEAD" ? null : homepageMarkdown, { headers });
}

export const config = {
  matcher: [{
    source: "/",
    // Next.js strips the RSC header before calling proxy(). Match it here.
    missing: [{ type: "header", key: "rsc", value: "1" }],
  }],
};
