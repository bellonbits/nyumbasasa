"use client";

import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import PropertyCard from "@/components/listings/PropertyCard";
import { useFeaturedProperties } from "@/hooks/useProperties";

export default function FeaturedListings() {
  const { data: properties, isLoading } = useFeaturedProperties();

  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Latest in your area</h2>
          <Link href="/search"
            className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 border border-gray-200 hover:border-gray-400 px-4 py-2 rounded-full transition-all">
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
          </div>
        ) : !properties || properties.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg font-medium mb-2">No listings yet</p>
            <p className="text-sm">Properties will appear here once they are verified.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {properties.slice(0, 6).map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
