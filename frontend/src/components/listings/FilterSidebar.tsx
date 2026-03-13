"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import { KENYA_COUNTIES, HOUSE_TYPES, BUDGET_RANGES, cn } from "@/lib/utils";

interface FilterSidebarProps {
  className?: string;
}

export default function FilterSidebar({ className }: FilterSidebarProps) {
  const router = useRouter();
  const params = useSearchParams();

  const [county,    setCounty]    = useState(params.get("county")    ?? "");
  const [houseType, setHouseType] = useState(params.get("houseType") ?? "");
  const [minRent,   setMinRent]   = useState(params.get("minRent")   ?? "");
  const [maxRent,   setMaxRent]   = useState(params.get("maxRent")   ?? "");

  const apply = () => {
    const p = new URLSearchParams();
    if (county)    p.set("county", county);
    if (houseType) p.set("houseType", houseType);
    if (minRent)   p.set("minRent", minRent);
    if (maxRent)   p.set("maxRent", maxRent);
    router.push(`/search?${p.toString()}`);
  };

  const reset = () => {
    setCounty(""); setHouseType(""); setMinRent(""); setMaxRent("");
    router.push("/search");
  };

  const selectClass = "w-full input-base text-sm";
  const SectionTitle = ({ label }: { label: string }) => (
    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">{label}</h4>
  );

  return (
    <aside className={cn("bg-white rounded-2xl border border-gray-100 shadow-sm p-6", className)}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-brand-500" />
          <h3 className="font-bold text-gray-900">Filters</h3>
        </div>
        <button onClick={reset} className="text-xs text-gray-400 hover:text-brand-500 flex items-center gap-1 transition-colors">
          <X className="w-3.5 h-3.5" /> Clear all
        </button>
      </div>

      <div className="space-y-6">
        {/* County */}
        <div>
          <SectionTitle label="County" />
          <select value={county} onChange={(e) => setCounty(e.target.value)} className={selectClass}>
            <option value="">All Counties</option>
            {KENYA_COUNTIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* House Type */}
        <div>
          <SectionTitle label="House Type" />
          <div className="space-y-2">
            {HOUSE_TYPES.map((t) => (
              <label key={t.value} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="radio"
                  name="houseType"
                  value={t.value}
                  checked={houseType === t.value}
                  onChange={() => setHouseType(t.value)}
                  className="w-4 h-4 text-brand-500 border-gray-300 focus:ring-brand-400"
                />
                <span className="text-sm text-gray-700 group-hover:text-brand-500 transition-colors">{t.label}</span>
              </label>
            ))}
            {houseType && (
              <button onClick={() => setHouseType("")} className="text-xs text-gray-400 hover:text-brand-500 mt-1">
                Clear selection
              </button>
            )}
          </div>
        </div>

        {/* Budget Range */}
        <div>
          <SectionTitle label="Budget (KES/month)" />
          <div className="space-y-2">
            {BUDGET_RANGES.map((r, i) => (
              <label key={i} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="radio"
                  name="budget"
                  checked={minRent === String(r.min) && maxRent === String(r.max)}
                  onChange={() => { setMinRent(String(r.min)); setMaxRent(String(r.max)); }}
                  className="w-4 h-4 text-brand-500 border-gray-300 focus:ring-brand-400"
                />
                <span className="text-sm text-gray-700 group-hover:text-brand-500 transition-colors">{r.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Custom range */}
        <div>
          <SectionTitle label="Custom Range" />
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Min (KES)</label>
              <input type="number" value={minRent} onChange={(e) => setMinRent(e.target.value)}
                placeholder="0" className={selectClass} />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Max (KES)</label>
              <input type="number" value={maxRent} onChange={(e) => setMaxRent(e.target.value)}
                placeholder="50000" className={selectClass} />
            </div>
          </div>
        </div>
      </div>

      <button onClick={apply} className="w-full btn-primary mt-8 text-center">
        Apply Filters
      </button>
    </aside>
  );
}
