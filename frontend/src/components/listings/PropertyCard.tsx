import Image from "next/image";
import Link from "next/link";
import { MapPin, Heart, BadgeCheck } from "lucide-react";
import { formatKES, houseTypeLabel, getPrimaryImage, cn } from "@/lib/utils";
import type { Property } from "@/types";

const BEDS: Record<string, string> = {
  bedsitter: "1", studio: "1", one_bedroom: "1", two_bedroom: "2", three_bedroom: "3",
};
const BATHS: Record<string, string> = {
  bedsitter: "1", studio: "1", one_bedroom: "1", two_bedroom: "2", three_bedroom: "2",
};

interface PropertyCardProps {
  property: Property;
  className?: string;
  compact?: boolean;
}

export default function PropertyCard({ property, className, compact = false }: PropertyCardProps) {
  const image = getPrimaryImage(property.images);

  return (
    <Link href={`/property/${property.id}`}
      className={cn("group block bg-white rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300", className)}>

      {/* Image */}
      <div className={cn("relative overflow-hidden", compact ? "h-44" : "h-56")}>
        <Image
          src={image}
          alt={property.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {property.isBoosted && (
          <div className="absolute top-3 left-3 bg-brand-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
            Featured
          </div>
        )}
        <button onClick={e => e.preventDefault()}
          className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors shadow-sm">
          <Heart className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Price */}
        <p className="text-xl font-bold text-gray-900 mb-1">
          {formatKES(property.rent)}
          <span className="text-sm font-normal text-gray-400"> /mo</span>
        </p>

        {/* Specs */}
        <p className="text-sm text-gray-500 mb-2">
          <span className="font-medium text-gray-700">{BEDS[property.houseType] ?? "—"}</span> bed{" · "}
          <span className="font-medium text-gray-700">{BATHS[property.houseType] ?? "—"}</span> bath{" · "}
          <span className="font-medium text-gray-700">{houseTypeLabel(property.houseType)}</span>
        </p>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-3">
          <MapPin className="w-3 h-3 flex-shrink-0" />
          <span className="truncate">
            {property.estate?.name && `${property.estate.name}, `}
            {property.town.name}, {property.county.name}
          </span>
        </div>

        {/* Agent */}
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
