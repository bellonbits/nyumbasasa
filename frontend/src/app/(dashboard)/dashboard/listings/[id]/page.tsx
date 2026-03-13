"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft, Edit2, Trash2, Eye, MapPin, Calendar, Clock,
  CheckCircle2, XCircle, AlertCircle, Zap, Building2, Loader2,
} from "lucide-react";
import { useProperty, useDeleteProperty } from "@/hooks/useProperties";
import { formatKES, houseTypeLabel, timeAgo, getPrimaryImage } from "@/lib/utils";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { ListingStatus } from "@/types";

const STATUS_CONFIG: Record<ListingStatus, { label: string; icon: typeof CheckCircle2; className: string }> = {
  active:   { label: "Active",   icon: CheckCircle2, className: "bg-green-50 text-green-700 border-green-200"  },
  pending:  { label: "Pending",  icon: Clock,        className: "bg-amber-50 text-amber-700 border-amber-200"  },
  rejected: { label: "Rejected", icon: XCircle,      className: "bg-red-50   text-red-600   border-red-200"    },
  archived: { label: "Archived", icon: AlertCircle,  className: "bg-gray-100 text-gray-600  border-gray-200"   },
};

export default function ListingDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const { data: property, isLoading } = useProperty(id);
  const deleteProperty = useDeleteProperty();

  const handleDelete = async () => {
    if (!property) return;
    if (!confirm(`Delete "${property.title}"? This cannot be undone.`)) return;
    try {
      await deleteProperty.mutateAsync(id);
      toast.success("Listing deleted");
      router.push("/dashboard/listings");
    } catch {
      toast.error("Failed to delete listing");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="p-6 text-center">
        <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500 font-medium">Listing not found</p>
        <Link href="/dashboard/listings" className="text-brand-500 text-sm mt-2 inline-block hover:underline">
          Back to listings
        </Link>
      </div>
    );
  }

  const status = STATUS_CONFIG[property.status] ?? STATUS_CONFIG.pending;
  const StatusIcon = status.icon;
  const daysUntilExpiry = Math.ceil(
    (new Date(property.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="p-4 sm:p-6 max-w-4xl space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/listings"
            className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-gray-900 line-clamp-1">{property.title}</h1>
            <p className="text-sm text-gray-400">{property.town.name}, {property.county.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Link
            href={`/property/${id}`}
            target="_blank"
            className="flex items-center gap-1.5 text-sm text-gray-600 border border-gray-200 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <Eye className="w-4 h-4" /> Public View
          </Link>
          <Link
            href={`/dashboard/listings/${id}/edit`}
            className="flex items-center gap-1.5 text-sm text-white bg-brand-500 hover:bg-brand-600 px-3 py-2 rounded-xl transition-colors font-semibold"
          >
            <Edit2 className="w-4 h-4" /> Edit Listing
          </Link>
          <button
            onClick={handleDelete}
            disabled={deleteProperty.isPending}
            className="flex items-center gap-1.5 text-sm text-red-500 border border-red-200 hover:bg-red-50 px-3 py-2 rounded-xl transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left column: images + description */}
        <div className="lg:col-span-2 space-y-5">
          {/* Images */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="relative h-52 sm:h-72 bg-gray-100">
              <Image
                src={getPrimaryImage(property.images)}
                alt={property.title}
                fill
                className="object-cover"
              />
              {property.isBoosted && (
                <div className="absolute top-3 left-3 flex items-center gap-1 bg-amber-400 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                  <Zap className="w-3 h-3" /> Boosted
                </div>
              )}
              {property.isVerified && (
                <div className="absolute top-3 right-3 flex items-center gap-1 bg-brand-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                  <CheckCircle2 className="w-3 h-3" /> Verified
                </div>
              )}
            </div>
            {property.images.length > 1 && (
              <div className="flex gap-2 p-3 overflow-x-auto">
                {property.images.map((img) => (
                  <div key={img.id} className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                    <Image src={img.url} alt="" fill className="object-cover" />
                    {img.isPrimary && (
                      <div className="absolute inset-0 ring-2 ring-brand-500 rounded-lg" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Description */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h2 className="font-semibold text-gray-900 mb-3">Description</h2>
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{property.description}</p>
          </div>

          {/* Amenities */}
          {property.amenities.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <h2 className="font-semibold text-gray-900 mb-3">Amenities</h2>
              <div className="flex flex-wrap gap-2">
                {property.amenities.map((a) => (
                  <span key={a.id} className="flex items-center gap-1.5 text-sm text-gray-600 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-lg">
                    <span>{a.icon}</span> {a.label}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right column: stats + details */}
        <div className="space-y-4">
          {/* Status */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900 text-sm">Listing Status</h2>
              <span className={cn("flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border", status.className)}>
                <StatusIcon className="w-3 h-3" />
                {status.label}
              </span>
            </div>
            {property.status === "pending" && (
              <p className="text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2">
                Your listing is awaiting admin review. It will be visible once approved.
              </p>
            )}
            {property.status === "rejected" && (
              <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">
                This listing was rejected. Edit and resubmit, or contact support.
              </p>
            )}
          </div>

          {/* Key stats */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
            <h2 className="font-semibold text-gray-900 text-sm">Performance</h2>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Eye className="w-4 h-4 text-gray-400" /> Total Views
              </div>
              <span className="font-bold text-gray-900">{property.viewCount.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="w-4 h-4 text-gray-400" /> Listed
              </div>
              <span className="text-sm text-gray-700">{timeAgo(property.createdAt)}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock className="w-4 h-4 text-gray-400" /> Expires
              </div>
              <span className={cn("text-sm font-medium", daysUntilExpiry <= 5 ? "text-red-500" : daysUntilExpiry <= 10 ? "text-amber-500" : "text-gray-700")}>
                {daysUntilExpiry > 0 ? `${daysUntilExpiry}d left` : "Expired"}
              </span>
            </div>
          </div>

          {/* Property details */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
            <h2 className="font-semibold text-gray-900 text-sm">Details</h2>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Type</span>
                <span className="font-medium text-gray-900">{houseTypeLabel(property.houseType)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Rent</span>
                <span className="font-bold text-gray-900">{formatKES(property.rent)}<span className="text-xs font-normal text-gray-400">/mo</span></span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Deposit</span>
                <span className="font-medium text-gray-900">{formatKES(property.deposit)}</span>
              </div>
              {property.address && (
                <div className="flex justify-between gap-2">
                  <span className="text-gray-500 flex-shrink-0">Address</span>
                  <span className="text-gray-700 text-right">{property.address}</span>
                </div>
              )}
              <div className="flex justify-between gap-2">
                <span className="text-gray-500 flex items-center gap-1 flex-shrink-0">
                  <MapPin className="w-3.5 h-3.5" /> Location
                </span>
                <span className="text-gray-700 text-right">
                  {[property.estate?.name, property.town.name, property.county.name].filter(Boolean).join(", ")}
                </span>
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-2">
            <h2 className="font-semibold text-gray-900 text-sm mb-3">Quick Actions</h2>
            <Link
              href={`/dashboard/listings/${id}/edit`}
              className="flex items-center gap-2 w-full text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 px-3 py-2.5 rounded-xl transition-colors"
            >
              <Edit2 className="w-4 h-4 text-gray-400" /> Edit this listing
            </Link>
            <Link
              href={`/property/${id}`}
              target="_blank"
              className="flex items-center gap-2 w-full text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 px-3 py-2.5 rounded-xl transition-colors"
            >
              <Eye className="w-4 h-4 text-gray-400" /> View public page
            </Link>
            <button
              onClick={handleDelete}
              disabled={deleteProperty.isPending}
              className="flex items-center gap-2 w-full text-sm text-red-500 hover:text-red-600 hover:bg-red-50 px-3 py-2.5 rounded-xl transition-colors"
            >
              <Trash2 className="w-4 h-4" /> Delete listing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
