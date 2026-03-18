"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin, Bed, BadgeCheck, MessageCircle, Flag, Share2,
  Heart, ChevronLeft, ChevronRight, Eye, Calendar, Loader2,
} from "lucide-react";
import { useProperty } from "@/hooks/useProperties";
import { propertiesApi } from "@/lib/api";
import { formatKES, houseTypeLabel, buildWhatsAppLink, timeAgo, getPrimaryImage } from "@/lib/utils";
import type { Property } from "@/types";

const AMENITY_ICONS: Record<string, string> = {
  wifi: "📶", water: "💧", security: "🔒", parking: "🚗",
  generator: "⚡", balcony: "🏠", gym: "💪", swimming_pool: "🏊",
};

// ── Image gallery ─────────────────────────────────────────────────────────────
function ImageGallery({ images }: { images: Property["images"] }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const active = images[activeIdx] ?? images[0];

  return (
    <div className="space-y-3">
      <div className="relative w-full h-80 sm:h-[440px] rounded-2xl overflow-hidden bg-surface-muted">
        {active && (
          <Image src={active.url} alt="Property" fill className="object-cover" priority />
        )}
        {images.length > 1 && (
          <>
            <button
              onClick={() => setActiveIdx((i) => (i - 1 + images.length) % images.length)}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/85 backdrop-blur-sm flex items-center justify-center shadow-card hover:bg-white transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-ink" />
            </button>
            <button
              onClick={() => setActiveIdx((i) => (i + 1) % images.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/85 backdrop-blur-sm flex items-center justify-center shadow-card hover:bg-white transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-ink" />
            </button>
          </>
        )}
        <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full">
          {activeIdx + 1} / {images.length}
        </div>
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setActiveIdx(i)}
              className={`relative flex-shrink-0 w-20 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                i === activeIdx ? "border-brand-500" : "border-transparent hover:border-surface-border"
              }`}
            >
              <Image src={img.url} alt="" fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Report modal ──────────────────────────────────────────────────────────────
function ReportModal({ propertyId, onClose }: { propertyId: string; onClose: () => void }) {
  const [reason, setReason] = useState("");
  const [sent, setSent]     = useState(false);

  const submit = async () => {
    if (!reason) return;
    await propertiesApi.report(propertyId, reason);
    setSent(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-card-hover border border-surface-border">
        <h3 className="font-bold text-ink mb-4">Report Listing</h3>
        {sent ? (
          <div className="text-center py-6">
            <p className="text-emerald-600 font-semibold">Thank you! Report submitted.</p>
            <button onClick={onClose} className="mt-4 btn-primary text-sm">Close</button>
          </div>
        ) : (
          <>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="input-base mb-4"
            >
              <option value="">Select a reason...</option>
              <option value="fraud">Suspected fraud / scam</option>
              <option value="wrong_info">Wrong information</option>
              <option value="already_rented">Property already rented</option>
              <option value="offensive">Offensive content</option>
              <option value="duplicate">Duplicate listing</option>
            </select>
            <div className="flex gap-3">
              <button onClick={onClose} className="flex-1 btn-outline text-sm">Cancel</button>
              <button onClick={submit} className="flex-1 btn-primary text-sm">Submit Report</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function PropertyDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const { data: property, isLoading } = useProperty(id);
  const [reportOpen, setReportOpen] = useState(false);
  const [saved, setSaved]           = useState(false);

  useEffect(() => {
    if (id) propertiesApi.incrementView(id).catch(() => {});
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 text-brand-500 animate-spin" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <h2 className="font-bold text-xl text-ink">Property not found</h2>
        <Link href="/search" className="btn-primary text-sm">Browse Listings</Link>
      </div>
    );
  }

  const whatsappUrl = buildWhatsAppLink(
    property.agent.whatsapp ?? property.agent.phone,
    property.title
  );

  return (
    <>
      {reportOpen && <ReportModal propertyId={property.id} onClose={() => setReportOpen(false)} />}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-28 lg:pb-8">

        {/* Breadcrumb */}
        <nav className="text-sm text-ink-faint mb-6 flex items-center gap-1.5 overflow-x-auto whitespace-nowrap scrollbar-hide">
          <Link href="/" className="hover:text-brand-500 flex-shrink-0 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/search" className="hover:text-brand-500 flex-shrink-0 transition-colors">Properties</Link>
          <span>/</span>
          <Link href={`/search?county=${property.county.name}`} className="hover:text-brand-500 flex-shrink-0 transition-colors">
            {property.county.name}
          </Link>
          <span>/</span>
          <span className="text-ink-muted truncate">{property.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

          {/* ── Left — Images + Details ────────────────────── */}
          <div className="lg:col-span-2 space-y-6 lg:space-y-8">
            <ImageGallery images={property.images} />

            {/* Title bar */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="badge-blue">
                    {houseTypeLabel(property.houseType)}
                  </span>
                  {property.isVerified && (
                    <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                      <BadgeCheck className="w-3.5 h-3.5" /> Verified
                    </span>
                  )}
                </div>
                <h1 className="text-display-sm font-extrabold text-ink">{property.title}</h1>
                <div className="flex items-center gap-1.5 mt-2 text-ink-muted text-sm">
                  <MapPin className="w-4 h-4 text-brand-400" />
                  {property.estate?.name && <span>{property.estate.name},</span>}
                  <span>{property.town.name},</span>
                  <span>{property.county.name}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => setSaved(!saved)}
                  className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all ${
                    saved ? "bg-red-50 border-red-200 text-red-500" : "border-surface-border text-ink-faint hover:text-red-500 hover:border-red-200"
                  }`}
                >
                  <Heart className={`w-5 h-5 ${saved ? "fill-current" : ""}`} />
                </button>
                <button className="w-10 h-10 rounded-xl border border-surface-border flex items-center justify-center text-ink-faint hover:text-brand-500 hover:border-brand-300 transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Mobile price summary */}
            <div className="lg:hidden bg-white rounded-2xl border border-surface-border shadow-card p-4">
              <div className="flex items-end justify-between mb-3">
                <div>
                  <p className="text-xs text-ink-faint mb-0.5">Monthly Rent</p>
                  <p className="font-extrabold text-2xl text-brand-600 tracking-tight">
                    {formatKES(property.rent)}<span className="text-ink-faint text-sm font-normal">/mo</span>
                  </p>
                </div>
                <p className="text-sm text-ink-muted">
                  Deposit: <span className="font-semibold text-ink">{formatKES(property.deposit)}</span>
                </p>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm bg-surface rounded-xl p-3 border border-surface-border">
                {[
                  { label: "County", value: property.county.name },
                  { label: "Town",   value: property.town.name   },
                  { label: "Type",   value: houseTypeLabel(property.houseType) },
                  { label: "Estate", value: property.estate?.name ?? "N/A" },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <span className="text-ink-faint text-xs">{label}</span>
                    <p className="font-semibold text-ink text-xs">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="font-bold text-ink text-lg mb-3">About This Property</h2>
              <p className="text-ink-muted leading-relaxed">{property.description}</p>
            </div>

            {/* Amenities */}
            {property.amenities.length > 0 && (
              <div>
                <h2 className="font-bold text-ink text-lg mb-4">Amenities</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {property.amenities.map((a) => (
                    <div key={a.id} className="flex items-center gap-2 bg-surface rounded-xl border border-surface-border px-4 py-3">
                      <span>{AMENITY_ICONS[a.id] ?? "✓"}</span>
                      <span className="text-sm text-ink-muted">{a.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-ink-faint py-4 border-t border-surface-border">
              <div className="flex items-center gap-1.5">
                <Eye className="w-4 h-4" /> {property.viewCount} views
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" /> Listed {timeAgo(property.createdAt)}
              </div>
              <button
                onClick={() => setReportOpen(true)}
                className="flex items-center gap-1.5 text-red-400 hover:text-red-500 ml-auto transition-colors"
              >
                <Flag className="w-4 h-4" /> Report Listing
              </button>
            </div>
          </div>

          {/* ── Right — Price + Contact (desktop only) ─────── */}
          <div className="space-y-5 hidden lg:block">

            {/* Price card */}
            <div className="bg-white rounded-2xl border border-surface-border shadow-card p-6">
              <div className="mb-5">
                <p className="text-ink-faint text-xs mb-1">Monthly Rent</p>
                <p className="text-display-md font-extrabold text-brand-600 tracking-tight leading-none">
                  {formatKES(property.rent)}
                  <span className="text-ink-faint text-base font-normal">/mo</span>
                </p>
                <p className="text-ink-muted text-sm mt-1.5">
                  Deposit: <span className="font-semibold text-ink">{formatKES(property.deposit)}</span>
                </p>
              </div>

              {/* Location summary */}
              <div className="bg-surface rounded-xl border border-surface-border p-4 mb-5 space-y-2.5">
                {[
                  { label: "County",  value: property.county.name  },
                  { label: "Town",    value: property.town.name    },
                  { label: "Estate",  value: property.estate?.name ?? "N/A" },
                  { label: "Type",    value: houseTypeLabel(property.houseType) },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between text-sm">
                    <span className="text-ink-faint">{label}</span>
                    <span className="font-semibold text-ink">{value}</span>
                  </div>
                ))}
              </div>

              {/* WhatsApp CTA */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-3 bg-[#25d366] hover:bg-[#1ebe57]
                           text-white font-bold py-4 rounded-xl transition-all shadow-lg
                           hover:shadow-[0_8px_24px_rgba(37,211,102,0.35)] mb-3"
              >
                <MessageCircle className="w-5 h-5" />
                Chat on WhatsApp
              </a>
              <a
                href={`tel:${property.agent.phone}`}
                className="w-full btn-outline text-sm justify-center"
              >
                Call Agent
              </a>
            </div>

            {/* Agent card */}
            <div className="bg-white rounded-2xl border border-surface-border shadow-card p-5">
              <h3 className="font-semibold text-ink text-sm mb-4">Listed by</h3>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-brand-50 flex items-center justify-center font-bold text-brand-600 text-lg shrink-0">
                  {property.agent.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-ink text-sm">{property.agent.name}</p>
                  {property.agent.agencyName && (
                    <p className="text-ink-faint text-xs">{property.agent.agencyName}</p>
                  )}
                  {property.agent.verified && (
                    <div className="flex items-center gap-1 text-emerald-600 text-xs mt-0.5">
                      <BadgeCheck className="w-3 h-3" /> Verified Agent
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile sticky bottom bar ───────────────────────────── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-surface-border shadow-[0_-4px_20px_rgba(0,0,0,0.07)] px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-ink-faint leading-none mb-0.5">Monthly Rent</p>
            <p className="font-extrabold text-brand-600 text-lg leading-none tracking-tight">
              {formatKES(property.rent)}<span className="text-ink-faint text-xs font-normal">/mo</span>
            </p>
          </div>
          <a
            href={`tel:${property.agent.phone}`}
            className="flex items-center justify-center border border-brand-500 text-brand-500 hover:bg-brand-50 font-semibold text-sm px-4 py-2.5 rounded-xl transition-colors"
          >
            Call
          </a>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-[#25d366] hover:bg-[#1ebe57] text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-colors shadow-md"
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp
          </a>
        </div>
      </div>
    </>
  );
}
