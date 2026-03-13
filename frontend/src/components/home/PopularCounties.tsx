import Link from "next/link";
import Image from "next/image";
import { MapPin } from "lucide-react";

const COUNTIES = [
  { name: "Nairobi",  slug: "nairobi",  count: 2840, image: "https://images.unsplash.com/photo-1611348586804-61bf6c080437?w=600&q=80" },
  { name: "Mombasa",  slug: "mombasa",  count: 890,  image: "https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?w=600&q=80" },
  { name: "Kisumu",   slug: "kisumu",   count: 540,  image: "https://images.unsplash.com/photo-1544568100-847a948585b9?w=600&q=80" },
  { name: "Nakuru",   slug: "nakuru",   count: 620,  image: "https://images.unsplash.com/photo-1521747116042-5a810fda9664?w=600&q=80" },
  { name: "Eldoret",  slug: "eldoret",  count: 410,  image: "https://images.unsplash.com/photo-1504432842672-1a79f78e4084?w=600&q=80" },
  { name: "Thika",    slug: "kiambu",   count: 380,  image: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=600&q=80" },
  { name: "Embu",     slug: "embu",     count: 210,  image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=600&q=80" },
  { name: "Nyeri",    slug: "nyeri",    count: 185,  image: "https://images.unsplash.com/photo-1552083375-1447ce886485?w=600&q=80" },
];

export default function PopularCounties() {
  return (
    <section className="py-16 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Explore by County</h2>
          <Link href="/search" className="text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors">
            All counties →
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {COUNTIES.map((county) => (
            <Link key={county.slug} href={`/search?county=${county.name}`}
              className="group relative rounded-2xl overflow-hidden h-44">
              <Image src={county.image} alt={county.name} fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="text-white font-bold text-base leading-tight">{county.name}</p>
                <div className="flex items-center gap-1 text-white/70 text-xs mt-0.5">
                  <MapPin className="w-3 h-3" />
                  <span>{county.count.toLocaleString()} listings</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
