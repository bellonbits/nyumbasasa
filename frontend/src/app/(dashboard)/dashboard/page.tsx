"use client";

import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useQuery } from "@tanstack/react-query";
import {
  Building2, Eye, TrendingUp, AlertCircle, PlusCircle,
  ArrowRight, Loader2, MapPin, Star, Clock,
} from "lucide-react";
import { dashboardApi } from "@/lib/api";
import { useMyListings } from "@/hooks/useProperties";
import PropertyCard from "@/components/listings/PropertyCard";

const DashboardMap = dynamic(() => import("@/components/dashboard/DashboardMap"), { ssr: false });

// ── Stat card — black circle icon + giant number ──────────────────────────────
function StatCard({
  label, value, icon: Icon, sub,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  sub?: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-6 relative overflow-hidden shadow-card">
      {/* Black circle icon — top right */}
      <div className="absolute top-5 right-5 w-10 h-10 bg-[#191919] rounded-full flex items-center justify-center">
        <Icon className="w-5 h-5 text-white" />
      </div>

      {/* Label */}
      <p className="text-xs text-ink-faint font-medium mb-3 pr-14">{label}</p>

      {/* Big number */}
      <p className="text-4xl font-extrabold text-ink tracking-tight leading-none">
        {typeof value === "number" ? value.toLocaleString() : value}
      </p>

      {/* Sub-label */}
      {sub && <p className="text-xs text-ink-faint mt-2">{sub}</p>}
    </div>
  );
}

