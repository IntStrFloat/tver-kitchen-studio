import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Catalog from "@/components/Catalog";
import Quiz from "@/components/Quiz";
import Portfolio from "@/components/Portfolio";
import About from "@/components/About";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <Catalog />
        <Quiz />
        <Portfolio />
        <About />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Index;
