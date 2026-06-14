import nodemailer, { type Transporter } from "nodemailer";

export interface LeadInput {
  phone: string;
  name?: string;
  source: string;
  details?: Record<string, string>;
}

interface MailConfig {
  host?: string;
  port: number;
  secure: boolean;
  user?: string;
  pass?: string;
  from?: string;
  to: string[];
}

/**
 * Читает SMTP-конфигурацию из переменных окружения при каждом вызове,
 * чтобы значения, заданные systemd (EnvironmentFile) на проде, всегда
 * подхватывались актуальными.
 */
function getConfig(): MailConfig {
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 465;
  const user = process.env.SMTP_USER;
  return {
    host: process.env.SMTP_HOST,
    port,
    // SMTP_SECURE опционален: по умолчанию true для 465 (implicit TLS),
    // false для 587 (STARTTLS).
    secure: process.env.SMTP_SECURE
      ? process.env.SMTP_SECURE.toLowerCase() === "true"
      : port === 465,
    user,
    pass: process.env.SMTP_PASS,
    from: process.env.MAIL_FROM || user,
    to: (process.env.MAIL_TO ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
  };
}

/** Проверяет, что заданы все обязательные переменные для отправки почты. */
export function isMailConfigured(): boolean {
  const c = getConfig();
  return Boolean(c.host && c.user && c.pass && c.from && c.to.length);
}

let transporter: Transporter | null = null;

function getTransporter(): Transporter {
  if (!transporter) {
    const c = getConfig();
    transporter = nodemailer.createTransport({
      host: c.host,
      port: c.port,
      secure: c.secure,
      auth: { user: c.user, pass: c.pass },
    });
  }
  return transporter;
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

/** Отправляет заявку на почту, заданную в MAIL_TO. */
export async function sendLeadEmail(lead: LeadInput): Promise<void> {
  const c = getConfig();
  const timestamp = formatTimestamp();

  await getTransporter().sendMail({
    from: c.from,
    to: c.to,
    subject: `Новая заявка с сайта — ${lead.source}`,
    text: buildText(lead, timestamp),
    html: buildHtml(lead, timestamp),
  });
}
