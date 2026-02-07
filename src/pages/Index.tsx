import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Catalog from "@/components/Catalog";
import Quiz from "@/components/Quiz";
import Portfolio from "@/components/Portfolio";
import About from "@/components/About";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import SEOHead from "@/components/seo/SEOHead";
import JsonLd from "@/components/seo/JsonLd";
import {
  SITE_CONFIG,
  generateWebPageSchema,
  generateLocalBusinessSchema,
  generateOrganizationSchema,
  generateWebSiteSchema,
} from "@/lib/seo";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* SEO Head — дублирует и дополняет meta из index.html на клиенте */}
      <SEOHead
        description={SITE_CONFIG.defaultDescription}
        canonical={`${SITE_CONFIG.url}/`}
      />

      {/* Structured Data: WebPage */}
      <JsonLd
        data={generateWebPageSchema(
          SITE_CONFIG.defaultTitle,
          SITE_CONFIG.defaultDescription,
          `${SITE_CONFIG.url}/`,
        )}
      />

      {/* Structured Data: дополнительные схемы (дублирует index.html для SPA-навигации) */}
      <JsonLd data={generateOrganizationSchema()} />
      <JsonLd data={generateWebSiteSchema()} />
      <JsonLd data={generateLocalBusinessSchema()} />

      <Header />
      <main>
        <Hero />
        <Catalog />
        <Quiz />
        <Portfolio />
        <About />
        <FAQSection />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Index;
