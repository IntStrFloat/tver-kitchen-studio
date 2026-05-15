import Link from "next/link";

const SeoText = () => {
  return (
    <section
      className="bg-secondary/20 border-t border-border/50"
      aria-label="О производстве кухонь на заказ в Твери"
    >
      <div className="container-custom py-12 md:py-16">
        <div className="max-w-4xl mx-auto prose-like text-foreground/80 leading-relaxed space-y-5 text-[15px] md:text-base">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Кухни на заказ в Твери от собственного производства
          </h2>

          <p>
            Kuhnitver — тверская мебельная компания с собственным производством
            на ул. Коминтерна, 95. С 2014 года изготавливаем{" "}
            <Link href="/catalog" className="text-primary hover:underline">
              кухонные гарнитуры на заказ
            </Link>{" "}
            по индивидуальным размерам для квартир, частных домов и
            коммерческих помещений в Твери и Тверской области. Работаем в
            разных стилях — от{" "}
            <Link
              href="/catalog/loft"
              className="text-primary hover:underline"
            >
              лофта
            </Link>{" "}
            и{" "}
            <Link
              href="/catalog/skandinavskiy"
              className="text-primary hover:underline"
            >
              скандинавского
            </Link>{" "}
            до{" "}
            <Link
              href="/catalog/minimalizm"
              className="text-primary hover:underline"
            >
              минимализма
            </Link>{" "}
            и{" "}
            <Link
              href="/catalog/premium"
              className="text-primary hover:underline"
            >
              премиум-сегмента
            </Link>
            .
          </p>

          <h3 className="text-xl font-semibold text-foreground pt-2">
            Почему «от производителя» — это важно
          </h3>
          <p>
            Когда вы заказываете кухню напрямую у производителя в Твери, между
            вами и фабрикой нет посредников: ни салона, ни перекупщика. Это
            означает прозрачную цену, прямой контакт с дизайнером и
            технологом, возможность приехать и увидеть, как именно
            изготавливают вашу кухню. Раскрой ЛДСП и МДФ выполняем на
            форматно-раскроечных и кромкооблицовочных станках с ЧПУ, фасады
            красим в собственной покрасочной камере, сборку и пред-монтаж
            делаем перед отгрузкой, чтобы исключить ошибки на установке.
          </p>

          <h3 className="text-xl font-semibold text-foreground pt-2">
            Материалы, экология и долговечность
          </h3>
          <p>
            Для корпусов используем плиты класса эмиссии E0 и E1 — это
            безопасный уровень для жилых помещений, подтверждённый
            гигиеническими сертификатами. Фасады изготавливаем из МДФ Egger и
            Kronospan с покрытием эмалью, ПВХ или Soft-touch, для премиальных
            проектов — массив дуба, ясеня и бука камерной сушки. Все
            комплектующие — Blum, Hettich, Caesarstone, Vicostone — поставляются
            с заводской гарантией. Подробнее о брендах и видах материалов
            рассказали в{" "}
            <Link
              href="/blog/materialy-dlya-kuhni-mdf-massiv-plastik"
              className="text-primary hover:underline"
            >
              отдельной статье блога
            </Link>
            .
          </p>

          <h3 className="text-xl font-semibold text-foreground pt-2">
            Сроки, гарантия и сервис в Твери
          </h3>
          <p>
            Срок изготовления кухни — от 20 рабочих дней с момента подписания
            договора и утверждения эскиза. На все изделия и монтажные работы
            предоставляем гарантию 1 год по договору: при возникновении любых
            вопросов наш мастер выезжает бесплатно. По Твери доставка и
            установка{" "}
            <Link href="/dostavka" className="text-primary hover:underline">
              входят в стоимость кухни
            </Link>
            , по Тверской области — рассчитываются индивидуально в зависимости
            от расстояния. Подробные{" "}
            <Link href="/price" className="text-primary hover:underline">
              цены по типам планировки и материалам
            </Link>{" "}
            опубликованы на отдельной странице.
          </p>

          <p>
            Если хотите увидеть и потрогать образцы фасадов, столешниц и
            фурнитуры — приезжайте в наш шоурум в Твери (ул. Коминтерна, 95) с
            понедельника по субботу с 10:00 до 19:00. Или закажите{" "}
            <Link href="/contacts" className="text-primary hover:underline">
              бесплатную консультацию
            </Link>{" "}
            — дизайнер перезвонит и поможет с замером и расчётом стоимости.
          </p>
        </div>
      </div>
    </section>
  );
};

export default SeoText;
