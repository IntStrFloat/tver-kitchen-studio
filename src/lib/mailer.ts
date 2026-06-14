export interface LeadInput {
  phone: string;
  name?: string;
  source: string;
  details?: Record<string, string>;
}

interface MailConfig {
  apiKey?: string;
  fromEmail?: string;
  fromName: string;
  to: string[];
}

// Хостер блокирует исходящий SMTP (порты 25/465/587/2525), поэтому письма
// отправляются через HTTP-API Brevo по порту 443.
const BREVO_ENDPOINT = "https://api.brevo.com/v3/smtp/email";

/**
 * Читает конфигурацию из переменных окружения при каждом вызове,
 * чтобы значения, заданные systemd (EnvironmentFile) на проде, всегда
 * подхватывались актуальными.
 */
function getConfig(): MailConfig {
  return {
    apiKey: process.env.BREVO_API_KEY,
    fromEmail: process.env.MAIL_FROM,
    fromName: process.env.MAIL_FROM_NAME || "Кухни Тверь — заявки с сайта",
    to: (process.env.MAIL_TO ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
  };
}

/** Проверяет, что заданы все обязательные переменные для отправки почты. */
export function isMailConfigured(): boolean {
  const c = getConfig();
  return Boolean(c.apiKey && c.fromEmail && c.to.length);
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatTimestamp(): string {
  return new Intl.DateTimeFormat("ru-RU", {
    timeZone: "Europe/Moscow",
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date());
}

function buildText(lead: LeadInput, timestamp: string): string {
  const lines = ["Новая заявка с сайта", "", `Источник: ${lead.source}`];
  if (lead.name) lines.push(`Имя: ${lead.name}`);
  lines.push(`Телефон: ${lead.phone}`);
  if (lead.details) {
    const entries = Object.entries(lead.details);
    if (entries.length) {
      lines.push("", "Детали:");
      for (const [key, value] of entries) lines.push(`  • ${key}: ${value}`);
    }
  }
  lines.push("", `Отправлено: ${timestamp} (МСК)`);
  return lines.join("\n");
}

function htmlRow(label: string, value: string): string {
  return `<tr>
    <td style="padding:6px 12px;color:#6b7280;white-space:nowrap;vertical-align:top">${escapeHtml(
      label,
    )}</td>
    <td style="padding:6px 12px;color:#111827;font-weight:600">${escapeHtml(
      value,
    )}</td>
  </tr>`;
}

function buildHtml(lead: LeadInput, timestamp: string): string {
  const phoneHref = lead.phone.replace(/[^+\d]/g, "");
  const rows = [htmlRow("Источник", lead.source)];
  if (lead.name) rows.push(htmlRow("Имя", lead.name));
  rows.push(
    `<tr>
      <td style="padding:6px 12px;color:#6b7280;white-space:nowrap;vertical-align:top">Телефон</td>
      <td style="padding:6px 12px"><a href="tel:${escapeHtml(
        phoneHref,
      )}" style="color:#111827;font-weight:600;text-decoration:none">${escapeHtml(
        lead.phone,
      )}</a></td>
    </tr>`,
  );
  if (lead.details) {
    for (const [key, value] of Object.entries(lead.details)) {
      rows.push(htmlRow(key, String(value)));
    }
  }

  return `<!doctype html>
<html lang="ru">
<body style="margin:0;background:#f3f4f6;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif">
  <div style="max-width:560px;margin:0 auto;padding:24px">
    <div style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1)">
      <div style="background:#111827;color:#ffffff;padding:20px 24px;font-size:18px;font-weight:700">
        📩 Новая заявка с сайта
      </div>
      <table style="width:100%;border-collapse:collapse;font-size:15px;line-height:1.5;margin:16px 0">
        ${rows.join("\n")}
      </table>
      <div style="padding:12px 24px 20px;color:#9ca3af;font-size:13px;border-top:1px solid #f3f4f6">
        Отправлено: ${escapeHtml(timestamp)} (МСК)
      </div>
    </div>
  </div>
</body>
</html>`;
}

/** Отправляет заявку через HTTP-API Brevo на адреса из MAIL_TO. */
export async function sendLeadEmail(lead: LeadInput): Promise<void> {
  const c = getConfig();
  const timestamp = formatTimestamp();

  const res = await fetch(BREVO_ENDPOINT, {
    method: "POST",
    headers: {
      "api-key": c.apiKey as string,
      "content-type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify({
      sender: { email: c.fromEmail, name: c.fromName },
      to: c.to.map((email) => ({ email })),
      subject: `Новая заявка с сайта — ${lead.source}`,
      htmlContent: buildHtml(lead, timestamp),
      textContent: buildText(lead, timestamp),
    }),
    // Быстрый отказ вместо зависания запроса, если API недоступен.
    signal: AbortSignal.timeout(15000),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Brevo API ${res.status}: ${body.slice(0, 500)}`);
  }
}
