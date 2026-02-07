import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

const WhatsAppButton = () => {
  return (
    <motion.a
      href="https://wa.me/79036302909?text=Здравствуйте! Хочу узнать стоимость кухни"
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: "spring", stiffness: 200 }}
      className="whatsapp-float animate-pulse"
      aria-label="Написать в WhatsApp"
    >
      <MessageCircle className="w-7 h-7 text-whatsapp-foreground" />
    </motion.a>
  );
};

export default WhatsAppButton;
