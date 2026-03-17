import Image from "next/image";
import Link from "next/link";
import { MapPin, Heart, BadgeCheck, BedDouble, Bath, Maximize2 } from "lucide-react";
import { formatKES, houseTypeLabel, getPrimaryImage, cn } from "@/lib/utils";
import type { Property } from "@/types";

const BEDS: Record<string, string> = {
  bedsitter: "1", studio: "1", one_bedroom: "1", two_bedroom: "2", three_bedroom: "3",
  BEDSITTER: "1", STUDIO: "1", ONE_BEDROOM: "1", TWO_BEDROOM: "2", THREE_BEDROOM: "3",
};
const BATHS: Record<string, string> = {
  bedsitter: "1", studio: "1", one_bedroom: "1", two_bedroom: "2", three_bedroom: "2",
  BEDSITTER: "1", STUDIO: "1", ONE_BEDROOM: "1", TWO_BEDROOM: "2", THREE_BEDROOM: "2",
};
const AREA: Record<string, string> = {
  bedsitter: "25", studio: "38", one_bedroom: "55", two_bedroom: "80", three_bedroom: "115",
  BEDSITTER: "25", STUDIO: "38", ONE_BEDROOM: "55", TWO_BEDROOM: "80", THREE_BEDROOM: "115",
};

interface PropertyCardProps {
  property: Property;
  className?: string;
  compact?: boolean;
}

export default function PropertyCard({ property, className, compact = false }: PropertyCardProps) {
  const image = getPrimaryImage(property.images);

  return (
    <Link
      href={`/property/${property.id}`}
      className={cn(
        "group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-400 hover:-translate-y-1.5",
        className
      )}
    >
      {/* Image */}
      <div className={cn("relative overflow-hidden", compact ? "h-44" : "h-56")}>
        <Image
          src={image}
          alt={property.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        {/* Dark gradient on bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        {/* Top badges */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
          <div className="flex flex-col gap-1.5">
            {property.isBoosted && (
              <span className="bg-brand-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                FEATURED
              </span>
            )}
            {property.isVerified && (
              <span className="bg-blue-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                <BadgeCheck className="w-2.5 h-2.5" /> VERIFIED
              </span>
            )}
          </div>
          <button
            onClick={(e) => e.preventDefault()}
            className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 transition-all hover:scale-110 shadow-sm"
          >
            <Heart className="w-4 h-4" />
          </button>
        </div>

        {/* Price badge on image */}
        <div className="absolute bottom-3 left-3">
          <span className="bg-white text-gray-900 font-bold text-sm px-3 py-1.5 rounded-lg shadow-md">
            {formatKES(property.rent)}
            <span className="font-normal text-gray-500 text-xs">/mo</span>
          </span>
        </div>

        {/* House type pill */}
        <div className="absolute bottom-3 right-3">
          <span className="bg-brand-500/90 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
            {houseTypeLabel(property.houseType).toUpperCase()}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-3 line-clamp-1 group-hover:text-brand-600 transition-colors">
          {property.title}
        </h3>

        {/* Specs */}
        <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
          <span className="flex items-center gap-1.5">
            <BedDouble className="w-3.5 h-3.5 text-gray-400" />
            {BEDS[property.houseType] ?? "—"} Bed
          </span>
          <span className="flex items-center gap-1.5">
            <Bath className="w-3.5 h-3.5 text-gray-400" />
            {BATHS[property.houseType] ?? "—"} Bath
          </span>
          <span className="flex items-center gap-1.5">
            <Maximize2 className="w-3.5 h-3.5 text-gray-400" />
            {AREA[property.houseType] ?? "—"} m²
          </span>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-3">
          <MapPin className="w-3 h-3 flex-shrink-0 text-brand-400" />
          <span className="truncate">
            {property.estate?.name && `${property.estate.name}, `}
            {property.town.name}, {property.county.name}
          </span>
        </div>

        {/* Agent row */}
        <div className="flex items-center gap-2 pt-3 border-t border-gray-50">
          <div className="w-7 h-7 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 text-xs font-bold flex-shrink-0">
            {property.agent.name.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1">
              <span className="text-xs font-medium text-gray-700 truncate">{property.agent.name}</span>
              {property.agent.verified && <BadgeCheck className="w-3 h-3 text-blue-500 flex-shrink-0" />}
            </div>
            {property.agent.agencyName && (
              <p className="text-[10px] text-gray-400 truncate">{property.agent.agencyName}</p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
