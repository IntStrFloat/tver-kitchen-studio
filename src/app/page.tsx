import type { Metadata } from "next";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Catalog from "@/components/Catalog";
import Quiz from "@/components/Quiz";
import Portfolio from "@/components/Portfolio";
import About from "@/components/About";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import JsonLd from "@/components/seo/JsonLd";
import {
  SITE_CONFIG,
  generateWebPageSchema,
} from "@/lib/seo";

export const metadata: Metadata = {
  title: SITE_CONFIG.defaultTitle,
  description: SITE_CONFIG.defaultDescription,
  alternates: {
    canonical: `${SITE_CONFIG.url}/`,
  },
};

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Structured Data: WebPage */}
      <JsonLd
        data={generateWebPageSchema(
          SITE_CONFIG.defaultTitle,
          SITE_CONFIG.defaultDescription,
          `${SITE_CONFIG.url}/`,
        )}
      />

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
}
