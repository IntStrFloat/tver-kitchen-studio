import { NextRequest, NextResponse } from "next/server";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_IDS = process.env.TELEGRAM_CHAT_IDS?.split(",")
  .map((id) => id.trim())
  .filter(Boolean);

async function sendTelegramMessage(chatId: string, text: string) {
  const res = await fetch(
    `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
      }),
    },
  );
  return res.json();
}

export async function POST(req: NextRequest) {
  try {
    if (!BOT_TOKEN || !CHAT_IDS?.length) {
      return NextResponse.json(
        { error: "Telegram not configured" },
        { status: 500 },
      );
    }

    const body = await req.json();
    const { phone, name, source, details } = body as {
      phone: string;
      name?: string;
      source: string;
      details?: Record<string, string>;
    };

    if (!phone || !source) {
      return NextResponse.json(
        { error: "phone and source are required" },
        { status: 400 },
      );
    }

    const lines: string[] = [
      `<b>📩 Новая заявка с сайта</b>`,
      ``,
      `<b>Источник:</b> ${source}`,
    ];

    if (name) {
      lines.push(`<b>Имя:</b> ${name}`);
    }

    lines.push(`<b>Телефон:</b> ${phone}`);

    if (details && Object.keys(details).length > 0) {
      lines.push(``);
      lines.push(`<b>Детали:</b>`);
      for (const [key, value] of Object.entries(details)) {
        lines.push(`  • ${key}: ${value}`);
      }
    }

    const message = lines.join("\n");

    const results = await Promise.allSettled(
      CHAT_IDS.map((chatId) => sendTelegramMessage(chatId, message)),
    );

    const failed = results.filter((r) => r.status === "rejected");
    if (failed.length === results.length) {
      return NextResponse.json(
        { error: "Failed to send to all recipients" },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
