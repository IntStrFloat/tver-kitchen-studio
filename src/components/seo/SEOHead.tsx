import { Helmet } from "react-helmet-async";
import { SITE_CONFIG } from "@/lib/seo";

interface SEOHeadProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  noindex?: boolean;
  children?: React.ReactNode;
}

/**
 * Централизованный SEO-компонент для управления meta-тегами.
 * Использует react-helmet-async для динамического обновления <head>.
 *
 * Для главной страницы meta-теги также продублированы в index.html
 * (чтобы были доступны до загрузки JS для SPA).
 */
const SEOHead = ({
  title,
  description = SITE_CONFIG.defaultDescription,
  canonical,
  ogImage = SITE_CONFIG.defaultOgImage,
  ogType = "website",
  noindex = false,
  children,
}: SEOHeadProps) => {
  const fullTitle = title
    ? `${title} | ${SITE_CONFIG.name}`
    : SITE_CONFIG.defaultTitle;

  const canonicalUrl = canonical || SITE_CONFIG.url;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Robots */}
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta
          name="robots"
          content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        />
      )}

      {/* Open Graph */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:locale" content={SITE_CONFIG.locale} />
      <meta property="og:site_name" content={SITE_CONFIG.name} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {children}
    </Helmet>
  );
};

export default SEOHead;
