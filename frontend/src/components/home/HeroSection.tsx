"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Building2, DollarSign, BedDouble, SlidersHorizontal, Search, Bookmark } from "lucide-react";

const FEATURED = {
  address: "Westlands, Nairobi, Kenya",
  beds: 2, baths: 2, area: "85 m²",
  price: "KES 35,000",
  agent: { name: "Grace Wanjiku", agency: "Wanjiku Real Estate" },
  image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200&q=85",
};

const PRICE_RANGES = ["Any", "Under 10K", "10K–20K", "20K–40K", "40K+"];
const BEDROOM_OPTIONS = ["Any", "Bedsitter", "Studio", "1 Bed", "2 Beds", "3 Beds"];
const PROPERTY_TYPES = ["Any", "Bedsitter", "Studio", "1 Bedroom", "2 Bedrooms", "3 Bedrooms"];

export default function HeroSection() {
  const router = useRouter();
  const [location, setLocation] = useState("");
  const [priceOpen, setPriceOpen] = useState(false);
  const [bedsOpen, setBedsOpen] = useState(false);
  const [price, setPrice] = useState("Price");
  const [beds, setBeds] = useState("Bedrooms");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location) params.set("county", location);
    router.push(`/search?${params.toString()}`);
  };

  return (
    <section className="bg-[#F5F3EE] pt-8 pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Headline */}
        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold text-gray-900 leading-tight tracking-tight max-w-2xl">
            Real estate for living<br />and investments
          </h1>
        </div>

        {/* Main split card */}
        <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
          <div className="flex flex-col lg:flex-row">

            {/* Property Image */}
            <div className="relative lg:w-2/3 h-72 sm:h-96 lg:h-[480px] flex-shrink-0">
              <Image
                src={FEATURED.image}
                alt="Featured property"
                fill priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 67vw"
              />
            </div>

            {/* Property Info Card */}
            <div className="lg:w-1/3 p-8 flex flex-col justify-between border-l border-gray-100">
              <div>
                {/* Bookmark */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">{FEATURED.address}</p>
                  </div>
                  <button className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:border-gray-300 transition-colors flex-shrink-0">
                    <Bookmark className="w-4 h-4" />
                  </button>
                </div>

                {/* Specs */}
                <div className="flex items-center gap-6 mb-8">
                  <div>
                    <p className="text-3xl font-bold text-gray-900">{FEATURED.beds}</p>
                    <p className="text-xs text-gray-400 mt-0.5">beds</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-gray-900">{FEATURED.baths}</p>
                    <p className="text-xs text-gray-400 mt-0.5">baths</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-gray-900">{FEATURED.area}</p>
                    <p className="text-xs text-gray-400 mt-0.5">area</p>
                  </div>
                </div>

                {/* Price */}
                <p className="text-3xl font-bold text-gray-900 mb-6">{FEATURED.price}<span className="text-base font-normal text-gray-400">/mo</span></p>

                {/* Agent */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {FEATURED.agent.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Agent</p>
                      <p className="text-sm font-semibold text-gray-900">{FEATURED.agent.name}</p>
                    </div>
                  </div>
                  <button className="text-xs font-semibold border border-gray-200 px-4 py-2 rounded-full hover:bg-gray-100 transition-colors">
                    Contact
                  </button>
                </div>
              </div>

              <Link href="/search"
                className="w-full bg-gray-900 hover:bg-gray-700 text-white font-semibold text-sm py-4 rounded-2xl text-center transition-colors block">
                Browse Properties →
              </Link>
            </div>
          </div>

          {/* Search bar */}
          <div className="border-t border-gray-100 px-6 py-4">
            <div className="flex flex-col sm:flex-row items-center gap-3">

              {/* Location */}
              <div className="flex items-center gap-2 flex-1 min-w-0 border border-gray-200 rounded-full px-4 py-2.5 hover:border-gray-300 transition-colors bg-white">
                <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <input
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  placeholder="Location — Nairobi, Mombasa..."
                  className="text-sm text-gray-700 bg-transparent focus:outline-none placeholder:text-gray-400 flex-1 min-w-0"
                />
              </div>

              {/* Property type */}
              <div className="flex items-center gap-2 border border-gray-200 rounded-full px-4 py-2.5 hover:border-gray-300 transition-colors bg-white min-w-[160px] cursor-pointer">
                <Building2 className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <select className="text-sm text-gray-700 bg-transparent focus:outline-none appearance-none flex-1 cursor-pointer">
                  {PROPERTY_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>

              {/* Price */}
              <div className="flex items-center gap-2 border border-gray-200 rounded-full px-4 py-2.5 hover:border-gray-300 transition-colors bg-white min-w-[140px] cursor-pointer">
                <DollarSign className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <select className="text-sm text-gray-700 bg-transparent focus:outline-none appearance-none flex-1 cursor-pointer">
                  {PRICE_RANGES.map(p => <option key={p}>{p}</option>)}
                </select>
              </div>

              {/* Bedrooms */}
              <div className="flex items-center gap-2 border border-gray-200 rounded-full px-4 py-2.5 hover:border-gray-300 transition-colors bg-white min-w-[140px] cursor-pointer">
                <BedDouble className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <select className="text-sm text-gray-700 bg-transparent focus:outline-none appearance-none flex-1 cursor-pointer">
                  {BEDROOM_OPTIONS.map(b => <option key={b}>{b}</option>)}
                </select>
              </div>

              {/* More */}
              <button className="flex items-center gap-2 border border-gray-200 rounded-full px-4 py-2.5 hover:border-gray-300 transition-colors text-sm text-gray-600 bg-white whitespace-nowrap">
                <SlidersHorizontal className="w-4 h-4" /> More
              </button>

              {/* Search */}
              <button onClick={handleSearch}
                className="flex items-center gap-2 bg-gray-900 hover:bg-gray-700 text-white font-semibold text-sm px-6 py-2.5 rounded-full transition-colors whitespace-nowrap">
                <Search className="w-4 h-4" /> Search
              </button>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-10 py-6 border-b border-gray-200">
          {[["10K+", "Verified Listings"], ["47", "Counties Covered"], ["5K+", "Happy Renters"], ["98%", "Satisfaction Rate"]].map(([v, l]) => (
            <div key={l} className="text-center">
              <p className="text-xl font-bold text-gray-900">{v}</p>
              <p className="text-xs text-gray-400 mt-0.5">{l}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
