"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE_CONFIG } from "@/lib/seo";
import { GOALS, trackGoal } from "@/lib/analytics";

interface CallbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Status = "idle" | "sending" | "success" | "error";

const phoneDisplay = SITE_CONFIG.phone.replace(/-/g, " ");

const CallbackModal = ({ isOpen, onClose }: CallbackModalProps) => {
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  const reset = () => {
    setStatus("idle");
    setPhone("");
    setName("");
  };

  const handleClose = () => {
    onClose();
    // сбрасываем форму после закрытия, чтобы анимация выхода прошла чисто
    setTimeout(reset, 200);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone,
          name,
          source: "Заказать звонок (шапка сайта)",
        }),
      });

      if (!res.ok) throw new Error(`Request failed: ${res.status}`);

      trackGoal(GOALS.callbackRequest);
      setStatus("success");
      setTimeout(handleClose, 2500);
    } catch {
      setStatus("error");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-foreground/50 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-md bg-card rounded-3xl p-8 shadow-elevated"
          >
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors"
              aria-label="Закрыть"
            >
              <X className="w-5 h-5" />
            </button>

            {status === "success" ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center py-8"
              >
                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-primary-foreground"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-2">Спасибо!</h3>
                <p className="text-muted-foreground">Мы скоро перезвоним вам</p>
              </motion.div>
            ) : status === "error" ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8 text-destructive" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Не удалось отправить</h3>
                <p className="text-muted-foreground mb-6">
                  Что-то пошло не так. Позвоните нам напрямую — ответим сразу.
                </p>
                <a href={`tel:${SITE_CONFIG.phoneClean}`} className="block">
                  <Button className="w-full" size="lg">
                    <Phone className="w-5 h-5" />
                    Позвонить {phoneDisplay}
                  </Button>
                </a>
                <button
                  onClick={() => setStatus("idle")}
                  className="mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Попробовать ещё раз
                </button>
              </div>
            ) : (
              <>
                <div className="text-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Phone className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Заказать звонок</h3>
                  <p className="text-muted-foreground">
                    Оставьте заявку и мы перезвоним вам в течение 15 минут
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Ваше имя"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="premium-input"
                  />
                  <input
                    type="tel"
                    placeholder="+7 (___) ___-__-__"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="premium-input"
                  />
                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={status === "sending"}
                  >
                    {status === "sending" ? "Отправляем…" : "Жду звонка"}
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">
                    Нажимая кнопку, вы соглашаетесь с{" "}
                    <a
                      href="/privacy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                    >
                      политикой конфиденциальности
                    </a>
                  </p>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CallbackModal;
