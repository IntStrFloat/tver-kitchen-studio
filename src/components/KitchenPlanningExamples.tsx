import Image from "next/image";
import Link from "next/link";
import { kitchenPlanningExamples } from "@/lib/kitchen-planning-examples";

export default function KitchenPlanningExamples() {
  return (
    <section className="mb-16" aria-labelledby="planning-examples-title">
      <div className="max-w-3xl mb-8">
        <p className="text-sm font-medium text-primary mb-3">Проектные примеры</p>
        <h2 id="planning-examples-title" className="text-2xl md:text-3xl font-bold mb-4">
          Три примера планировки и комплектации
        </h2>
        <p className="text-muted-foreground">
          Условные размеры и состав мебели помогают сравнить варианты будущей кухни.
          Изображения показывают идеи оформления. Для вашего помещения подготовим
          отдельную комплектацию и расчёт после уточнения размеров и техники.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {kitchenPlanningExamples.map((example) => (
          <article key={example.id} id={example.id} className="premium-card overflow-hidden flex flex-col scroll-mt-28">
            <figure>
              <Image
                src={example.image}
                alt={`Дизайн-референс оформления для проектного примера «${example.title}»`}
                width={720}
                height={540}
                sizes="(max-width: 1024px) 100vw, 33vw"
                className="w-full aspect-[4/3] object-cover"
                loading="lazy"
              />
              <figcaption className="px-6 pt-3 text-xs text-muted-foreground">
                {"imageSource" in example ? (
                  <>Фото оформления — <a href={example.imageSource.url} className="text-primary underline underline-offset-4">{example.imageSource.name}</a></>
                ) : "Иллюстрация оформления"}
              </figcaption>
            </figure>
            <div className="p-6 flex flex-col flex-1">
              <h3 className="text-xl font-bold mb-3">{example.title}</h3>
              <p className="text-sm text-muted-foreground mb-5">{example.task}</p>
              <dl className="space-y-4 text-sm mb-5">
                <div>
                  <dt className="font-semibold mb-1">Размеры примера</dt>
                  <dd className="text-muted-foreground">{example.dimensions}</dd>
                </div>
                <div>
                  <dt className="font-semibold mb-1">Материалы</dt>
                  <dd className="text-muted-foreground">{example.materials}</dd>
                </div>
                <div>
                  <dt className="font-semibold mb-1">Хранение</dt>
                  <dd className="text-muted-foreground">{example.storage}</dd>
                </div>
                <div>
                  <dt className="font-semibold mb-1">Что включить в расчёт</dt>
                  <dd className="text-muted-foreground">{example.estimateScope}</dd>
                </div>
              </dl>
              <h4 className="text-sm font-semibold mb-2">Что меняет стоимость</h4>
              <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground mb-6">
                {example.costDrivers.map((factor) => (
                  <li key={factor}>{factor}</li>
                ))}
              </ul>
              <div className="mt-auto space-y-3">
                <Link href={example.catalogHref} className="block text-sm text-primary underline underline-offset-4 hover:no-underline">
                  Подробнее о планировке
                </Link>
                <Link href="/#quiz" className="inline-flex items-center justify-center w-full px-5 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
                  Рассчитать похожую комплектацию
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
      <p className="text-sm text-muted-foreground mt-6 max-w-3xl">
        Для расчёта подготовьте размеры стен, расположение коммуникаций и список техники.
        Покупку техники, мойки и смесителя, подключения и дополнительные работы
        согласуем отдельными позициями сметы.
      </p>
    </section>
  );
}
