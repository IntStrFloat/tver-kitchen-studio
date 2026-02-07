import JsonLd from "@/components/seo/JsonLd";
import { generateBreadcrumbSchema, SITE_CONFIG } from "@/lib/seo";

interface BreadcrumbItem {
  name: string;
  url?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

/**
 * Компонент хлебных крошек с JSON-LD разметкой BreadcrumbList.
 * Визуально отображает навигационную цепочку и добавляет
 * структурированные данные для поисковых систем.
 */
const Breadcrumbs = ({ items, className = "" }: BreadcrumbsProps) => {
  const breadcrumbItems = [
    { name: "Главная", url: SITE_CONFIG.url },
    ...items.map((item) => ({
      name: item.name,
      url: item.url || SITE_CONFIG.url,
    })),
  ];

  return (
    <>
      <JsonLd data={generateBreadcrumbSchema(breadcrumbItems)} />
      <nav
        aria-label="Хлебные крошки"
        className={`text-sm text-muted-foreground ${className}`}
      >
        <ol
          className="flex items-center gap-2 flex-wrap"
          itemScope
          itemType="https://schema.org/BreadcrumbList"
        >
          {breadcrumbItems.map((item, index) => (
            <li
              key={index}
              className="flex items-center gap-2"
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
            >
              {index > 0 && (
                <span className="text-muted-foreground/50" aria-hidden="true">
                  /
                </span>
              )}
              {index < breadcrumbItems.length - 1 ? (
                <a
                  href={item.url}
                  itemProp="item"
                  className="hover:text-primary transition-colors"
                >
                  <span itemProp="name">{item.name}</span>
                </a>
              ) : (
                <span itemProp="name" className="text-foreground font-medium">
                  {item.name}
                </span>
              )}
              <meta itemProp="position" content={String(index + 1)} />
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
};

export default Breadcrumbs;
