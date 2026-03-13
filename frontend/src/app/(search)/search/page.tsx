"use client";
/// <reference types="@types/google.maps" />

import { Suspense, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { useSearchParams, useRouter } from "next/navigation";
import {
  LayoutGrid, Map, SlidersHorizontal, Loader2,
  ChevronLeft, ChevronRight, Search, X, ChevronDown, Navigation2,
} from "lucide-react";
import PropertyCard from "@/components/listings/PropertyCard";

// Dynamic import with ssr:false prevents @react-google-maps/api from running on the server
// and avoids React error #438 (suspended during synchronous input / SSR mismatch)
const GoogleMapPanel = dynamic(() => import("@/components/map/GoogleMapPanel"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full rounded-xl bg-[#f2f8ee] flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
    </div>
  ),
});
import { usePropertySearch } from "@/hooks/useProperties";
import type { SearchFilters } from "@/types";
import { cn, KENYA_COUNTIES, HOUSE_TYPES, BUDGET_RANGES } from "@/lib/utils";
import { toast } from "sonner";

// ── Filter bar ──────────────────────────────────────────────────────────────
function FilterBar({ onNearMe, nearMeLoading }: { onNearMe: () => void; nearMeLoading: boolean }) {
  const router = useRouter();
  const params = useSearchParams();
  const [county, setCounty] = useState(params.get("county") ?? "");
  const [houseType, setHouseType] = useState(params.get("houseType") ?? "");
  const [budget, setBudget] = useState("");

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
    <div className="bg-white border-b border-gray-100 px-4 sm:px-6 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center gap-3 flex-wrap">
        {/* County */}
        <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2 flex-1 min-w-48 max-w-xs">
          <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <select value={county} onChange={(e) => setCounty(e.target.value)}
            className="flex-1 bg-transparent text-sm text-gray-700 focus:outline-none">
            <option value="">All Counties, Kenya</option>
            {KENYA_COUNTIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* House type */}
        <select value={houseType} onChange={(e) => setHouseType(e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none hover:border-brand-300 cursor-pointer">
          <option value="">All Types</option>
          {HOUSE_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>

        {/* Budget */}
        <select value={budget} onChange={(e) => setBudget(e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none hover:border-brand-300 cursor-pointer">
          <option value="">Any Budget</option>
          {BUDGET_RANGES.map((r) => <option key={r.label} value={`${r.min}-${r.max}`}>{r.label}</option>)}
        </select>

        <button onClick={apply}
          className="bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold px-5 py-2 rounded-xl transition-colors">
          Search
        </button>

        {/* Near Me */}
        <button
          onClick={onNearMe}
          disabled={nearMeLoading}
          className="flex items-center gap-1.5 text-sm font-semibold border border-brand-300 text-brand-600 hover:bg-brand-50 px-4 py-2 rounded-xl transition-colors disabled:opacity-60"
        >
          {nearMeLoading
            ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
            : <Navigation2 className="w-3.5 h-3.5" />
          }
          Near Me
        </button>

        {activeCount > 0 && (
          <button onClick={() => { setCounty(""); setHouseType(""); setBudget(""); router.push("/search"); }}
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-red-500 transition-colors">
            <X className="w-3.5 h-3.5" /> Clear ({activeCount})
          </button>
        )}
      </div>
    </div>
  );
}

// ── Main ─────────────────────────────────────────────────────────────────────
function SearchResults() {
  const params = useSearchParams();
  const router = useRouter();
  const [view, setView]         = useState<"split" | "grid">("split");
  const [page, setPage]         = useState(1);
  const [sort, setSort]         = useState<"createdAt" | "rent" | "viewCount">("createdAt");
  const [userLocation, setUserLocation] = useState<google.maps.LatLngLiteral | null>(null);
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
        setView("split");   // ensure map is visible
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
        <p className="text-gray-400 text-sm">Finding homes near you...</p>
      </div>
    );
    if (properties.length === 0) return (
      <div className="flex flex-col items-center justify-center h-64 text-center px-6">
        <SlidersHorizontal className="w-10 h-10 text-gray-300 mb-3" />
        <h3 className="font-semibold text-gray-700 mb-1">No properties found</h3>
        <p className="text-gray-400 text-sm">Try adjusting your filters.</p>
      </div>
    );
    return (
      <>
        <div className={cn("grid gap-4", cols)}>
          {properties.map((p) => <PropertyCard key={p.id} property={p} />)}
        </div>
        {meta && meta.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-6 pb-4">
            <button disabled={page === 1} onClick={() => setPage((n) => n - 1)}
              className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center disabled:opacity-40 hover:border-brand-400 transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: Math.min(meta.totalPages, 5) }, (_, i) => i + 1).map((n) => (
              <button key={n} onClick={() => setPage(n)}
                className={cn("w-9 h-9 rounded-xl text-sm font-semibold transition-colors",
                  page === n ? "bg-brand-500 text-white" : "border border-gray-200 text-gray-700 hover:border-brand-400")}>
                {n}
              </button>
            ))}
            <button disabled={page === meta.totalPages} onClick={() => setPage((n) => n + 1)}
              className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center disabled:opacity-40 hover:border-brand-400 transition-colors">
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
      <div className="bg-white border-b border-gray-100 px-4 sm:px-6 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="font-heading text-lg font-bold text-gray-900">
              {userLocation ? "Houses Near You" : county ? `${county} Rentals` : "Kenya Rentals"}
            </h1>
            <p className="text-gray-400 text-sm">
              {meta ? `${meta.total.toLocaleString()} homes found` : "Searching..."}
              {userLocation && <span className="text-blue-500 ml-2">· Showing your location on map</span>}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 border border-gray-200 rounded-xl px-3 py-2">
              <span className="text-xs text-gray-400">Sort by:</span>
              <select value={sort} onChange={(e) => setSort(e.target.value as any)}
                className="text-sm font-medium text-gray-700 bg-transparent focus:outline-none cursor-pointer">
                <option value="createdAt">Latest</option>
                <option value="rent">Price: Low</option>
                <option value="viewCount">Most Viewed</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </div>
            <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
              <button onClick={() => setView("split")}
                className={cn("flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors",
                  view === "split" ? "bg-gray-900 text-white" : "text-gray-500 hover:bg-gray-50")}>
                <Map className="w-4 h-4" /> Map
              </button>
              <button onClick={() => setView("grid")}
                className={cn("flex items-center gap-2 px-3 py-2 text-sm font-medium border-l border-gray-200 transition-colors",
                  view === "grid" ? "bg-gray-900 text-white" : "text-gray-500 hover:bg-gray-50")}>
                <LayoutGrid className="w-4 h-4" /> Grid
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      {view === "split" ? (
        <div className="flex flex-1 overflow-hidden">
          {/* Cards panel */}
          <div className="w-full lg:w-[520px] xl:w-[580px] flex-shrink-0 overflow-y-auto bg-[#FAFAF8] p-4">
            <Cards cols="grid-cols-1 sm:grid-cols-2" />
          </div>
          {/* Map panel */}
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
        <div className="flex-1 overflow-y-auto bg-[#FAFAF8] px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-7xl mx-auto">
            <Cards cols="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" />
          </div>
        </div>
      )}

      {isFetching && !isLoading && (
        <div className="fixed bottom-6 right-6 bg-white shadow-lg rounded-full px-4 py-2 flex items-center gap-2 text-sm z-50">
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
