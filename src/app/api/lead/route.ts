import { NextRequest, NextResponse } from "next/server";
import { isMailConfigured, sendLeadEmail } from "@/lib/mailer";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone, name, source, details } = body as {
      phone?: string;
      name?: string;
      source?: string;
      details?: Record<string, string>;
    };

    if (!phone || !source) {
      return NextResponse.json(
        { error: "phone and source are required" },
        { status: 400 },
      );
    }

    if (!isMailConfigured()) {
      console.error(
        "[lead] Почта не настроена — задайте BREVO_API_KEY, MAIL_FROM, MAIL_TO",
      );
      return NextResponse.json({ error: "Mail not configured" }, { status: 503 });
    }

    await sendLeadEmail({ phone, name, source, details });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[lead] Не удалось отправить заявку на почту:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
