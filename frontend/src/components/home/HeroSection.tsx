"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Building2, Search, ChevronDown, TrendingUp, Shield, Sparkles } from "lucide-react";

const SLIDES = [
  {
    image: "https://willstonehomes.ke/wp-content/uploads/2025/02/DJI_0661-1-1-scaled.jpg",
    tag: "Nairobi",
    label: "Modern Homes · Nairobi",
  },
  {
    image: "https://www.worldbank.org/content/dam/photos/780x439/2017/apr-1/ke-kenya-needs-2-million-more-low-income-homes-building-them-would-boost-its-economic-growth-homepage-780x439.jpg",
    tag: "Kenya",
    label: "Affordable Housing · Kenya",
  },
  {
    image: "https://archistra.co.ke/wp-content/uploads/2023/11/2B-Kawangware-along-Nyakinyua-road.png",
    tag: "Westlands",
    label: "2 Bedrooms · Kawangware",
  },
  {
    image: "https://resources.pamgolding.co.za/content/properties/202406/2134695/h/2134695_H_11.jpg?w=1000",
    tag: "Mombasa",
    label: "Luxury Homes · Coast",
  },
];

const PROPERTY_TYPES = ["Any", "Bedsitter", "Studio", "1 Bedroom", "2 Bedrooms", "3 Bedrooms"];

const STATS = [
  { value: "10K+", label: "Listings" },
  { value: "47",   label: "Counties" },
  { value: "5K+",  label: "Renters"  },
  { value: "98%",  label: "Satisfied" },
];

const QUICK = ["Bedsitter Nairobi", "Studio Mombasa", "2BR Westlands", "Bedsitter Kisumu"];

