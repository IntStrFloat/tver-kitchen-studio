import { motion } from "framer-motion";
import { Check, Ruler, Truck, Shield, Palette } from "lucide-react";

const benefits = [
  {
    icon: Ruler,
    title: "Бесплатный замер",
    description: "Приедем в удобное время и снимем все размеры",
  },
  {
    icon: Palette,
    title: "3D-проект бесплатно",
    description: "Визуализация вашей кухни до начала производства",
  },
  {
    icon: Truck,
    title: "Доставка и установка",
    description: "Бережная доставка и профессиональный монтаж",
  },
  {
    icon: Shield,
    title: "Гарантия 2 года",
    description: "На все изделия и выполненные работы",
  },
];

const features = [
  "Собственное производство в Твери",
  "Европейская фурнитура Blum, Hettich",
  "Экологичные материалы",
  "Индивидуальный дизайн под ваши размеры",
  "Сроки от 20 дней",
  "Рассрочка без переплат",
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
              Производим кухни{" "}
              <span className="text-primary">с 2014 года</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              TverKuhni — это собственное производство кухонной мебели в Твери.
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
      </div>
    </section>
  );
};

export default About;
