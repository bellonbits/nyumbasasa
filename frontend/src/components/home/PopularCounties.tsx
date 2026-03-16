import Link from "next/link";
import Image from "next/image";
import { MapPin, ArrowRight } from "lucide-react";

const COUNTIES = [
  {
    name: "Nairobi",
    slug: "nairobi",
    count: 2840,
    image: "https://images.unsplash.com/photo-1611348586804-61bf6c080437?w=800&q=85",
    highlight: "Capital City",
  },
  {
    name: "Mombasa",
    slug: "mombasa",
    count: 890,
    image: "https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?w=800&q=85",
    highlight: "Coastal City",
  },
  {
    name: "Kisumu",
    slug: "kisumu",
    count: 540,
    image: "https://images.unsplash.com/photo-1544568100-847a948585b9?w=800&q=85",
    highlight: "Lakeside City",
  },
  {
    name: "Nakuru",
    slug: "nakuru",
    count: 620,
    image: "https://images.unsplash.com/photo-1521747116042-5a810fda9664?w=800&q=85",
    highlight: "Rift Valley",
  },
  {
    name: "Eldoret",
    slug: "eldoret",
    count: 410,
    image: "https://images.unsplash.com/photo-1504432842672-1a79f78e4084?w=800&q=85",
    highlight: "Athletics City",
  },
  {
    name: "Thika",
    slug: "kiambu",
    count: 380,
    image: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800&q=85",
    highlight: "Industrial Hub",
  },
  {
    name: "Embu",
    slug: "embu",
    count: 210,
    image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&q=85",
    highlight: "Mt. Kenya Region",
  },
  {
    name: "Nyeri",
    slug: "nyeri",
    count: 185,
    image: "https://images.unsplash.com/photo-1552083375-1447ce886485?w=800&q=85",
    highlight: "Central Kenya",
  },
];

export default function PopularCounties() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="section-label mb-2 block">Explore Kenya</span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
              Browse by County
            </h2>
          </div>
          <Link
            href="/search"
            className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-brand-600 border border-gray-200 hover:border-brand-300 px-4 py-2 rounded-full transition-all"
          >
            All counties <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Grid — 2 big + 6 small */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {COUNTIES.map((county, i) => (
            <Link
              key={county.slug}
              href={`/search?county=${county.name}`}
              className={`group relative overflow-hidden rounded-2xl ${
                i === 0 ? "col-span-2 row-span-2 h-80" : "h-44"
              }`}
            >
              <Image
                src={county.image}
                alt={county.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes={i === 0 ? "(max-width: 640px) 100vw, 50vw" : "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"}
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent group-hover:from-black/85 transition-all duration-300" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                {i === 0 && (
                  <span className="inline-block text-[10px] font-bold text-brand-300 bg-brand-500/20 border border-brand-400/30 px-2.5 py-1 rounded-full mb-2">
                    {county.highlight}
                  </span>
                )}
                <p className="text-white font-bold text-base leading-tight">{county.name}</p>
                <div className="flex items-center gap-1 text-white/60 text-xs mt-0.5">
                  <MapPin className="w-3 h-3 flex-shrink-0" />
                  <span>{county.count.toLocaleString()} listings</span>
                </div>
              </div>

              {/* Hover overlay arrow */}
              <div className="absolute top-3 right-3 w-8 h-8 bg-white/0 group-hover:bg-white/15 rounded-full flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100">
                <ArrowRight className="w-4 h-4 text-white" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
