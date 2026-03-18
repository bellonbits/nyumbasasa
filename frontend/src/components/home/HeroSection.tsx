"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  MapPin, Building2, ChevronDown, TrendingUp, Shield,
  Sparkles, DollarSign, SlidersHorizontal, Search,
} from "lucide-react";
import { BUDGET_RANGES } from "@/lib/utils";

const SLIDES = [
  { image: "https://willstonehomes.ke/wp-content/uploads/2025/02/DJI_0661-1-1-scaled.jpg",       tag: "Nairobi",   label: "Modern Homes · Nairobi"       },
  { image: "https://www.worldbank.org/content/dam/photos/780x439/2017/apr-1/ke-kenya-needs-2-million-more-low-income-homes-building-them-would-boost-its-economic-growth-homepage-780x439.jpg", tag: "Kenya",     label: "Affordable Housing · Kenya"   },
  { image: "https://archistra.co.ke/wp-content/uploads/2023/11/2B-Kawangware-along-Nyakinyua-road.png",  tag: "Westlands", label: "2 Bedrooms · Kawangware"      },
  { image: "https://resources.pamgolding.co.za/content/properties/202406/2134695/h/2134695_H_11.jpg?w=1000", tag: "Mombasa",   label: "Luxury Homes · Coast"         },
];

const PROPERTY_TYPES = [
  { label: "Any Type",    value: "" },
  { label: "Bedsitter",   value: "bedsitter" },
  { label: "Studio",      value: "studio" },
  { label: "1 Bedroom",   value: "one_bedroom" },
  { label: "2 Bedrooms",  value: "two_bedroom" },
  { label: "3 Bedrooms",  value: "three_bedroom" },
];

const STATS = [
  { value: "10K+", label: "Listings"  },
  { value: "47",   label: "Counties"  },
  { value: "5K+",  label: "Renters"   },
  { value: "98%",  label: "Satisfied" },
];

const QUICK = ["Nairobi", "Mombasa", "Westlands", "Kisumu", "Nakuru"];

// ── Divider ───────────────────────────────────────────────────────────────────
function Divider() {
  return <div className="hidden sm:block w-px h-8 bg-gray-200 shrink-0" />;
}

