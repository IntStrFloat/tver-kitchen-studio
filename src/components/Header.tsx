"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE_CONFIG } from "@/lib/seo";
import CallbackModal from "./CallbackModal";

const navItems = [
  { label: "Каталог", href: "/catalog" },
  { label: "Наши работы", href: "/portfolio" },
  { label: "Цены", href: "/price" },
  { label: "Блог", href: "/blog" },
  { label: "Для бизнеса", href: "/b2b" },
  { label: "О нас", href: "/about" },
  { label: "Контакты", href: "/contacts" },
];

const phoneDisplay = SITE_CONFIG.phone.replace(/-/g, " ");

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
            <Link
              href="/"
              className="flex items-center gap-2"
              aria-label="Кухни Тверь — на главную"
            >
              <span className="text-xl md:text-2xl font-bold text-primary">
                Кухни Тверь
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav
              className="hidden lg:flex items-center gap-8"
              aria-label="Основная навигация"
            >
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors duration-200"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-4">
              <a
                href={`tel:${SITE_CONFIG.phoneClean}`}
                className="flex items-center gap-2 text-sm font-medium"
                aria-label={`Позвонить: ${phoneDisplay}`}
              >
                <Phone className="w-4 h-4 text-primary" aria-hidden="true" />
                {phoneDisplay}
              </a>
              <Button onClick={() => setIsCallbackOpen(true)}>
                Заказать звонок
              </Button>
            </div>

            {/* Mobile Actions: click-to-call + menu */}
            <div className="flex items-center gap-1 lg:hidden">
              <a
                href={`tel:${SITE_CONFIG.phoneClean}`}
                className="flex items-center justify-center w-10 h-10 rounded-full text-primary"
                aria-label={`Позвонить: ${phoneDisplay}`}
              >
                <Phone className="w-5 h-5" aria-hidden="true" />
              </a>
              <button
                className="p-2"
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
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="block py-2 text-foreground/80 hover:text-primary transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="pt-4 border-t space-y-3">
                  <a
                    href={`tel:${SITE_CONFIG.phoneClean}`}
                    className="flex items-center gap-2 font-medium"
                    aria-label={`Позвонить: ${phoneDisplay}`}
                  >
                    <Phone
                      className="w-4 h-4 text-primary"
                      aria-hidden="true"
                    />
                    {phoneDisplay}
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
