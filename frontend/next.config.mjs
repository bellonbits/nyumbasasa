/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "willstonehomes.ke" },
      { protocol: "https", hostname: "www.worldbank.org" },
      { protocol: "https", hostname: "archistra.co.ke" },
      { protocol: "https", hostname: "resources.pamgolding.co.za" },
    ],
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  compress: true,
  poweredByHeader: false,
};

export default nextConfig;
