"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getPhoneError, sendLead } from "@/lib/sendLead";
import { GOALS, trackGoal } from "@/lib/analytics";
import { useLeadDialog } from "@/hooks/use-lead-dialog";

interface Kitchen {
  id: number;
  name: string;
  price: string;
  image: string;
  description: string;
  materials: string[];
}

interface CatalogModalProps {
  kitchen: Kitchen | null;
  isOpen: boolean;
  onClose: () => void;
}

const CatalogModal = ({ kitchen, isOpen, onClose }: CatalogModalProps) => {
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [phoneError, setPhoneError] = useState<string>();
  const handleClose = () => {
    if (status === "sending") return;
    onClose();
    setStatus("idle");
    setPhone("");
    setPhoneError(undefined);
  };
  const dialogRef = useLeadDialog(isOpen, handleClose);

  if (!kitchen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;
    const error = getPhoneError(phone);
    setPhoneError(error);
    if (error) return;
    setStatus("sending");

    try {
      await sendLead({
        phone,
        source: "Каталог — карточка кухни",
        details: {
          Кухня: kitchen.name,
          ...(kitchen.price ? { Цена: kitchen.price } : {}),
          Описание: kitchen.description,
          Материалы: kitchen.materials.join(", "),
        },
      });
      setStatus("success");
      trackGoal(GOALS.catalogLead);
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
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="catalog-dialog-title"
            tabIndex={-1}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-3xl bg-card rounded-3xl overflow-hidden shadow-elevated max-h-[90vh] overflow-y-auto"
          >
            <button
              onClick={handleClose}
              type="button"
              disabled={status === "sending"}
              aria-label="Закрыть карточку кухни"
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-card/80 backdrop-blur-sm hover:bg-card transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid md:grid-cols-2">
              {/* Image */}
              <div className="aspect-square md:aspect-auto">
                <Image
                  src={kitchen.image}
                  alt={`Кухня «${kitchen.name}» на заказ в Твери — Kuhnitver`}
                  className="w-full h-full object-cover"
                  width={600}
                  height={600}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>

              {/* Content */}
              <div className="p-6 md:p-8">
                {status !== "success" ? (
                  <>
                    {kitchen.price && (
                      <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                        {kitchen.price}
                      </span>
                    )}
                    <h3 id="catalog-dialog-title" className="text-2xl md:text-3xl font-bold mb-3">
                      Кухня «{kitchen.name}»
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      {kitchen.description}
                    </p>

                    <div className="mb-6">
                      <h4 className="font-semibold mb-3">Материалы:</h4>
                      <ul className="space-y-2">
                        {kitchen.materials.map((material, index) => (
                          <li
                            key={index}
                            className="flex items-center gap-2 text-sm"
                          >
                            <Check className="w-4 h-4 text-primary flex-shrink-0" />
                            {material}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <form method="post" onSubmit={handleSubmit} className="space-y-4" aria-busy={status === "sending"}>
                      <p className="font-medium">
                        Получить предварительный расчёт по моим размерам:
                      </p>
                      <label htmlFor="catalog-phone" className="block text-sm font-medium">Телефон</label>
                      <input
                        id="catalog-phone"
                        name="phone"
                        autoComplete="tel"
                        inputMode="tel"
                        maxLength={30}
                        data-dialog-initial-focus
                        aria-invalid={Boolean(phoneError)}
                        aria-describedby={phoneError ? "catalog-phone-error" : undefined}
                        type="tel"
                        placeholder="+7 (___) ___-__-__"
                        value={phone}
                        onChange={(e) => { setPhone(e.target.value); setPhoneError(undefined); }}
                        onInvalid={() => setPhoneError("Укажите телефон для связи.")}
                        required
                        className="premium-input"
                      />
                      {phoneError && <p id="catalog-phone-error" role="alert" className="text-sm text-destructive">{phoneError}</p>}
                      {status === "error" && <p role="alert" className="text-sm text-destructive">Не удалось отправить заявку. Данные сохранены: попробуйте ещё раз.</p>}
                      <Button type="submit" className="w-full" size="lg" disabled={status === "sending"}>
                        {status === "sending" ? "Отправляем…" : "Получить предварительный расчёт"}
                      </Button>
                      <p role="status" className="sr-only">{status === "sending" ? "Дождитесь подтверждения отправки." : ""}</p>
                      <p className="text-xs text-center text-muted-foreground">
                        Менеджер уточнит размеры и комплектацию перед расчётом.
                        Отправляя форму, вы соглашаетесь с <a href="/privacy" className="underline">политикой конфиденциальности</a>.
                      </p>
                    </form>
                  </>
                ) : (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="h-full flex flex-col items-center justify-center text-center py-12"
                  >
                    <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mb-4">
                      <Check className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <h3 id="catalog-dialog-title" className="text-2xl font-bold mb-2">
                      Заявка отправлена!
                    </h3>
                    <p role="status" className="text-muted-foreground">
                      Мы скоро свяжемся с вами для расчёта
                    </p>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CatalogModal;
