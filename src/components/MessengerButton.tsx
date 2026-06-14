"use client";

import { motion } from "framer-motion";
import { Phone } from "lucide-react";
import { SITE_CONFIG } from "@/lib/seo";

// Плавающая кнопка быстрой связи: открывает диалер на основном номере.
// CSS-класс whatsapp-float сохранён для совместимости стилей (зелёная
// круглая плашка, пульсация). Mессенджер-deep-link не используется —
// в Max нет публичной ссылки на профиль по номеру, в WhatsApp решили
// не уходить. На мобильных скрыта — там показывается липкая нижняя
// панель MobileCallBar.
const MessengerButton = () => {
  return (
    <motion.a
      href={`tel:${SITE_CONFIG.phoneClean}`}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: "spring", stiffness: 200 }}
      className="whatsapp-float animate-pulse hidden lg:flex"
      aria-label={`Позвонить: ${SITE_CONFIG.phone.replace(/-/g, " ")}`}
    >
      <Phone className="w-7 h-7 text-whatsapp-foreground" />
    </motion.a>
  );
};

export default MessengerButton;