export default function HeroSection() {
  const router = useRouter();
  const [location, setLocation] = useState("");
  const [type, setType] = useState("Any");
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % SLIDES.length), 5500);
    return () => clearInterval(t);
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location) params.set("county", location);
    if (type !== "Any") {
      const map: Record<string, string> = {
        Bedsitter: "bedsitter", Studio: "studio",
        "1 Bedroom": "one_bedroom", "2 Bedrooms": "two_bedroom", "3 Bedrooms": "three_bedroom",
      };
      if (map[type]) params.set("houseType", map[type]);
    }
    router.push(`/search?${params.toString()}`);
  };

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden -mt-16">

      {/* Background slideshow */}
      {SLIDES.map((s, i) => (
        <div
          key={s.image}
          style={{ transition: "opacity 1500ms ease-in-out" }}
          className={`absolute inset-0 ${i === slide ? "opacity-100" : "opacity-0"}`}
        >
          <Image
            src={s.image} alt={s.tag} fill priority={i === 0}
            className="object-cover object-center"
            sizes="100vw"
          />
        </div>
      ))}

      {/* Layered overlays for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/10 to-transparent" />

      {/* Trust badge */}
      <div className="absolute top-24 right-6 hidden lg:flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-medium px-4 py-2.5 rounded-full animate-float">
        <Shield className="w-3.5 h-3.5 text-brand-400 flex-shrink-0" />
        All listings verified
      </div>

      {/* Slide label — bottom right */}
      <div className="absolute bottom-10 right-6 hidden lg:flex items-center gap-2 bg-black/30 backdrop-blur-sm border border-white/15 text-white/80 text-xs px-4 py-2 rounded-full z-10">
        <MapPin className="w-3 h-3 text-brand-400 flex-shrink-0" />
        {SLIDES[slide].label}
      </div>

      {/* Slide dots */}
      <div className="absolute right-5 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-2 z-10">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setSlide(i)}
            className={`w-1.5 rounded-full transition-all duration-300 ${
              i === slide ? "h-8 bg-white" : "h-3 bg-white/35 hover:bg-white/65"
            }`}
          />
        ))}
      </div>

      {/* ── Centered content ── */}
      <div className="relative z-10 flex-1 flex items-center">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-brand-500/20 backdrop-blur-sm border border-brand-400/40 text-brand-300 text-xs font-bold px-4 py-1.5 rounded-full mb-6 animate-fade-up">
            <TrendingUp className="w-3.5 h-3.5 flex-shrink-0" />
            Kenya&apos;s #1 Rental Platform
          </div>

          {/* Headline */}
          <h1 className="font-heading font-bold text-white leading-[1.08] tracking-tight mb-5 animate-fade-up-1
                         text-4xl sm:text-5xl md:text-6xl lg:text-7xl max-w-3xl">
            Find Your<br />
            <span className="text-gradient">Perfect Home</span><br />
            in Kenya
          </h1>

          {/* Sub-text */}
          <p className="text-white/70 text-base sm:text-lg max-w-lg mb-10 leading-relaxed animate-fade-up-2">
            Thousands of verified rentals across all 47 counties —
            bedsitters, studios &amp; family homes for every budget.
          </p>

          {/* ── Search card ── */}
          <div className="bg-white rounded-2xl shadow-2xl shadow-black/30 mb-10 w-full max-w-2xl animate-fade-up-3 overflow-hidden">

            {/* Inputs row */}
            <div className="flex flex-col sm:flex-row">
              {/* Location */}
              <div className="flex items-center gap-3 flex-1 px-5 py-4 border-b sm:border-b-0 sm:border-r border-gray-100">
                <MapPin className="w-4 h-4 text-brand-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold text-brand-500 uppercase tracking-widest mb-0.5">Location</p>
                  <input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    placeholder="City or county…"
                    className="text-sm font-medium text-gray-900 placeholder:text-gray-400 bg-transparent focus:outline-none w-full"
                  />
                </div>
              </div>

              {/* Type */}
              <div className="flex items-center gap-3 px-5 py-4 border-b sm:border-b-0 sm:border-r border-gray-100 sm:min-w-[180px]">
                <Building2 className="w-4 h-4 text-brand-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold text-brand-500 uppercase tracking-widest mb-0.5">Property Type</p>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="text-sm font-medium text-gray-900 bg-transparent focus:outline-none appearance-none w-full cursor-pointer"
                  >
                    {PROPERTY_TYPES.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              {/* Search button */}
              <button
                onClick={handleSearch}
                className="flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-white font-bold text-sm px-8 py-4 transition-all active:scale-[0.98] whitespace-nowrap"
              >
                <Search className="w-4 h-4" />
                <span>Search</span>
              </button>
            </div>

            {/* Quick filters */}
            <div className="flex items-center gap-2 px-4 py-2.5 border-t border-gray-50 bg-gray-50/50 overflow-x-auto scrollbar-hide">
              <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider whitespace-nowrap flex-shrink-0 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Popular
              </span>
              <div className="w-px h-3 bg-gray-200 flex-shrink-0" />
              {QUICK.map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    const parts = tag.split(" ");
                    router.push(`/search?county=${parts[parts.length - 1]}`);
                  }}
                  className="text-xs text-gray-500 hover:text-brand-600 hover:bg-brand-50 px-3 py-1 rounded-full whitespace-nowrap transition-colors flex-shrink-0 border border-gray-200 hover:border-brand-200"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* ── Stats row ── */}
          <div className="flex flex-wrap items-center gap-6 sm:gap-0 animate-fade-up-3">
            {STATS.map(({ value, label }, i) => (
              <div
                key={label}
                className={`flex flex-col ${
                  i > 0 ? "sm:pl-8 sm:border-l sm:border-white/20" : ""
                } sm:pr-8`}
              >
                <span className="text-2xl sm:text-3xl font-bold text-white leading-none">{value}</span>
                <span className="text-white/50 text-xs mt-1">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 animate-bounce opacity-50">
        <ChevronDown className="w-5 h-5 text-white" />
      </div>
    </section>
  );
}
