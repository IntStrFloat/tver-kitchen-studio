import { Helmet } from "react-helmet-async";

interface JsonLdProps {
  data: Record<string, unknown> | Record<string, unknown>[];
}

/**
 * Компонент для вставки JSON-LD структурированных данных.
 * Принимает объект или массив объектов schema.org и рендерит
 * корректный <script type="application/ld+json">.
 */
const JsonLd = ({ data }: JsonLdProps) => {
  const jsonString = JSON.stringify(data, null, 0);

  return (
    <Helmet>
      <script type="application/ld+json">{jsonString}</script>
    </Helmet>
  );
};

export default JsonLd;
