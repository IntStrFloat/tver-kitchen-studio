"use client";

import { motion } from "framer-motion";
import { SITE_CONFIG } from "@/lib/seo";
import { COMMERCIAL_TERMS } from "@/lib/data";
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
    title: "Замер по записи",
    description: COMMERCIAL_TERMS.measurementText,
  },
  {
    icon: Palette,
    title: "Эскиз проекта",
    description: "После заключения договора — эскиз на утверждение",
  },
  {
    icon: Truck,
    title: "Доставка и установка",
    description: COMMERCIAL_TERMS.deliveryText,
  },
  {
    icon: Shield,
    title: "Гарантийные условия",
    description: COMMERCIAL_TERMS.warrantyText,
  },
];

const features = [
  "Собственное производство в Твери",
  "Европейская фурнитура Blum, Hettich",
  "Подбор материалов по образцам",
  "Индивидуальный дизайн под ваши размеры",
  "Сроки и комплектация в договоре",
  "3D-проект после заключения договора",
];

const About = () => {
  return (
    <section id="about" className="section-padding">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={false}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              О компании
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Производим кухни <span className="text-primary">по вашим размерам</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Kuhnitver — это собственное производство кухонной мебели в Твери.
              Обсуждаем планировку, материалы и размещение техники, затем
              согласуем проект, комплектацию и смету.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={false}
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
            initial={false}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 gap-4"
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={false}
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
          initial={false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-12 lg:mt-16 premium-card p-6 md:p-8"
          itemScope
          itemType="https://schema.org/LocalBusiness"
        >
          <meta itemProp="name" content={SITE_CONFIG.name} />
          {/* URL — через <link href>, а не <meta content>: ссылка в content
              мета-тега невалидна (ошибка валидатора Яндекса). */}
          <link itemProp="url" href={SITE_CONFIG.url} />
          <meta
            itemProp="image"
            content={SITE_CONFIG.defaultOgImage}
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
                  <span itemProp="addressLocality">{SITE_CONFIG.address.locality}</span>,{" "}
                  <span itemProp="streetAddress">{SITE_CONFIG.address.street}</span>
                </div>
                <meta itemProp="addressRegion" content={SITE_CONFIG.address.region} />
                <meta itemProp="addressCountry" content={SITE_CONFIG.address.country} />
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
                {/* itemProp на <a> взял бы значением href (tel:+7…);
                    даём чистый номер через <meta>, ссылку оставляем для людей. */}
                <meta itemProp="telephone" content={SITE_CONFIG.phone} />
                <a
                  href={`tel:${SITE_CONFIG.phoneClean}`}
                  className="font-medium hover:text-primary transition-colors"
                >
                  {SITE_CONFIG.phone}
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
                <meta itemProp="email" content={SITE_CONFIG.email} />
                <a
                  href={`mailto:${SITE_CONFIG.email}`}
                  className="font-medium hover:text-primary transition-colors break-all"
                >
                  {SITE_CONFIG.email}
                </a>
              </div>
            </div>

            <div
              className="flex items-start gap-3"
              itemProp="openingHours"
              content={SITE_CONFIG.openingHours.schema}
            >
              <Clock
                className="w-5 h-5 text-primary mt-0.5 flex-shrink-0"
                aria-hidden="true"
              />
              <div>
                <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                  Часы работы
                </div>
                <div className="font-medium">{SITE_CONFIG.openingHours.label}</div>
                <div className="text-xs text-muted-foreground">
                  {SITE_CONFIG.openingHours.closedLabel}
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
