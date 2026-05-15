import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MessengerButton from "@/components/MessengerButton";

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
      <MessengerButton />
    </>
  );
}
