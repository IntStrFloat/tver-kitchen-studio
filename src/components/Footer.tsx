import { motion } from "framer-motion";
import { MapPin, Phone, Clock, Mail } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      id="contacts"
      className="bg-foreground text-background"
      role="contentinfo"
    >
      {/* Main Footer */}
      <div className="container-custom section-padding">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-1"
          >
            <h2 className="text-2xl font-bold mb-4">TverKuhni</h2>
            <p className="text-background/70 mb-6">
              Производство кухонь на заказ в Твери и Тверской области. Качество,
              которое объединяет семьи.
            </p>
            <div className="flex gap-4">
              <a
                href="https://vk.com/tverkuhni"
                className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-background/20 transition-colors"
                aria-label="TverKuhni ВКонтакте"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.408 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.862-.525-2.049-1.714-1.033-1.01-1.49-1.135-1.744-1.135-.356 0-.458.102-.458.597v1.575c0 .424-.135.678-1.253.678-1.846 0-3.896-1.12-5.339-3.202-2.17-3.042-2.763-5.32-2.763-5.795 0-.254.102-.491.596-.491h1.744c.44 0 .61.203.78.677.847 2.456 2.27 4.608 2.864 4.608.22 0 .322-.102.322-.66V9.316c-.068-1.186-.695-1.287-.695-1.71 0-.203.17-.407.44-.407h2.744c.373 0 .508.203.508.643v3.473c0 .372.17.508.271.508.22 0 .407-.136.813-.542 1.27-1.422 2.18-3.61 2.18-3.61.119-.254.305-.491.746-.491h1.744c.525 0 .644.27.525.643-.22 1.017-2.356 4.031-2.356 4.031-.186.305-.254.44 0 .78.186.254.796.779 1.203 1.253.745.847 1.32 1.558 1.473 2.049.17.474-.085.719-.576.719z" />
                </svg>
              </a>
              <a
                href="https://t.me/mebelshik_tver"
                className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-background/20 transition-colors"
                aria-label="TverKuhni Telegram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                </svg>
              </a>
              <a
                href="https://wa.me/79036302909"
                className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-background/20 transition-colors"
                aria-label="TverKuhni WhatsApp"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
            </div>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="font-semibold mb-4">Контакты</h3>
            <address className="not-italic">
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <MapPin
                    className="w-5 h-5 text-primary mt-0.5 flex-shrink-0"
                    aria-hidden="true"
                  />
                  <span className="text-background/70">
                    г. Тверь, ул. Коминтерна, 95, ТЦ «Мебельный»
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone
                    className="w-5 h-5 text-primary flex-shrink-0"
                    aria-hidden="true"
                  />
                  <a
                    href="tel:+79036302909"
                    className="text-background/70 hover:text-background transition-colors"
                  >
                    +7 903 630 29 09
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Mail
                    className="w-5 h-5 text-primary flex-shrink-0"
                    aria-hidden="true"
                  />
                  <a
                    href="mailto:info@tverkuhni.ru"
                    className="text-background/70 hover:text-background transition-colors"
                  >
                    info@tverkuhni.ru
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Clock
                    className="w-5 h-5 text-primary flex-shrink-0"
                    aria-hidden="true"
                  />
                  <span className="text-background/70">
                    Пн-Сб: 10:00 - 19:00
                  </span>
                </li>
              </ul>
            </address>
          </motion.div>

          {/* Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="font-semibold mb-4">Навигация</h3>
            <nav aria-label="Навигация в подвале">
              <ul className="space-y-3">
                {[
                  { label: "Каталог", href: "#catalog" },
                  { label: "Наши работы", href: "#portfolio" },
                  { label: "Калькулятор", href: "#quiz" },
                  { label: "О компании", href: "#about" },
                  { label: "Вопросы и ответы", href: "#faq" },
                  { label: "Контакты", href: "#contacts" },
                ].map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-background/70 hover:text-background transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </motion.div>

          {/* Service Areas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="font-semibold mb-4">Работаем по всей области</h3>
            <p className="text-background/70 text-sm leading-relaxed">
              Тверь, Торжок, Ржев, Конаково, Кимры, Вышний Волочёк, Бежецк,
              Нелидово и другие города Тверской области.
            </p>
            <p className="text-background/50 text-sm mt-4">
              Доставка и установка по всей Тверской области.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-background/10">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-background/50">
            <p>&copy; {currentYear} TverKuhni. Все права защищены.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-background transition-colors">
                Политика конфиденциальности
              </a>
              <a href="#" className="hover:text-background transition-colors">
                Договор оферты
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
