"use client";

import { motion } from "framer-motion";
import {
  Check,
  Ruler,
  Truck,
  Shield,
  Palette,
  MapPin,
  Phone,
  Clock,
  Mail,
} from "lucide-react";

const benefits = [
  {
    icon: Ruler,
    title: "Замер — 1 500 ₽",
    description: "Приедем в удобное время (вычитается при заказе)",
  },
  {
    icon: Palette,
    title: "Эскиз проекта",
    description: "После заключения договора — эскиз на утверждение",
  },
  {
    icon: Truck,
    title: "Доставка и установка",
    description: "Бережная доставка и профессиональный монтаж",
  },
  {
    icon: Shield,
    title: "Гарантия 1 год",
    description: "На все изделия и выполненные работы",
  },
];

const features = [
  "Собственное производство в Твери",
  "Европейская фурнитура Blum, Hettich",
  "Экологичные материалы",
  "Индивидуальный дизайн под ваши размеры",
  "Сроки от 20 дней",
  "3D-проект после заключения договора",
];

const About = () => {
  return (
    <section id="about" className="section-padding">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              О компании
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Производим кухни <span className="text-primary">с 2014 года</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Kuhnitver — это собственное производство кухонной мебели в Твери.
              Мы создаём кухни, которые объединяют семьи: функциональные,
              красивые и доступные по цене.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-primary" />
                  </div>
                  <span className="text-sm">{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Benefits Cards */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 gap-4"
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="premium-card p-6 text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* NAP block — Name / Address / Phone, with schema.org microdata */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-12 lg:mt-16 premium-card p-6 md:p-8"
          itemScope
          itemType="https://schema.org/LocalBusiness"
        >
          <meta itemProp="name" content="Kuhnitver" />
          <meta itemProp="url" content="https://kuhnitver.ru" />
          <meta
            itemProp="image"
            content="https://kuhnitver.ru/og-image.jpg"
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div
              className="flex items-start gap-3"
              itemProp="address"
              itemScope
              itemType="https://schema.org/PostalAddress"
            >
              <MapPin
                className="w-5 h-5 text-primary mt-0.5 flex-shrink-0"
                aria-hidden="true"
              />
              <div>
                <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                  Шоурум и производство
                </div>
                <div className="font-medium">
                  <span itemProp="addressLocality">Тверь</span>,{" "}
                  <span itemProp="streetAddress">ул. Коминтерна, 95</span>
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  ТЦ «Мебельный»
                </div>
                <meta itemProp="addressRegion" content="Тверская область" />
                <meta itemProp="postalCode" content="170000" />
                <meta itemProp="addressCountry" content="RU" />
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone
                className="w-5 h-5 text-primary mt-0.5 flex-shrink-0"
                aria-hidden="true"
              />
              <div>
                <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                  Телефон
                </div>
                <a
                  href="tel:+79036302909"
                  className="font-medium hover:text-primary transition-colors"
                  itemProp="telephone"
                >
                  +7 903 630 29 09
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail
                className="w-5 h-5 text-primary mt-0.5 flex-shrink-0"
                aria-hidden="true"
              />
              <div>
                <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                  Email
                </div>
                <a
                  href="mailto:m-btd@mail.ru"
                  className="font-medium hover:text-primary transition-colors break-all"
                  itemProp="email"
                >
                  m-btd@mail.ru
                </a>
              </div>
            </div>

            <div
              className="flex items-start gap-3"
              itemProp="openingHours"
              content="Mo-Sa 10:00-19:00"
            >
              <Clock
                className="w-5 h-5 text-primary mt-0.5 flex-shrink-0"
                aria-hidden="true"
              />
              <div>
                <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                  Часы работы
                </div>
                <div className="font-medium">Пн–Сб: 10:00–19:00</div>
                <div className="text-xs text-muted-foreground">
                  Воскресенье — выходной
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
