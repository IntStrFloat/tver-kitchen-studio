"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

const Hero = () => {
  const handleSmoothScroll =
    (id: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
        history.replaceState(null, "", `#${id}`);
      }
    };

  return (
    <section
      className="relative min-h-screen flex items-center pt-20"
      aria-label="Главный баннер"
    >
      {/* Background Image with fixed dimensions to prevent CLS */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-kitchen.jpg"
          alt="Современная кухня на заказ в интерьере — производство Kuhnitver в Твери"
          className="w-full h-full object-cover"
          width={1920}
          height={1080}
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-transparent" />
      </div>

      {/* Content */}
      <div className="container-custom relative z-10">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              Собственное производство в Твери
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6"
          >
            Кухни на заказ в Твери
            <span className="text-primary"> от производителя</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl"
          >
            Готовность от 20 дней. Европейские материалы, установка включена в
            стоимость.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Button asChild size="lg" className="group">
              <a href="#quiz" onClick={handleSmoothScroll("quiz")}>
                Рассчитать стоимость за 1 минуту
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="group">
              <Link href="/catalog" onClick={handleSmoothScroll("catalog")}>
                <Play className="mr-2 w-5 h-5" aria-hidden="true" />
                Смотреть каталог
              </Link>
            </Button>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-12 grid grid-cols-3 gap-4 max-w-md"
            aria-label="Ключевые преимущества"
          >
            {[
              { value: "10+", label: "лет на рынке", href: "/about" },
              { value: "500+", label: "проектов", href: "/portfolio" },
              { value: "1", label: "год гарантии", href: "/faq" },
            ].map((stat, index) => (
              <Link
                key={index}
                href={stat.href}
                className="text-center rounded-lg p-2 -m-2 hover:bg-primary/5 transition-colors"
              >
                <div className="text-2xl md:text-3xl font-bold text-primary">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </Link>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
