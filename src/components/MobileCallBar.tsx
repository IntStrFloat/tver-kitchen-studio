"use client";

import { useState } from "react";
import { Phone, MessageSquareText } from "lucide-react";
import { SITE_CONFIG } from "@/lib/seo";
import CallbackModal from "./CallbackModal";

/**
 * Липкая нижняя панель быстрой связи для мобильных (lg:hidden).
 * Главный путь к звонку с телефона: всегда видимая кнопка «Позвонить»
 * (tel:) + «Заказать звонок» (форма обратного звонка).
 */
const MobileCallBar = () => {
  const [isCallbackOpen, setIsCallbackOpen] = useState(false);

  return (
    <>
      <div
        className="fixed bottom-0 left-0 right-0 z-50 lg:hidden grid grid-cols-2 gap-2 p-3 bg-card/95 backdrop-blur border-t border-border shadow-[0_-4px_20px_rgba(0,0,0,0.08)]"
        style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
      >
        <a
          href={`tel:${SITE_CONFIG.phoneClean}`}
          className="flex items-center justify-center gap-2 h-12 rounded-xl bg-primary text-primary-foreground font-semibold text-sm"
          aria-label={`Позвонить: ${SITE_CONFIG.phone.replace(/-/g, " ")}`}
        >
          <Phone className="w-4 h-4" aria-hidden="true" />
          Позвонить
        </a>
        <button
          onClick={() => setIsCallbackOpen(true)}
          className="flex items-center justify-center gap-2 h-12 rounded-xl border-2 border-border bg-background font-semibold text-sm"
        >
          <MessageSquareText className="w-4 h-4 text-primary" aria-hidden="true" />
          Заказать звонок
        </button>
      </div>

      <CallbackModal
        isOpen={isCallbackOpen}
        onClose={() => setIsCallbackOpen(false)}
      />
    </>
  );
};

export default MobileCallBar;
