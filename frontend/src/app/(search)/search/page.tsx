"use client";
/// <reference types="@types/google.maps" />

import { Suspense, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { useSearchParams, useRouter } from "next/navigation";
import {
  LayoutGrid, Map, SlidersHorizontal, Loader2,
  ChevronLeft, ChevronRight, Search, X, ChevronDown, Navigation2,
  MapPin, Building2, DollarSign,
} from "lucide-react";
import PropertyCard from "@/components/listings/PropertyCard";

const GoogleMapPanel = dynamic(() => import("@/components/map/GoogleMapPanel"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full rounded-xl bg-surface-muted flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
    </div>
  ),
});
import { usePropertySearch } from "@/hooks/useProperties";
import type { SearchFilters } from "@/types";
import { cn, KENYA_COUNTIES, HOUSE_TYPES, BUDGET_RANGES } from "@/lib/utils";
import { toast } from "sonner";

// ── Pill divider ─────────────────────────────────────────────────────────────
function PillDivider() {
  return <div className="hidden sm:block w-px h-7 bg-surface-border shrink-0" />;
}

// ── Filter bar — pill style ───────────────────────────────────────────────────
function FilterBar({ onNearMe, nearMeLoading }: { onNearMe: () => void; nearMeLoading: boolean }) {
  const router = useRouter();
  const params = useSearchParams();
  const [county,    setCounty]    = useState(params.get("county")    ?? "");
  const [houseType, setHouseType] = useState(params.get("houseType") ?? "");
  const [budget,    setBudget]    = useState(
    params.get("minRent") && params.get("maxRent")
      ? `${params.get("minRent")}-${params.get("maxRent")}`
      : ""
  );

  const apply = () => {
    const p = new URLSearchParams();
    if (county)    p.set("county", county);
    if (houseType) p.set("houseType", houseType);
    const range = BUDGET_RANGES.find((r) => `${r.min}-${r.max}` === budget);
    if (range) { p.set("minRent", String(range.min)); p.set("maxRent", String(range.max)); }
    router.push(`/search?${p.toString()}`);
  };

  const activeCount = [county, houseType, budget].filter(Boolean).length;

  return (
    <div className="bg-white border-b border-surface-border px-4 sm:px-6 lg:px-8 py-3">
      <div className="max-w-5xl mx-auto">
        {/* ── Pill bar ──────────────────────────────────────── */}
        <div className="flex items-center bg-white border border-surface-border rounded-full shadow-card overflow-hidden">

          {/* Location */}
          <div className="flex items-center gap-2.5 px-5 py-3 flex-1 min-w-0">
            <MapPin className="w-4 h-4 text-ink-faint shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-semibold text-ink-faint leading-none mb-0.5">Location</p>
              <select
                value={county}
                onChange={(e) => setCounty(e.target.value)}
                className="text-sm font-semibold text-ink bg-transparent focus:outline-none cursor-pointer appearance-none w-full leading-none"
              >
                <option value="">All Counties</option>
                {KENYA_COUNTIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <PillDivider />

          {/* Property type */}
          <div className="hidden sm:flex items-center gap-2.5 px-5 py-3 shrink-0">
            <Building2 className="w-4 h-4 text-ink-faint shrink-0" />
            <div>
              <p className="text-[10px] font-semibold text-ink-faint leading-none mb-0.5">Property type</p>
              <div className="relative flex items-center gap-1">
                <select
                  value={houseType}
                  onChange={(e) => setHouseType(e.target.value)}
                  className="text-sm font-semibold text-ink bg-transparent focus:outline-none appearance-none cursor-pointer leading-none pr-4"
                >
                  <option value="">All Types</option>
                  {HOUSE_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
                <ChevronDown className="w-3 h-3 text-ink-faint absolute right-0 pointer-events-none" />
              </div>
            </div>
          </div>

          <PillDivider />

          {/* Price */}
          <div className="hidden md:flex items-center gap-2.5 px-5 py-3 shrink-0">
            <DollarSign className="w-4 h-4 text-ink-faint shrink-0" />
            <div>
              <p className="text-[10px] font-semibold text-ink-faint leading-none mb-0.5">Price</p>
              <div className="relative flex items-center gap-1">
                <select
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="text-sm font-semibold text-ink bg-transparent focus:outline-none appearance-none cursor-pointer leading-none pr-4 max-w-[140px]"
                >
                  <option value="">Any Budget</option>
                  {BUDGET_RANGES.map((r) => <option key={r.label} value={`${r.min}-${r.max}`}>{r.label}</option>)}
                </select>
                <ChevronDown className="w-3 h-3 text-ink-faint absolute right-0 pointer-events-none" />
              </div>
            </div>
          </div>

          <PillDivider />

          {/* Near Me */}
          <button
            onClick={onNearMe}
            disabled={nearMeLoading}
            className="hidden sm:flex items-center gap-1.5 px-5 py-3 text-sm font-semibold text-ink-muted hover:text-ink hover:bg-gray-50 transition-colors whitespace-nowrap disabled:opacity-60 shrink-0"
          >
            {nearMeLoading
              ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
              : <Navigation2 className="w-3.5 h-3.5" />
            }
            Near Me
          </button>

          {/* More / Clear */}
          {activeCount > 0 ? (
            <button
              onClick={() => { setCounty(""); setHouseType(""); setBudget(""); router.push("/search"); }}
              className="hidden sm:flex items-center gap-1.5 px-4 py-3 text-sm font-semibold text-red-400 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0"
            >
              <X className="w-3.5 h-3.5" />
              Clear
            </button>
          ) : (
            <button className="hidden sm:flex items-center gap-1.5 px-4 py-3 text-sm font-semibold text-ink-muted hover:text-ink hover:bg-gray-50 transition-colors shrink-0 whitespace-nowrap">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              More
            </button>
          )}

          {/* Search — black pill button */}
          <button
            onClick={apply}
            className="bg-[#191919] hover:bg-black text-white font-bold text-sm px-6 py-3 rounded-full mx-1.5 transition-colors shrink-0 flex items-center gap-2 whitespace-nowrap"
          >
            <Search className="w-4 h-4" />
            Search
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main ─────────────────────────────────────────────────────────────────────
function SearchResults() {
  const params   = useSearchParams();
  const router   = useRouter();
  const [view, setView]                   = useState<"split" | "grid">("split");
  const [page, setPage]                   = useState(1);
  const [sort, setSort]                   = useState<"createdAt" | "rent" | "viewCount">("createdAt");
  const [userLocation, setUserLocation]   = useState<google.maps.LatLngLiteral | null>(null);
  const [nearMeLoading, setNearMeLoading] = useState(false);

  const handleNearMe = useCallback(() => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser.");
      return;
    }
    setNearMeLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setView("split");
        setNearMeLoading(false);
        toast.success("Showing houses near your location!");
      },
      () => {
        toast.error("Could not get your location. Please allow location access.");
        setNearMeLoading(false);
      },
      { timeout: 10000 }
    );
  }, []);

  const filters: SearchFilters = {
    county:    params.get("county")    ?? undefined,
    houseType: (params.get("houseType") as any) ?? undefined,
    minRent:   params.get("minRent")   ? Number(params.get("minRent")) : undefined,
    maxRent:   params.get("maxRent")   ? Number(params.get("maxRent")) : undefined,
    page,
    limit: 12,
    sortBy: sort,
    sortOrder: sort === "rent" ? "asc" : "desc",
  };

  const { data, isLoading, isFetching } = usePropertySearch(filters);
  const properties = data?.data ?? [];
  const meta       = data?.meta;
  const county     = params.get("county") ?? undefined;

  function Cards({ cols }: { cols: string }) {
    if (isLoading) return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <Loader2 className="w-10 h-10 text-brand-500 animate-spin" />
        <p className="text-ink-faint text-sm">Finding homes near you...</p>
      </div>
    );
    if (properties.length === 0) return (
      <div className="flex flex-col items-center justify-center h-64 text-center px-6">
        <SlidersHorizontal className="w-10 h-10 text-surface-border mb-3" />
        <h3 className="font-semibold text-ink mb-1">No properties found</h3>
        <p className="text-ink-faint text-sm">Try adjusting your filters.</p>
      </div>
    );
    return (
      <>
        <div className={cn("grid gap-4", cols)}>
          {properties.map((p) => <PropertyCard key={p.id} property={p} />)}
        </div>
        {meta && meta.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-6 pb-4">
            <button
              disabled={page === 1}
              onClick={() => setPage((n) => n - 1)}
              className="w-9 h-9 rounded-xl border border-surface-border flex items-center justify-center disabled:opacity-40 hover:border-brand-400 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: Math.min(meta.totalPages, 5) }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={cn(
                  "w-9 h-9 rounded-xl text-sm font-semibold transition-colors",
                  page === n
                    ? "bg-brand-500 text-white shadow-blue"
                    : "border border-surface-border text-ink-muted hover:border-brand-400 hover:text-brand-600"
                )}
              >
                {n}
              </button>
            ))}
            <button
              disabled={page === meta.totalPages}
              onClick={() => setPage((n) => n + 1)}
              className="w-9 h-9 rounded-xl border border-surface-border flex items-center justify-center disabled:opacity-40 hover:border-brand-400 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <FilterBar onNearMe={handleNearMe} nearMeLoading={nearMeLoading} />

      {/* Sub-header */}
      <div className="bg-white border-b border-surface-border px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="font-bold text-sm text-ink">
              {userLocation ? "Houses Near You" : county ? `${county} Rentals` : "Kenya Rentals"}
            </h1>
            <p className="text-ink-faint text-xs">
              {meta ? `${meta.total.toLocaleString()} homes found` : "Searching..."}
              {userLocation && <span className="text-brand-500 ml-2">· Near your location</span>}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Sort — pill */}
            <div className="flex items-center gap-1.5 border border-surface-border rounded-full px-4 py-2 hover:border-ink-faint transition-colors">
              <span className="text-xs text-ink-faint">Sort:</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as any)}
                className="text-xs font-semibold text-ink bg-transparent focus:outline-none cursor-pointer"
              >
                <option value="createdAt">Latest</option>
                <option value="rent">Price: Low</option>
                <option value="viewCount">Most Viewed</option>
              </select>
              <ChevronDown className="w-3 h-3 text-ink-faint" />
            </div>

            {/* View toggle — pill */}
            <div className="flex items-center border border-surface-border rounded-full overflow-hidden">
              <button
                onClick={() => setView("split")}
                className={cn(
                  "flex items-center gap-1.5 px-4 py-2 text-xs font-semibold transition-colors",
                  view === "split" ? "bg-[#191919] text-white" : "text-ink-muted hover:bg-surface-muted"
                )}
              >
                <Map className="w-3.5 h-3.5" /> Map
              </button>
              <button
                onClick={() => setView("grid")}
                className={cn(
                  "flex items-center gap-1.5 px-4 py-2 text-xs font-semibold border-l border-surface-border transition-colors",
                  view === "grid" ? "bg-[#191919] text-white" : "text-ink-muted hover:bg-surface-muted"
                )}
              >
                <LayoutGrid className="w-3.5 h-3.5" /> Grid
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      {view === "split" ? (
        <div className="flex flex-1 overflow-hidden">
          <div className="w-full lg:w-[520px] xl:w-[580px] flex-shrink-0 overflow-y-auto bg-surface p-4">
            <Cards cols="grid-cols-1 sm:grid-cols-2" />
          </div>
          <div className="hidden lg:flex flex-1 p-3 bg-white">
            <GoogleMapPanel
              properties={properties}
              county={county}
              userLocation={userLocation}
              onNearMe={handleNearMe}
              nearMeLoading={nearMeLoading}
            />
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto bg-surface px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-7xl mx-auto">
            <Cards cols="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" />
          </div>
        </div>
      )}

      {isFetching && !isLoading && (
        <div className="fixed bottom-6 right-6 bg-white shadow-card-hover rounded-full px-4 py-2 flex items-center gap-2 text-sm z-50 border border-surface-border">
          <Loader2 className="w-4 h-4 text-brand-500 animate-spin" />
          Updating...
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense>
      <SearchResults />
    </Suspense>
  );
}
