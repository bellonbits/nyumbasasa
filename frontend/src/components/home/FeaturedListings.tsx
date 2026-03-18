"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Loader2, Flame } from "lucide-react";
import PropertyCard from "@/components/listings/PropertyCard";
import { useFeaturedProperties } from "@/hooks/useProperties";

const TABS = [
  { label: "All",        value: "" },
  { label: "Bedsitter",  value: "bedsitter" },
  { label: "Studio",     value: "studio" },
  { label: "1 Bedroom",  value: "one_bedroom" },
  { label: "2 Bedrooms", value: "two_bedroom" },
];

export default function FeaturedListings() {
  const { data: properties, isLoading } = useFeaturedProperties();
  const [activeTab, setActiveTab] = useState("");

  const filtered = (properties ?? []).filter(
    (p) => !activeTab || p.houseType.toLowerCase() === activeTab
  );

  return (
    <section className="bg-surface py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Header ─────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Flame className="w-4 h-4 text-accent" />
              <span className="section-label">Hot Listings</span>
            </div>
            <h2 className="text-display-sm font-extrabold text-ink leading-tight">
              Latest Properties Near You
            </h2>
          </div>
          <Link
            href="/search"
            className="btn-primary whitespace-nowrap self-start sm:self-auto"
          >
            View All <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* ── Type tabs ──────────────────────────────────────── */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-1 scrollbar-hide">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`text-sm font-semibold px-5 py-2 rounded-full whitespace-nowrap transition-all ${
                activeTab === tab.value
                  ? "bg-brand-500 text-white shadow-blue"
                  : "bg-white text-ink-muted hover:text-ink hover:bg-surface-muted border border-surface-border"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Grid ───────────────────────────────────────────── */}
        {isLoading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
          </div>
        ) : !filtered || filtered.length === 0 ? (
          <div className="text-center py-24 text-ink-faint">
            <p className="text-lg font-semibold mb-1">No listings yet</p>
            <p className="text-sm">Properties appear here once verified.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.slice(0, 6).map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