// ── Community gauge (SVG arc) ─────────────────────────────────────────────────
function CommunityGauge({ value, max, label }: { value: string; max: number; label: string }) {
  const r = 52;
  const cx = 70;
  const cy = 70;
  const arcLen = Math.PI * r;           // half-circle = π × r
  const pct = 0.72;                     // 72% filled
  const dash = pct * arcLen;
  const gap  = arcLen - dash;

  return (
    <div className="flex flex-col items-center">
      <svg width="140" height="80" viewBox="0 0 140 80">
        {/* Track */}
        <path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none"
          stroke="#e8ecf2"
          strokeWidth="10"
          strokeLinecap="round"
        />
        {/* Progress — amber orange */}
        <path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none"
          stroke="#f97c00"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${gap + 1}`}
        />
      </svg>
      <p className="text-2xl font-extrabold text-ink -mt-4 tracking-tight">{value}</p>
      <p className="text-xs text-ink-faint mt-0.5">{label}</p>
    </div>
  );
}

// ── Neighborhood thumbnails ───────────────────────────────────────────────────
const NEIGHBORHOODS = [
  { name: "Westlands",  img: "https://images.unsplash.com/photo-1611348586804-61bf6c080437?w=200&q=80" },
  { name: "Kilimani",   img: "https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?w=200&q=80" },
  { name: "Lavington",  img: "https://images.unsplash.com/photo-1544568100-847a948585b9?w=200&q=80" },
];

// ── Top agents ────────────────────────────────────────────────────────────────
const TOP_AGENTS = [
  { name: "Grace W.",  props: 45, rating: 5.0, avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&q=80" },
  { name: "David M.",  props: 33, rating: 4.9, avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&q=80" },
  { name: "Akinyi O.", props: 28, rating: 4.9, avatar: "https://images.unsplash.com/photo-1589156229687-496a31ad1d1f?w=100&q=80" },
];

// ── Page ──────────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: () => dashboardApi.getStats().then((r) => r.data.data),
  });

  const { data: listingsData, isLoading: listingsLoading } = useMyListings(1);
  const listings = listingsData?.data?.slice(0, 3) ?? [];

  return (
    <div className="p-5 lg:p-6 space-y-6">

      {/* ── Welcome + quick action ────────────────────────── */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-display-sm font-extrabold text-ink leading-tight">Dashboard</h1>
          <p className="text-ink-faint text-sm mt-0.5">Here&apos;s your listing performance at a glance.</p>
        </div>
        <Link
          href="/dashboard/add-listing"
          className="btn-primary shrink-0"
        >
          <PlusCircle className="w-4 h-4" /> Add Listing
        </Link>
      </div>

      {/* ── Top row: stats + property hero ───────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">

        {/* Map card */}
        <div className="xl:col-span-2 relative rounded-2xl overflow-hidden h-64 xl:h-auto min-h-[240px] bg-surface-muted shadow-card">
          <DashboardMap listings={listingsData?.data ?? []} />

          {/* Bottom badge — sits on top of map */}
          <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-card pointer-events-none">
            <MapPin className="w-3.5 h-3.5 text-brand-500" />
            <span className="text-xs font-semibold text-ink">Active in {stats?.activeListings ?? 0} locations</span>
          </div>
        </div>

        {/* Stat cards 2×2 */}
        {statsLoading ? (
          <div className="xl:col-span-3 flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
          </div>
        ) : (
          <div className="xl:col-span-3 grid grid-cols-2 gap-4">
            <StatCard
              label="Total Listings"
              value={stats?.totalListings ?? 0}
              icon={Building2}
              sub="+2 this month"
            />
            <StatCard
              label="Total Views"
              value={stats?.totalViews ?? 0}
              icon={Eye}
              sub="+18% this week"
            />
            <StatCard
              label="Active Listings"
              value={stats?.activeListings ?? 0}
              icon={TrendingUp}
              sub="Visible to renters"
            />
            <StatCard
              label="Expiring Soon"
              value={stats?.expiringListings ?? 0}
              icon={AlertCircle}
              sub="Renew to stay active"
            />
          </div>
        )}
      </div>

      {/* ── Bottom row: explore + community + agents ──────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

        {/* Explore what's around */}
        <div className="bg-white rounded-2xl p-5 shadow-card">
          <p className="text-sm font-bold text-ink mb-1">Explore what&apos;s around</p>
          <p className="text-xs text-ink-faint mb-4">Top counties in your listings</p>
          <div className="flex items-center gap-2">
            {NEIGHBORHOODS.map((n) => (
              <div key={n.name} className="flex flex-col items-center gap-1">
                <div className="relative w-11 h-11 rounded-full overflow-hidden ring-2 ring-white shadow-card-hover">
                  <Image src={n.img} alt={n.name} fill className="object-cover" />
                </div>
                <span className="text-[10px] text-ink-faint font-medium">{n.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Community gauge */}
        <div className="bg-white rounded-2xl p-5 shadow-card flex flex-col items-start">
          <p className="text-xs text-ink-faint mb-1">Community</p>
          <div className="w-full flex justify-center mt-1">
            <CommunityGauge value="8.5k" max={10} label="members" />
          </div>
        </div>

        {/* Join community CTA */}
        <div className="bg-white rounded-2xl p-5 shadow-card flex flex-col justify-between">
          <div className="flex -space-x-2 mb-3">
            {TOP_AGENTS.map((a) => (
              <div key={a.name} className="relative w-9 h-9 rounded-full overflow-hidden ring-2 ring-white">
                <Image src={a.avatar} alt={a.name} fill className="object-cover" />
              </div>
            ))}
          </div>
          <p className="text-sm font-bold text-ink leading-snug">
            Join over 800 active agents benefiting from being part of our community.
          </p>
          <Link
            href="/dashboard/settings"
            className="mt-4 text-xs font-semibold text-brand-500 hover:text-brand-600 flex items-center gap-1 transition-colors"
          >
            Learn more <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Top agents */}
        <div className="bg-white rounded-2xl p-5 shadow-card">
          <p className="text-xs text-ink-faint mb-3">Top Agents</p>
          <div className="space-y-3">
            {TOP_AGENTS.map((a) => (
              <div key={a.name} className="flex items-center gap-3">
                <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                  <Image src={a.avatar} alt={a.name} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-ink truncate">{a.name}</p>
                  <p className="text-[10px] text-ink-faint">{a.props} properties</p>
                </div>
                <div className="flex items-center gap-0.5">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span className="text-[10px] font-semibold text-ink">{a.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Pipeline Funnel ──────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

        {/* Funnel — min-w-0 prevents bar overflow outside column */}
        <div className="bg-white rounded-2xl p-6 shadow-card min-w-0 overflow-hidden">
          <h3 className="font-bold text-ink mb-5">Pipeline Funnel</h3>
          <div className="space-y-3 w-full">
            {([
              { label: "Property Views",  value: stats?.totalViews ?? 23160, color: "bg-purple-400" },
              { label: "Inquiries",       value: 3474,  color: "bg-blue-400"  },
              { label: "Viewings Booked", value: 694,   color: "bg-blue-600"  },
              { label: "Offers Made",     value: 208,   color: "bg-amber-400" },
              { label: "Deals Closed",    value: 65,    color: "bg-green-500" },
            ] as const).map((row, i, arr) => {
              const base      = Number(arr[0].value) || 1;
              const val       = Number(row.value);
              const barWidth  = Math.max(Math.round((val / base) * 100), i === 0 ? 100 : 2);
              const pctNum    = (val / base) * 100;
              const pctLabel  = i === 0 ? "100%" : pctNum < 1 ? `${pctNum.toFixed(2)}%` : `${Math.round(pctNum)}%`;
              const pctColor  = i === 0 ? "text-brand-500" : pctNum < 1 ? "text-amber-500" : "text-brand-500";
              return (
                <div key={row.label} className="w-full">
                  {/* Label row */}
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-ink-muted">{row.label}</span>
                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      <span className="text-sm font-bold text-ink tabular-nums">{val.toLocaleString()}</span>
                      <span className={`text-xs font-semibold w-10 text-right ${pctColor}`}>{pctLabel}</span>
                    </div>
                  </div>
                  {/* Bar track — w-full ensures bar is always contained */}
                  <div className="w-full h-9 bg-surface-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full ${row.color} rounded-full`}
                      style={{ width: `${barWidth}%`, maxWidth: "100%" }}
                    />
                  </div>
                  {i < arr.length - 1 && (
                    <div className="flex justify-start pl-3 my-0.5">
                      <svg className="w-3 h-3 text-ink-faint" fill="none" viewBox="0 0 12 14">
                        <path d="M6 1v10M3 8l3 4 3-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right column: Conversion + Time + Win Rate */}
        <div className="flex flex-col gap-4 min-w-0">

          {/* Conversion Rates */}
          <div className="bg-white rounded-2xl p-6 shadow-card">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-brand-500" />
              <h3 className="font-bold text-ink text-sm">Conversion Rates</h3>
            </div>
            <div className="space-y-3">
              {[
                { stage: "Views → Inquiries",    pct: "15.0%" },
                { stage: "Inquiries → Viewings",  pct: "20.0%" },
                { stage: "Viewings → Offers",     pct: "30.0%" },
                { stage: "Offers → Closed",       pct: "31.3%" },
              ].map((r) => (
                <div key={r.stage} className="flex items-center justify-between">
                  <span className="text-sm text-ink-muted">{r.stage}</span>
                  <span className="text-sm font-bold text-green-600">{r.pct}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Average Time per Stage */}
          <div className="bg-white rounded-2xl p-6 shadow-card">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-4 h-4 text-brand-500" />
              <h3 className="font-bold text-ink text-sm">Average Time per Stage</h3>
            </div>
            <div className="space-y-3">
              {[
                { stage: "First contact to viewing", days: "3 days"  },
                { stage: "Viewing to offer",         days: "7 days"  },
                { stage: "Offer to close",           days: "14 days" },
                { stage: "Total cycle time",         days: "24 days" },
              ].map((r) => (
                <div key={r.stage} className="flex items-center justify-between">
                  <span className="text-sm text-ink-muted">{r.stage}</span>
                  <span className="text-sm font-bold text-ink">{r.days}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Overall Win Rate */}
          <div className="bg-brand-500 rounded-2xl p-6 text-white">
            <p className="text-sm text-white/70 mb-1">Overall Win Rate</p>
            <p className="text-4xl font-extrabold tracking-tight leading-none">12.4%</p>
            <p className="text-xs text-white/60 mt-2">↑ 2.1% vs last quarter</p>
          </div>
        </div>
      </div>

      {/* ── Recent Listings ───────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-ink">Recent Listings</h3>
          <Link
            href="/dashboard/listings"
            className="text-brand-500 hover:text-brand-600 text-sm font-semibold flex items-center gap-1 transition-colors"
          >
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {listingsLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
          </div>
        ) : listings.length === 0 ? (
          <div className="bg-white rounded-2xl border-2 border-dashed border-surface-border p-10 text-center shadow-card">
            <Building2 className="w-10 h-10 text-surface-border mx-auto mb-3" />
            <p className="font-semibold text-ink mb-1">No listings yet</p>
            <p className="text-ink-faint text-sm mb-4">Add your first property to start receiving inquiries.</p>
            <Link href="/dashboard/add-listing" className="btn-primary text-sm inline-flex items-center gap-2">
              <PlusCircle className="w-4 h-4" /> Add Your First Listing
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {listings.map((p) => (
              <PropertyCard key={p.id} property={p} compact />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
