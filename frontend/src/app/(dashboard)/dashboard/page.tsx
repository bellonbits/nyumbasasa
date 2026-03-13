"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  Building2, Eye, TrendingUp, AlertCircle, PlusCircle,
  ArrowRight, Loader2,
} from "lucide-react";
import { dashboardApi } from "@/lib/api";
import { useMyListings } from "@/hooks/useProperties";
import PropertyCard from "@/components/listings/PropertyCard";
import { formatKES } from "@/lib/utils";

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: () => dashboardApi.getStats().then((r) => r.data.data),
  });

  const { data: listingsData, isLoading: listingsLoading } = useMyListings(1);
  const listings = listingsData?.data?.slice(0, 3) ?? [];

  const STAT_CARDS = [
    {
      label: "Total Listings",
      value: stats?.totalListings ?? 0,
      icon: Building2,
      color: "bg-blue-50 text-blue-600",
      change: "+2 this month",
    },
    {
      label: "Active Listings",
      value: stats?.activeListings ?? 0,
      icon: TrendingUp,
      color: "bg-green-50 text-green-600",
      change: "Visible to renters",
    },
    {
      label: "Total Views",
      value: stats?.totalViews ?? 0,
      icon: Eye,
      color: "bg-brand-50 text-brand-600",
      change: "+18% this week",
    },
    {
      label: "Expiring Soon",
      value: stats?.expiringListings ?? 0,
      icon: AlertCircle,
      color: "bg-red-50 text-red-500",
      change: "Renew to keep active",
    },
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Welcome banner */}
      <div className="relative bg-gradient-to-r from-brand-500 to-brand-600 rounded-2xl p-6 text-white overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-full opacity-10 pointer-events-none">
          <svg viewBox="0 0 200 200" className="w-full h-full"><circle cx="160" cy="40" r="80" fill="white" /><circle cx="40" cy="160" r="60" fill="white" /></svg>
        </div>
        <div className="relative">
          <h2 className="font-heading text-xl font-bold mb-1">Welcome back!</h2>
          <p className="text-brand-100 text-sm mb-4">Here&apos;s your listing performance at a glance.</p>
          <Link href="/dashboard/add-listing"
            className="inline-flex items-center gap-2 bg-white text-brand-600 font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-brand-50 transition-colors">
            <PlusCircle className="w-4 h-4" /> Add New Listing
          </Link>
        </div>
      </div>

      {/* Stats grid */}
      {statsLoading ? (
        <div className="flex justify-center py-10"><Loader2 className="w-8 h-8 text-brand-500 animate-spin" /></div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STAT_CARDS.map(({ label, value, icon: Icon, color, change }) => (
            <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-3`}>
                <Icon className="w-5 h-5" />
              </div>
              <p className="font-heading text-2xl font-bold text-gray-900">{value.toLocaleString()}</p>
              <p className="text-sm font-medium text-gray-700 mt-0.5">{label}</p>
              <p className="text-xs text-gray-400 mt-1">{change}</p>
            </div>
          ))}
        </div>
      )}

      {/* Recent Listings */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-heading font-bold text-gray-900">Recent Listings</h3>
          <Link href="/dashboard/listings" className="text-brand-500 hover:text-brand-600 text-sm font-semibold flex items-center gap-1">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {listingsLoading ? (
          <div className="flex justify-center py-10"><Loader2 className="w-8 h-8 text-brand-500 animate-spin" /></div>
        ) : listings.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-10 text-center">
            <Building2 className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="font-semibold text-gray-700 mb-1">No listings yet</p>
            <p className="text-gray-400 text-sm mb-4">Add your first property to start receiving inquiries.</p>
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
