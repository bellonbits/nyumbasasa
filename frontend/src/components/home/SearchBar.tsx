"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Banknote, Home } from "lucide-react";
import { KENYA_COUNTIES, HOUSE_TYPES, BUDGET_RANGES } from "@/lib/utils";

export default function SearchBar() {
  const router = useRouter();
  const [county, setCounty] = useState("");
  const [budget, setBudget] = useState("");
  const [houseType, setHouseType] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (county)    params.set("county", county);
    if (budget) {
      const range = BUDGET_RANGES[Number(budget)];
      if (range) {
        params.set("minRent", String(range.min));
        params.set("maxRent", String(range.max));
      }
    }
    if (houseType) params.set("houseType", houseType);
    router.push(`/search?${params.toString()}`);
  };

  const selectClass =
    "w-full bg-transparent border-0 text-gray-700 text-sm font-medium focus:outline-none cursor-pointer " +
    "placeholder:text-gray-400 appearance-none";

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-2 flex flex-col md:flex-row gap-2">

      {/* County */}
      <div className="flex items-center gap-3 flex-1 px-4 py-3 rounded-xl hover:bg-surface-muted transition-colors">
        <MapPin className="w-5 h-5 text-brand-500 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <label className="block text-xs font-semibold text-gray-400 mb-0.5">Location</label>
          <select value={county} onChange={(e) => setCounty(e.target.value)} className={selectClass}>
            <option value="">All Counties</option>
            {KENYA_COUNTIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="hidden md:block w-px bg-gray-200 my-2" />

      {/* Budget */}
      <div className="flex items-center gap-3 flex-1 px-4 py-3 rounded-xl hover:bg-surface-muted transition-colors">
        <Banknote className="w-5 h-5 text-brand-500 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <label className="block text-xs font-semibold text-gray-400 mb-0.5">Budget (KES/mo)</label>
          <select value={budget} onChange={(e) => setBudget(e.target.value)} className={selectClass}>
            <option value="">Any Budget</option>
            {BUDGET_RANGES.map((r, i) => (
              <option key={i} value={i}>{r.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="hidden md:block w-px bg-gray-200 my-2" />

      {/* House Type */}
      <div className="flex items-center gap-3 flex-1 px-4 py-3 rounded-xl hover:bg-surface-muted transition-colors">
        <Home className="w-5 h-5 text-brand-500 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <label className="block text-xs font-semibold text-gray-400 mb-0.5">House Type</label>
          <select value={houseType} onChange={(e) => setHouseType(e.target.value)} className={selectClass}>
            <option value="">All Types</option>
            {HOUSE_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Search Button */}
      <button
        onClick={handleSearch}
        className="flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 active:bg-brand-700
                   text-white font-bold px-8 py-4 rounded-xl transition-all duration-200 shadow-lg
                   hover:shadow-brand-500/30 whitespace-nowrap min-w-[140px]"
      >
        <Search className="w-5 h-5" />
        Search Now
      </button>
    </div>
  );
}
