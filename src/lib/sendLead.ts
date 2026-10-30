// Заявки с сайта отправляются напрямую из браузера в Web3Forms (form-backend)
// по порту 443, т.к. хостер блокирует исходящий SMTP, а бесплатный тариф
// Web3Forms требует client-side вызов (server-side отдаёт 403).
//
// Ключ Web3Forms — ПУБЛИЧНЫЙ (предназначен для использования в коде браузера).
// Письма уходят на адрес, на который зарегистрирован ключ на web3forms.com.
// Чтобы сменить почту-получателя — создайте новый ключ и замените значение ниже.
const WEB3FORMS_ACCESS_KEY = "b1113123-c7ed-448a-a6bd-8549cf3925db";
const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";

export interface LeadInput {
  phone: string;
  name?: string;
  source: string;
  details?: Record<string, string>;
}

export function getPhoneError(phone: string): string | undefined {
  const value = phone.trim();
  const digits = value.replace(/\D/g, "");
  if (!/^\+?[\d\s()-]+$/.test(value) || digits.length < 7 || digits.length > 15) {
    return "Укажите телефон: от 7 до 15 цифр, можно с кодом страны.";
  }
}

/** Отправляет заявку в Web3Forms. Вызывается только из клиентских компонентов. */
export async function sendLead(lead: LeadInput): Promise<void> {
  const phoneError = getPhoneError(lead.phone);
  if (phoneError) throw new Error(phoneError);
  const payload: Record<string, string> = {
    access_key: WEB3FORMS_ACCESS_KEY,
    subject: `Новая заявка с сайта — ${lead.source}`,
    from_name: "Кухни Тверь — сайт",
    Источник: lead.source,
  };
  if (lead.name?.trim()) payload["Имя"] = lead.name.trim();
  payload["Телефон"] = lead.phone.trim();
  if (lead.details) {
    for (const [key, value] of Object.entries(lead.details)) {
      payload[key] = String(value);
    }
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20_000);
  try {
    const res = await fetch(WEB3FORMS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    const data = (await res.json().catch(() => null)) as
      | { success?: boolean; message?: string }
      | null;

    if (!res.ok || data?.success !== true) {
      throw new Error(`Web3Forms ${res.status}: заявка не подтверждена`);
    }
  } finally { clearTimeout(timeout); }
}
