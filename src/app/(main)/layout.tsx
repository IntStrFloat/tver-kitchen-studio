import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MessengerButton from "@/components/MessengerButton";
import MobileCallBar from "@/components/MobileCallBar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
      {/* Пространство, чтобы липкая мобильная панель не перекрывала низ страницы */}
      <div className="h-16 lg:hidden" aria-hidden="true" />
      <MessengerButton />
      <MobileCallBar />
    </>
  );
}
