"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MapPin } from "lucide-react";
import { formatKES, houseTypeLabel } from "@/lib/utils";
import { useFeaturedProperties } from "@/hooks/useProperties";

export default function YouMightLike() {
  const { data: properties } = useFeaturedProperties();
  // Show a different slice (offset 2) so it doesn't repeat FeaturedListings exactly
  const picks = properties ? properties.slice(2, 6) : [];

  if (picks.length === 0) return null;

  return (
    <section className="bg-white py-16 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">You might be interested in</h2>
          <Link href="/search"
            className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 border border-gray-200 hover:border-gray-400 px-4 py-2 rounded-full transition-all">
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {picks.map((p) => (
            <Link key={p.id} href={`/property/${p.id}`}
              className="group block bg-white rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100">
              <div className="relative h-48 overflow-hidden bg-gray-100">
                {p.images[0] && (
                  <Image src={p.images[0].url} alt={p.title} fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" />
                )}
              </div>
              <div className="p-4">
                <p className="text-xl font-bold text-gray-900 mb-1">
                  {formatKES(p.rent)}<span className="text-sm font-normal text-gray-400">/mo</span>
                </p>
                <p className="text-sm font-medium text-gray-700 mb-2 truncate">{houseTypeLabel(p.houseType)}</p>
                <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                  <MapPin className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">{p.town.name}, {p.county.name}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