export default function HeroSection() {
  const router = useRouter();
  const [location, setLocation] = useState("");
  const [type,     setType]     = useState("");
  const [budget,   setBudget]   = useState("");
  const [slide,    setSlide]    = useState(0);

  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % SLIDES.length), 5500);
    return () => clearInterval(t);
  }, []);

  const handleSearch = () => {
    const p = new URLSearchParams();
    if (location) p.set("county", location);
    if (type)     p.set("houseType", type);
    const range = BUDGET_RANGES.find((r) => `${r.min}-${r.max}` === budget);
    if (range) {
      p.set("minRent", String(range.min));
      p.set("maxRent", String(range.max));
    }
    router.push(`/search?${p.toString()}`);
  };

  const budgetLabel = BUDGET_RANGES.find((r) => `${r.min}-${r.max}` === budget)?.label ?? "Any Budget";
  const typeLabel   = PROPERTY_TYPES.find((t) => t.value === type)?.label ?? "Any Type";

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden -mt-16">

      {/* ── Background slideshow ──────────────────────────── */}
      {SLIDES.map((s, i) => (
        <div
          key={s.image}
          style={{ transition: "opacity 1500ms ease-in-out" }}
          className={`absolute inset-0 ${i === slide ? "opacity-100" : "opacity-0"}`}
        >
          <Image src={s.image} alt={s.tag} fill priority={i === 0}
            className="object-cover object-center" sizes="100vw" />
        </div>
      ))}

      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/65 to-black/35" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />

      {/* Trust badge */}
      <div className="absolute top-24 right-6 hidden lg:flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-semibold px-4 py-2.5 rounded-full animate-float">
        <Shield className="w-3.5 h-3.5 text-brand-300 shrink-0" />
        All listings verified
      </div>

      {/* Slide label */}
      <div className="absolute bottom-10 right-6 hidden lg:flex items-center gap-2 bg-black/30 backdrop-blur-sm border border-white/15 text-white/75 text-xs px-4 py-2 rounded-full z-10">
        <MapPin className="w-3 h-3 text-brand-300 shrink-0" />
        {SLIDES[slide].label}
      </div>

      {/* Slide dots */}
      <div className="absolute right-5 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-2 z-10">
        {SLIDES.map((_, i) => (
          <button key={i} onClick={() => setSlide(i)}
            className={`w-1.5 rounded-full transition-all duration-300 ${
              i === slide ? "h-8 bg-white" : "h-3 bg-white/35 hover:bg-white/65"
            }`}
          />
        ))}
      </div>

      {/* ── Centered content ─────────────────────────────── */}
      <div className="relative z-10 flex-1 flex items-center">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-brand-500/25 backdrop-blur-sm border border-brand-400/40 text-brand-200 text-xs font-bold px-4 py-1.5 rounded-full mb-6 animate-fade-up">
            <TrendingUp className="w-3.5 h-3.5 shrink-0" />
            Kenya&apos;s #1 Rental Platform
          </div>

          {/* Headline */}
          <h1 className="font-heading font-extrabold text-white leading-[1.07] tracking-tight mb-5 animate-fade-up-1
                         text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] max-w-3xl">
            Find Your<br />
            <span className="text-gradient">Perfect Home</span><br />
            in Kenya
          </h1>

          {/* Sub-text */}
          <p className="text-white/65 text-base sm:text-lg max-w-xl mb-8 leading-relaxed animate-fade-up-2">
            Thousands of verified rentals across all 47 counties —
            bedsitters, studios &amp; family homes for every budget.
          </p>

          {/* ── Pill search bar ───────────────────────────── */}
          <div className="w-full max-w-3xl animate-fade-up-3 mb-4">
            <div className="flex items-center bg-white rounded-full shadow-2xl shadow-black/30 overflow-hidden">

              {/* Location */}
              <div className="flex items-center gap-2.5 px-5 py-4 flex-1 min-w-0 cursor-text">
                <MapPin className="w-4 h-4 text-ink-faint shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-semibold text-ink-faint leading-none mb-0.5">Location</p>
                  <input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    placeholder="City or county"
                    className="text-sm font-semibold text-ink placeholder:text-ink-faint bg-transparent focus:outline-none w-full leading-none"
                  />
                </div>
              </div>

              <Divider />

              {/* Property type */}
              <div className="flex items-center gap-2.5 px-5 py-4 shrink-0">
                <Building2 className="w-4 h-4 text-ink-faint shrink-0" />
                <div>
                  <p className="text-[10px] font-semibold text-ink-faint leading-none mb-0.5">Property type</p>
                  <div className="relative flex items-center gap-1">
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="text-sm font-semibold text-ink bg-transparent focus:outline-none appearance-none cursor-pointer leading-none pr-4"
                    >
                      {PROPERTY_TYPES.map((t) => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                    <ChevronDown className="w-3 h-3 text-ink-faint absolute right-0 pointer-events-none" />
                  </div>
                </div>
              </div>

              <Divider />

              {/* Budget / Price */}
              <div className="hidden sm:flex items-center gap-2.5 px-5 py-4 shrink-0">
                <DollarSign className="w-4 h-4 text-ink-faint shrink-0" />
                <div>
                  <p className="text-[10px] font-semibold text-ink-faint leading-none mb-0.5">Price</p>
                  <div className="relative flex items-center gap-1">
                    <select
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      className="text-sm font-semibold text-ink bg-transparent focus:outline-none appearance-none cursor-pointer leading-none pr-4 max-w-[130px]"
                    >
                      <option value="">Any Budget</option>
                      {BUDGET_RANGES.map((r) => (
                        <option key={r.label} value={`${r.min}-${r.max}`}>{r.label}</option>
                      ))}
                    </select>
                    <ChevronDown className="w-3 h-3 text-ink-faint absolute right-0 pointer-events-none" />
                  </div>
                </div>
              </div>

              <Divider />

              {/* More filters */}
              <button
                onClick={() => router.push("/search")}
                className="hidden sm:flex items-center gap-2 px-4 py-4 text-sm font-semibold text-ink-muted hover:text-ink hover:bg-gray-50 transition-colors shrink-0 whitespace-nowrap"
              >
                <SlidersHorizontal className="w-4 h-4" />
                More
              </button>

              {/* Search button — black pill */}
              <button
                onClick={handleSearch}
                className="bg-[#191919] hover:bg-black text-white font-bold text-sm px-7 py-4 rounded-full mx-1.5 transition-colors whitespace-nowrap shrink-0 flex items-center gap-2"
              >
                <Search className="w-4 h-4" />
                Search
              </button>
            </div>
          </div>

          {/* Quick filters */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1 animate-fade-up-3">
            <span className="text-[10px] text-white/40 font-semibold uppercase tracking-wider whitespace-nowrap shrink-0 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Popular
            </span>
            <span className="text-white/20 text-xs shrink-0">·</span>
            {QUICK.map((county) => (
              <button
                key={county}
                onClick={() => router.push(`/search?county=${county}`)}
                className="text-xs text-white/60 hover:text-white border border-white/20 hover:border-white/50 px-3.5 py-1.5 rounded-full whitespace-nowrap transition-all shrink-0 backdrop-blur-sm hover:bg-white/10"
              >
                {county}
              </button>
            ))}
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap items-center gap-6 sm:gap-0 mt-10 animate-fade-up-4">
            {STATS.map(({ value, label }, i) => (
              <div key={label} className={`flex flex-col ${i > 0 ? "sm:pl-8 sm:border-l sm:border-white/20" : ""} sm:pr-8`}>
                <span className="text-2xl sm:text-3xl font-extrabold text-white leading-none tracking-tight">{value}</span>
                <span className="text-white/45 text-xs mt-1">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
