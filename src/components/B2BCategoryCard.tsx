"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  MapPin,
  X,
  ZoomIn,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export interface B2BExample {
  title: string;
  description: string;
  image: string;
  location: string;
}

export interface B2BCategory {
  title: string;
  description: string;
  features: string[];
  icon: string;
  examples: B2BExample[];
}

interface B2BCategoryCardProps {
  category: B2BCategory;
  index: number;
}

/* ─── Fullscreen lightbox ─── */
const Lightbox = ({
  examples,
  currentIndex,
  onClose,
  onPrev,
  onNext,
  onJump,
}: {
  examples: B2BExample[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  onJump: (index: number) => void;
}) => {
  const example = examples[currentIndex];

  /* keyboard navigation */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, onPrev, onNext]);

  /* lock body scroll */
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center"
    >
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-foreground/80 backdrop-blur-md"
        onClick={onClose}
      />

      {/* close */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-card/90 backdrop-blur-sm hover:bg-card transition-colors shadow-lg"
        aria-label="Закрыть"
      >
        <X className="w-6 h-6" />
      </button>

      {/* counter */}
      <div className="absolute top-5 left-1/2 -translate-x-1/2 z-10 px-4 py-1.5 rounded-full bg-card/90 backdrop-blur-sm text-sm font-medium shadow-lg">
        {currentIndex + 1} / {examples.length}
      </div>

      {/* prev */}
      {examples.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
          className="absolute left-3 md:left-6 z-10 p-2.5 rounded-full bg-card/90 backdrop-blur-sm hover:bg-card transition-colors shadow-lg"
          aria-label="Предыдущий"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {/* next */}
      {examples.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          className="absolute right-3 md:right-6 z-10 p-2.5 rounded-full bg-card/90 backdrop-blur-sm hover:bg-card transition-colors shadow-lg"
          aria-label="Следующий"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* content */}
      <div
        className="relative z-10 w-full max-w-5xl mx-4 flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            <div className="relative w-full rounded-2xl overflow-hidden shadow-elevated bg-card">
              <div className="relative w-full" style={{ aspectRatio: "16/10" }}>
                <Image
                  src={example.image}
                  alt={example.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1280px) 95vw, 1200px"
                  priority
                />
              </div>

              <div className="p-5 md:p-6">
                <h3 className="text-lg md:text-xl font-bold mb-1">
                  {example.title}
                </h3>
                <p className="text-muted-foreground text-sm md:text-base mb-2">
                  {example.description}
                </p>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  {example.location}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* thumbnail strip */}
        {examples.length > 1 && (
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2 max-w-full px-1">
            {examples.map((ex, i) => (
              <button
                key={i}
                onClick={() => onJump(i)}
                className={`relative flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden border-2 transition-all ${
                  i === currentIndex
                    ? "border-primary ring-2 ring-primary/30"
                    : "border-transparent opacity-60 hover:opacity-100"
                }`}
                aria-label={`Перейти к ${ex.title}`}
              >
                <Image
                  src={ex.image}
                  alt={ex.title}
                  fill
                  className="object-cover"
                  sizes="80px"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

/* ─── Main card ─── */
const B2BCategoryCard = ({ category, index }: B2BCategoryCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (i: number) => setLightboxIndex(i);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  const goPrev = useCallback(() => {
    setLightboxIndex((prev) =>
      prev === null
        ? null
        : prev === 0
          ? category.examples.length - 1
          : prev - 1,
    );
  }, [category.examples.length]);

  const goNext = useCallback(() => {
    setLightboxIndex((prev) =>
      prev === null
        ? null
        : prev === category.examples.length - 1
          ? 0
          : prev + 1,
    );
  }, [category.examples.length]);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="premium-card overflow-hidden"
      >
        {/* Main card content */}
        <div className="p-8">
          <div className="text-4xl mb-4">{category.icon}</div>
          <h2 className="text-2xl font-bold mb-3">{category.title}</h2>
          <p className="text-muted-foreground mb-6">{category.description}</p>
          <ul className="space-y-3 mb-6">
            {category.features.map((feature, i) => (
              <li key={i} className="flex items-center gap-3">
                <svg
                  className="w-5 h-5 text-primary flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-sm">{feature}</span>
              </li>
            ))}
          </ul>

          <Button
            variant="outline"
            onClick={() => setIsOpen(!isOpen)}
            className="w-full group"
          >
            <Eye className="w-4 h-4 mr-2" />
            {isOpen ? "Скрыть примеры" : "Смотреть примеры работ"}
            <ChevronDown
              className={`w-4 h-4 ml-2 transition-transform duration-300 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </Button>
        </div>

        {/* Expandable examples section */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="border-t border-border bg-secondary/20 p-6">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-4">
                  Примеры реализованных проектов
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {category.examples.map((example, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.08 }}
                      className="group rounded-2xl overflow-hidden bg-card border border-border/50 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => openLightbox(i)}
                      role="button"
                      tabIndex={0}
                      aria-label={`Открыть ${example.title}`}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          openLightbox(i);
                        }
                      }}
                    >
                      <div className="aspect-[4/3] relative overflow-hidden">
                        <Image
                          src={example.image}
                          alt={example.title}
                          width={400}
                          height={300}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                          sizes="(max-width: 640px) 100vw, 50vw"
                        />
                        {/* Hover overlay with zoom icon */}
                        <div className="absolute inset-0 bg-foreground/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="w-12 h-12 rounded-full bg-card/90 flex items-center justify-center shadow-lg">
                            <ZoomIn className="w-5 h-5 text-foreground" />
                          </div>
                        </div>
                      </div>
                      <div className="p-4">
                        <h4 className="font-semibold text-sm mb-1">
                          {example.title}
                        </h4>
                        <p className="text-xs text-muted-foreground mb-2">
                          {example.description}
                        </p>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <MapPin className="w-3 h-3" />
                          {example.location}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Fullscreen lightbox portal */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            examples={category.examples}
            currentIndex={lightboxIndex}
            onClose={closeLightbox}
            onPrev={goPrev}
            onNext={goNext}
            onJump={(i) => setLightboxIndex(i)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default B2BCategoryCard;
