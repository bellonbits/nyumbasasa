"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MapPin } from "lucide-react";
import { formatKES, houseTypeLabel } from "@/lib/utils";
import { useFeaturedProperties } from "@/hooks/useProperties";

export default function YouMightLike() {
  const { data: properties } = useFeaturedProperties();
  // Show a different slice so it doesn't repeat FeaturedListings
  const picks = properties ? properties.slice(2, 6) : [];

  if (picks.length === 0) return null;

  return (
    <section className="bg-white py-16 border-t border-surface-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex items-center justify-between mb-8">
          <h2 className="text-display-sm font-extrabold text-ink">You might be interested in</h2>
          <Link
            href="/search"
            className="flex items-center gap-1.5 text-sm font-semibold text-ink-muted border border-surface-border hover:border-brand-300 hover:text-brand-600 px-4 py-2 rounded-full transition-all"
          >
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {picks.map((p) => (
            <Link
              key={p.id}
              href={`/property/${p.id}`}
              className="group block bg-white rounded-2xl overflow-hidden border border-surface-border hover:border-brand-200 hover:shadow-card-hover transition-all duration-300"
            >
              <div className="relative h-48 overflow-hidden bg-surface-muted">
                {p.images[0] && (
                  <Image
                    src={p.images[0].url}
                    alt={p.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                )}
              </div>
              <div className="p-4">
                <p className="text-xl font-extrabold text-ink mb-1 tracking-tight">
                  {formatKES(p.rent)}<span className="text-sm font-normal text-ink-faint">/mo</span>
                </p>
                <p className="text-sm font-medium text-ink-muted mb-2 truncate">{houseTypeLabel(p.houseType)}</p>
                <div className="flex items-center gap-1.5 text-ink-faint text-xs">
                  <MapPin className="w-3 h-3 flex-shrink-0 text-brand-400" />
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
