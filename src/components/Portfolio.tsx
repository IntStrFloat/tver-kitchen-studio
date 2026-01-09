import { motion } from "framer-motion";
import { Star, MapPin } from "lucide-react";

import kitchenLoft from "@/assets/kitchen-loft.jpg";
import kitchenScandi from "@/assets/kitchen-scandi.jpg";
import kitchenClassic from "@/assets/kitchen-classic.jpg";
import kitchenModern from "@/assets/kitchen-modern.jpg";
import kitchenEmerald from "@/assets/kitchen-emerald.jpg";
import heroKitchen from "@/assets/hero-kitchen.jpg";

const projects = [
  { id: 1, image: kitchenLoft, location: "ул. Радищева, Тверь" },
  { id: 2, image: kitchenScandi, location: "Пролетарский р-н, Тверь" },
  { id: 3, image: kitchenClassic, location: "ул. Советская, Торжок" },
  { id: 4, image: kitchenModern, location: "мкр. Южный, Тверь" },
  { id: 5, image: kitchenEmerald, location: "г. Конаково" },
  { id: 6, image: heroKitchen, location: "ул. Горького, Ржев" },
];

const testimonials = [
  {
    id: 1,
    name: "Анна М.",
    location: "Тверь",
    rating: 5,
    text: "Заказывали кухню в стиле лофт. Результат превзошёл все ожидания! Качество материалов отличное, установка заняла один день.",
  },
  {
    id: 2,
    name: "Игорь П.",
    location: "Торжок",
    rating: 5,
    text: "Долго выбирали между разными производителями. Рады, что остановились на TverKuhni. Цена-качество на высоте.",
  },
  {
    id: 3,
    name: "Елена С.",
    location: "Конаково",
    rating: 5,
    text: "Бесплатный 3D-проект помог визуализировать идею. Дизайнер учёл все наши пожелания. Рекомендую!",
  },
];

const Portfolio = () => {
  return (
    <section id="portfolio" className="section-padding bg-secondary/30">
      <div className="container-custom">
        {/* Portfolio Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Наши работы
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Реализованные проекты
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Более 500 кухонь установлено в Твери и Тверской области
          </p>
        </motion.div>

        {/* Masonry Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-16">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`premium-card overflow-hidden group ${
                index === 0 || index === 5 ? "row-span-2" : ""
              }`}
            >
              <div className={`relative ${index === 0 || index === 5 ? "aspect-[3/4]" : "aspect-square"}`}>
                <img
                  src={project.image}
                  alt={project.location}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <div className="flex items-center gap-2 text-card text-sm">
                    <MapPin className="w-4 h-4" />
                    {project.location}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Отзывы наших клиентов
          </h3>
          <p className="text-muted-foreground">
            Более 98% клиентов рекомендуют нас своим друзьям
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="premium-card p-6"
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-foreground/90 mb-4 leading-relaxed">
                "{testimonial.text}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                  {testimonial.name[0]}
                </div>
                <div>
                  <div className="font-medium">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.location}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
