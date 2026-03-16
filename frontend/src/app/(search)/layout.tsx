import Navbar from "@/components/layout/Navbar";

// Search group: full-height layout with navbar but no footer
export default function SearchGroupLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navbar />
      {/* pt-16 offsets the fixed navbar (h-16 = 64px) */}
      <main className="flex-1 flex flex-col overflow-hidden pt-16">{children}</main>
    </div>
  );
}
