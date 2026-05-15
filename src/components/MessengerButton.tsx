"use client";

import { motion } from "framer-motion";
import { Phone } from "lucide-react";

// Плавающая кнопка быстрой связи: открывает диалер на основном номере.
// CSS-класс whatsapp-float сохранён для совместимости стилей (зелёная
// круглая плашка, пульсация). Mессенджер-deep-link не используется —
// в Max нет публичной ссылки на профиль по номеру, в WhatsApp решили
// не уходить.
const MessengerButton = () => {
  return (
    <motion.a
      href="tel:+79036302909"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: "spring", stiffness: 200 }}
      className="whatsapp-float animate-pulse"
      aria-label="Позвонить: +7 903 630 29 09"
    >
      <Phone className="w-7 h-7 text-whatsapp-foreground" />
    </motion.a>
  );
};

export default MessengerButton;
