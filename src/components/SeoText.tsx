import Link from "next/link";
import { SITE_CONFIG } from "@/lib/seo";
import { COMMERCIAL_TERMS } from "@/lib/data";

const SeoText = () => {
  return (
    <section
      className="bg-secondary/20 border-t border-border/50"
      aria-label="О производстве кухонь на заказ в Твери"
    >
      <div className="container-custom py-12 md:py-16">
        <div className="max-w-4xl mx-auto prose-like text-foreground/80 leading-relaxed space-y-5 text-[15px] md:text-base">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Кухни на заказ в Твери по индивидуальным размерам
          </h2>
          <p>
            {SITE_CONFIG.name} изготавливает{" "}
            <Link href="/catalog" className="text-primary hover:underline">
              кухонные гарнитуры на заказ
            </Link>{" "}
            для квартир, частных домов и коммерческих помещений в Твери и
            Тверской области. До заказа обсуждаем размеры, расположение техники,
            материалы и пожелания к хранению. В каталоге можно сравнить{" "}
            <Link href="/catalog/loft" className="text-primary hover:underline">лофт</Link>,{" "}
            <Link href="/catalog/skandinavskiy" className="text-primary hover:underline">скандинавский стиль</Link>{" "}
            и <Link href="/catalog/minimalizm" className="text-primary hover:underline">минимализм</Link>.
            Изображения направлений дизайна помогают обсудить идею будущей кухни.
          </p>
          <h3 className="text-xl font-semibold text-foreground pt-2">
            Из чего складывается стоимость
          </h3>
          <p>{COMMERCIAL_TERMS.pricingText}</p>
          <p>
            Состав сметы и различие между погонным метром и стоимостью всего
            проекта объясняем на <Link href="/price" className="text-primary hover:underline">странице цен</Link>.
            Чтобы получить предварительный расчёт, передайте размеры помещения
            и пожелания к комплектации; окончательную смету согласуем после
            уточнения проекта.
          </p>
          <h3 className="text-xl font-semibold text-foreground pt-2">
            Материалы и комплектация
          </h3>
          <p>
            Выбор фасадов, столешницы и фурнитуры зависит от проекта и условий
            использования. Конкретные марки, модели механизмов, покрытия и
            характеристики указываются в спецификации. Практические критерии
            сравнения собрали в <Link href="/blog/materialy-dlya-kuhni-mdf-massiv-plastik" className="text-primary hover:underline">статье о материалах</Link>.
            Образцы и наличие выбранных комплектующих уточняйте до заказа.
          </p>
          <h3 className="text-xl font-semibold text-foreground pt-2">
            Замер, сроки и обслуживание
          </h3>
          <p>{COMMERCIAL_TERMS.measurementText}</p>
          <p>{COMMERCIAL_TERMS.productionText}</p>
          <p>
            {COMMERCIAL_TERMS.deliveryText}{" "}
            <Link href="/dostavka" className="text-primary hover:underline">Условия доставки и монтажа</Link>.
          </p>
          <p>{COMMERCIAL_TERMS.warrantyText}</p>
          <p>
            Наш адрес: {SITE_CONFIG.address.locality}, {SITE_CONFIG.address.street}.
            Часы работы: {SITE_CONFIG.openingHours.label}. Перед визитом{" "}
            <Link href="/contacts" className="text-primary hover:underline">свяжитесь с нами</Link>,
            чтобы согласовать встречу и подготовить интересующие образцы.
          </p>
        </div>
      </div>
    </section>
  );
};

export default SeoText;
