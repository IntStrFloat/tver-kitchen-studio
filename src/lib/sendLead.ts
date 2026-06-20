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

/** Отправляет заявку в Web3Forms. Вызывается только из клиентских компонентов. */
export async function sendLead(lead: LeadInput): Promise<void> {
  const payload: Record<string, string> = {
    access_key: WEB3FORMS_ACCESS_KEY,
    subject: `Новая заявка с сайта — ${lead.source}`,
    from_name: "Кухни Тверь — сайт",
    Источник: lead.source,
  };
  if (lead.name) payload["Имя"] = lead.name;
  payload["Телефон"] = lead.phone;
  if (lead.details) {
    for (const [key, value] of Object.entries(lead.details)) {
      payload[key] = String(value);
    }
  }

  const res = await fetch(WEB3FORMS_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });

  const data = (await res.json().catch(() => null)) as
    | { success?: boolean; message?: string }
    | null;

  if (!res.ok || !data?.success) {
    throw new Error(
      `Web3Forms ${res.status}: ${data?.message ?? "неизвестная ошибка"}`,
    );
  }
}
