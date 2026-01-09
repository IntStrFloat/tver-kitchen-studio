import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  const [submitted, setSubmitted] = useState(false);

  if (!kitchen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setPhone("");
      onClose();
    }, 2000);
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
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-3xl bg-card rounded-3xl overflow-hidden shadow-elevated max-h-[90vh] overflow-y-auto"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-card/80 backdrop-blur-sm hover:bg-card transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid md:grid-cols-2">
              {/* Image */}
              <div className="aspect-square md:aspect-auto">
                <img
                  src={kitchen.image}
                  alt={kitchen.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="p-6 md:p-8">
                {!submitted ? (
                  <>
                    <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                      {kitchen.price}
                    </span>
                    <h3 className="text-2xl md:text-3xl font-bold mb-3">
                      Кухня «{kitchen.name}»
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      {kitchen.description}
                    </p>

                    <div className="mb-6">
                      <h4 className="font-semibold mb-3">Материалы:</h4>
                      <ul className="space-y-2">
                        {kitchen.materials.map((material, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm">
                            <Check className="w-4 h-4 text-primary flex-shrink-0" />
                            {material}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <p className="font-medium">
                        Рассчитать по моим размерам:
                      </p>
                      <input
                        type="tel"
                        placeholder="+7 (___) ___-__-__"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        className="premium-input"
                      />
                      <Button type="submit" className="w-full" size="lg">
                        Хочу такую кухню
                      </Button>
                      <p className="text-xs text-center text-muted-foreground">
                        Перезвоним в течение 15 минут и рассчитаем точную стоимость
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
                    <h3 className="text-2xl font-bold mb-2">Заявка отправлена!</h3>
                    <p className="text-muted-foreground">
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
