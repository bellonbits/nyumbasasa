import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      {/* pt-16 offsets the fixed navbar (64px); HeroSection uses -mt-16 to fill behind it */}
      <main className="flex-1 flex flex-col pt-16">{children}</main>
      <Footer />
    </div>
  );
}
