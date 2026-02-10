"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, MessageCircle, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import CallbackModal from "./CallbackModal";

const navItems = [
  { label: "Каталог", href: "/catalog" },
  { label: "Наши работы", href: "/portfolio" },
  { label: "Цены", href: "/price" },
  { label: "О нас", href: "/about" },
  { label: "Блог", href: "/blog" },
  { label: "Контакты", href: "/contacts" },
];

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCallbackOpen, setIsCallbackOpen] = useState(false);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 glass-header"
        role="banner"
      >
        <div className="container-custom">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <a
              href="/"
              className="flex items-center gap-2"
              aria-label="TverKuhni — на главную"
            >
              <span className="text-xl md:text-2xl font-bold text-primary">
                TverKuhni
              </span>
            </a>

            {/* Desktop Navigation */}
            <nav
              className="hidden lg:flex items-center gap-8"
              aria-label="Основная навигация"
            >
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors duration-200"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-4">
              <a
                href="tel:+79036302909"
                className="flex items-center gap-2 text-sm font-medium"
                aria-label="Позвонить: +7 903 630 29 09"
              >
                <Phone className="w-4 h-4 text-primary" aria-hidden="true" />
                +7 903 630 29 09
              </a>
              <a
                href="https://wa.me/79036302909"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-whatsapp flex items-center justify-center text-whatsapp-foreground hover:opacity-90 transition-opacity"
                aria-label="Написать в WhatsApp"
              >
                <MessageCircle className="w-5 h-5" aria-hidden="true" />
              </a>
              <Button onClick={() => setIsCallbackOpen(true)}>
                Заказать звонок
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2"
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? "Закрыть меню" : "Открыть меню"}
              aria-expanded={isOpen}
            >
              {isOpen ? (
                <X className="w-6 h-6" aria-hidden="true" />
              ) : (
                <Menu className="w-6 h-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-card border-t"
            >
              <nav
                className="container-custom py-4 space-y-4"
                aria-label="Мобильная навигация"
              >
                {navItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="block py-2 text-foreground/80 hover:text-primary transition-colors"
                  >
                    {item.label}
                  </a>
                ))}
                <div className="pt-4 border-t space-y-3">
                  <a
                    href="tel:+79036302909"
                    className="flex items-center gap-2 font-medium"
                    aria-label="Позвонить: +7 903 630 29 09"
                  >
                    <Phone
                      className="w-4 h-4 text-primary"
                      aria-hidden="true"
                    />
                    +7 903 630 29 09
                  </a>
                  <Button
                    onClick={() => {
                      setIsCallbackOpen(true);
                      setIsOpen(false);
                    }}
                    className="w-full"
                  >
                    Заказать звонок
                  </Button>
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <CallbackModal
        isOpen={isCallbackOpen}
        onClose={() => setIsCallbackOpen(false)}
      />
    </>
  );
};

export default Header;
