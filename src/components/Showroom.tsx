"use client";

import { motion } from "framer-motion";
import { Navigation, Phone, Clock } from "lucide-react";

const Showroom = () => {
  // Координаты шоурума: 56.8584, 35.9006 (ул. Коминтерна, 95, Тверь)
  // Используем map-widget с поиском по адресу — самый простой способ
  // встроить точку без регистрации в Яндекс.Конструкторе карт.
  const mapSrc =
    "https://yandex.ru/map-widget/v1/?ll=35.9006%2C56.8584&mode=search&sll=35.9006%2C56.8584&text=" +
    encodeURIComponent("Тверь, улица Коминтерна, 95") +
    "&z=16";

  const routeUrl =
    "https://yandex.ru/maps/?rtext=~56.8584%2C35.9006&rtt=auto&text=" +
    encodeURIComponent("Тверь, улица Коминтерна, 95");

  return (
    <section
      id="showroom"
      className="section-padding bg-secondary/30"
      aria-label="Шоурум и производство в Твери"
    >
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 max-w-3xl mx-auto"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Где мы находимся
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Шоурум и производство в Твери
          </h2>
          <p className="text-lg text-muted-foreground">
            Приезжайте посмотреть и потрогать образцы фасадов, столешниц и
            фурнитуры. Покажем материалы вживую, ответим на вопросы и поможем
            определиться со стилем. По договорённости проводим экскурсию по
            производству.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1 space-y-4"
          >
            <div className="premium-card p-6">
              <div className="text-xs uppercase tracking-wide text-muted-foreground mb-2">
                Адрес
              </div>
              <p className="font-semibold text-lg leading-snug mb-1">
                г. Тверь, ул. Коминтерна, 95
              </p>
              <p className="text-sm text-muted-foreground">
                ТЦ «Мебельный» · Тверская область, 170000
              </p>
            </div>

            <div className="premium-card p-6">
              <div className="flex items-start gap-3 mb-3">
                <Clock
                  className="w-5 h-5 text-primary mt-0.5 flex-shrink-0"
                  aria-hidden="true"
                />
                <div>
                  <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                    Часы работы
                  </div>
                  <p className="font-medium">Пн–Сб: 10:00–19:00</p>
                  <p className="text-xs text-muted-foreground">
                    Воскресенье — выходной
                  </p>
                </div>
              </div>
            </div>

            <div className="premium-card p-6">
              <div className="flex items-start gap-3 mb-3">
                <Phone
                  className="w-5 h-5 text-primary mt-0.5 flex-shrink-0"
                  aria-hidden="true"
                />
                <div>
                  <div className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                    Запись на визит
                  </div>
                  <a
                    href="tel:+79036302909"
                    className="font-medium hover:text-primary transition-colors"
                  >
                    +7 903 630 29 09
                  </a>
                  <p className="text-xs text-muted-foreground mt-1">
                    Лучше предупредить — подготовим образцы под ваш стиль
                  </p>
                </div>
              </div>
            </div>

            <a
              href={routeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="premium-card p-5 flex items-center justify-between group hover:border-primary transition-colors"
            >
              <div className="flex items-center gap-3">
                <Navigation
                  className="w-5 h-5 text-primary"
                  aria-hidden="true"
                />
                <span className="font-medium">Построить маршрут</span>
              </div>
              <span className="text-xs text-muted-foreground">
                Яндекс.Карты
              </span>
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2 premium-card overflow-hidden h-[400px] md:h-[500px]"
          >
            <iframe
              src={mapSrc}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allow="geolocation"
              referrerPolicy="no-referrer-when-downgrade"
              title="Шоурум Kuhnitver на ул. Коминтерна, 95 в Твери"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Showroom;
