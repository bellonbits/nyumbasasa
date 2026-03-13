import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: {
    default: "Homify Kenya – Find Affordable Homes in Kenya",
    template: "%s | Homify Kenya",
  },
  description:
    "Discover affordable bedsitters, studios, and apartments across all 47 counties in Kenya. Connect directly with agents via WhatsApp.",
  keywords: ["Kenya rental", "affordable houses Kenya", "bedsitter Nairobi", "studio apartment Kenya"],
  authors: [{ name: "Homify Kenya" }],
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    siteName: "Homify Kenya",
    title: "Homify Kenya – Find Affordable Homes in Kenya",
    description: "Search verified rental listings across Kenya",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image" },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#16a34a",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
