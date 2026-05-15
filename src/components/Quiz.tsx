"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Gift, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const steps = [
  {
    id: 1,
    question: "Какая форма кухни вам нужна?",
    options: [
      { id: "l-shape", label: "Угловая (Г-образная)", icon: "⌐" },
      { id: "straight", label: "Прямая", icon: "—" },
      { id: "u-shape", label: "П-образная", icon: "⊓" },
      { id: "island", label: "С островом", icon: "▫" },
    ],
  },
  {
    id: 2,
    question: "Какая примерная длина кухни?",
    options: [
      { id: "small", label: "До 2.5 метров", icon: "📏" },
      { id: "medium", label: "2.5 - 4 метра", icon: "📐" },
      { id: "large", label: "4 - 6 метров", icon: "📊" },
      { id: "xlarge", label: "Более 6 метров", icon: "📈" },
    ],
  },
  {
    id: 3,
    question: "Какой бюджет планируете?",
    options: [
      { id: "economy", label: "До 150 000 ₽", icon: "💰" },
      { id: "standard", label: "150 000 - 300 000 ₽", icon: "💎" },
      { id: "premium", label: "300 000 - 500 000 ₽", icon: "👑" },
      { id: "luxury", label: "Более 500 000 ₽", icon: "🏆" },
    ],
  },
];

const Quiz = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (stepId: number, optionId: string) => {
    setAnswers({ ...answers, [stepId]: optionId });
    if (currentStep < steps.length) {
      setTimeout(() => setCurrentStep(currentStep + 1), 300);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    const answerLabels: Record<string, string> = {};
    for (const step of steps) {
      const selectedId = answers[step.id];
      if (selectedId) {
        const option = step.options.find((o) => o.id === selectedId);
        answerLabels[step.question] = option?.label ?? selectedId;
      }
    }

    try {
      await fetch("/api/telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone,
          source: "Квиз — расчёт стоимости",
          details: answerLabels,
        }),
      });
    } catch {
      // не блокируем UX при ошибке отправки
    }
  };

  const isLastStep = currentStep === steps.length;

  return (
    <section id="quiz" className="section-padding">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-accent-foreground mb-4">
              <Gift className="w-4 h-4" />
              <span className="text-sm font-medium">+ Подарок за прохождение</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ответьте на 4 вопроса
            </h2>
            <p className="text-muted-foreground">
              Получите предварительный расчёт стоимости кухни
            </p>
          </div>

          {/* Progress */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {[...steps, { id: 4 }].map((step, index) => (
              <div
                key={step.id}
                className={`quiz-step ${
                  index < currentStep
                    ? "completed"
                    : index === currentStep
                    ? "active"
                    : "pending"
                }`}
              />
            ))}
          </div>

          {/* Quiz Card */}
          <div className="premium-card p-6 md:p-10">
            <AnimatePresence mode="wait">
              {!submitted ? (
                currentStep < steps.length ? (
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-xl md:text-2xl font-semibold mb-6 text-center">
                      {steps[currentStep].question}
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      {steps[currentStep].options.map((option) => (
                        <button
                          key={option.id}
                          onClick={() => handleSelect(steps[currentStep].id, option.id)}
                          className={`p-5 rounded-2xl border-2 transition-all duration-200 text-left hover:border-primary hover:bg-accent ${
                            answers[steps[currentStep].id] === option.id
                              ? "border-primary bg-accent"
                              : "border-border"
                          }`}
                        >
                          <span className="text-2xl mb-2 block">{option.icon}</span>
                          <span className="font-medium">{option.label}</span>
                        </button>
                      ))}
                    </div>

                    {currentStep > 0 && (
                      <button
                        onClick={() => setCurrentStep(currentStep - 1)}
                        className="flex items-center gap-2 mt-6 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Назад
                      </button>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="phone"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="text-center"
                  >
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                      <Gift className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-semibold mb-2">
                      Отлично! Почти готово
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Оставьте номер телефона и получите расчёт стоимости
                    </p>

                    <form onSubmit={handleSubmit} className="max-w-sm mx-auto space-y-4">
                      <input
                        type="tel"
                        placeholder="+7 (___) ___-__-__"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        className="premium-input text-center"
                      />
                      <Button type="submit" size="lg" className="w-full group">
                        Получить расчёт
                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </Button>
                      <p className="text-xs text-muted-foreground">
                        Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности
                      </p>
                    </form>

                    <button
                      onClick={() => setCurrentStep(currentStep - 1)}
                      className="flex items-center gap-2 mt-6 mx-auto text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Назад
                    </button>
                  </motion.div>
                )
              ) : (
                <motion.div
                  key="success"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center mx-auto mb-6">
                    <Check className="w-10 h-10 text-primary-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Спасибо!</h3>
                  <p className="text-muted-foreground mb-4">
                    Мы перезвоним вам в течение 15 минут и пришлём расчёт удобным способом — Max или SMS
                  </p>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-accent-foreground">
                    <Gift className="w-4 h-4" />
                    <span className="text-sm font-medium">Мы скоро свяжемся с вами!</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Quiz;
