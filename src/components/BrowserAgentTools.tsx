"use client";

import { useEffect } from "react";
import { SITE_CONFIG } from "@/lib/seo";
import { cities, kitchenStyles, COMMERCIAL_TERMS } from "@/lib/data";

type Tool = {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  annotations: { readOnlyHint: true };
  execute: (input: Record<string, unknown>) => Promise<unknown>;
};

type ModelContext = {
  registerTool: (tool: Tool, options: { signal: AbortSignal }) => Promise<void>;
};

function validInput(input: unknown, allowedKeys: string[]): input is Record<string, unknown> {
  return input !== null && typeof input === "object" && !Array.isArray(input)
    && Object.keys(input).every((key) => allowedKeys.includes(key));
}

/** The prototype exposes public facts only. It cannot send a lead or read form data. */
export function getBrowserTools(): Tool[] {
  return [
    {
      name: "get_business_info",
      description: "Получить публичные контакты Kuhnitver и условия заказа со ссылками на страницы сайта.",
      inputSchema: { type: "object", properties: {}, additionalProperties: false },
      annotations: { readOnlyHint: true },
      async execute(input) {
        if (!validInput(input, [])) return { error: "Этот инструмент не принимает параметры." };
        return {
          name: SITE_CONFIG.name,
          phone: SITE_CONFIG.phone,
          messenger_phone: SITE_CONFIG.maxPhone,
          email: SITE_CONFIG.email,
          address: SITE_CONFIG.address,
          conditions: COMMERCIAL_TERMS,
          source_url: `${SITE_CONFIG.url}/contacts`,
          pricing_url: `${SITE_CONFIG.url}/price`,
        };
      },
    },
    {
      name: "get_service_area",
      description: "Узнать условия доставки Kuhnitver по выбранному городу или получить все зоны обслуживания.",
      inputSchema: {
        type: "object",
        properties: { city_slug: { type: "string", enum: cities.map((city) => city.slug) } },
        additionalProperties: false,
      },
      annotations: { readOnlyHint: true },
      async execute(input) {
        if (!validInput(input, ["city_slug"]) || (input.city_slug !== undefined && typeof input.city_slug !== "string")) {
          return { error: "Передайте city_slug из списка городов или пустой объект." };
        }
        const selected = input.city_slug === undefined ? cities : cities.filter((city) => city.slug === input.city_slug);
        if (!selected.length) return { error: "Город не найден. Уточните зону доставки у менеджера." };
        return {
          cities: selected.map((city) => ({
            name: city.name,
            delivery: city.deliveryCost,
            timing: city.deliveryTime,
            source_url: `${SITE_CONFIG.url}/kuhni/${city.slug}`,
          })),
          conditions: COMMERCIAL_TERMS.deliveryText,
          source_url: `${SITE_CONFIG.url}/dostavka`,
        };
      },
    },
    {
      name: "get_kitchen_options",
      description: "Получить стили кухонь, варианты материалов и условия индивидуального расчёта.",
      inputSchema: {
        type: "object",
        properties: { style_slug: { type: "string", enum: kitchenStyles.map((style) => style.slug) } },
        additionalProperties: false,
      },
      annotations: { readOnlyHint: true },
      async execute(input) {
        if (!validInput(input, ["style_slug"]) || (input.style_slug !== undefined && typeof input.style_slug !== "string")) {
          return { error: "Передайте style_slug из списка стилей или пустой объект." };
        }
        const selected = input.style_slug === undefined ? kitchenStyles : kitchenStyles.filter((style) => style.slug === input.style_slug);
        if (!selected.length) return { error: "Стиль не найден. Доступные варианты перечислены в каталоге." };
        return {
          styles: selected.map((style) => ({ name: style.name, materials: style.materials, features: style.features, source_url: `${SITE_CONFIG.url}/catalog/${style.slug}` })),
          pricing: COMMERCIAL_TERMS.pricingText,
          source_url: `${SITE_CONFIG.url}/catalog`,
        };
      },
    },
  ];
}

export default function BrowserAgentTools() {
  useEffect(() => {
    // Current WebMCP uses document.modelContext. No polyfill or cross-origin grant.
    const api = (document as Document & { modelContext?: ModelContext }).modelContext;
    if (!window.isSecureContext || typeof api?.registerTool !== "function") return;
    const controller = new AbortController();
    void (async () => {
      for (const tool of getBrowserTools()) {
        if (controller.signal.aborted) return;
        try { await api.registerTool(tool, { signal: controller.signal }); }
        catch { /* Preview APIs and permission policies must not affect the site. */ }
      }
    })();
    return () => controller.abort();
  }, []);
  return null;
}
