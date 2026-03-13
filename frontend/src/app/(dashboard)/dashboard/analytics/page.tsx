"use client";

import { TrendingUp, Eye, Building2, DollarSign, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { formatKES } from "@/lib/utils";

const MONTHLY = [
  { month: "Apr", revenue: 420000, views: 1200 },
  { month: "May", revenue: 510000, views: 1450 },
  { month: "Jun", revenue: 480000, views: 1380 },
  { month: "Jul", revenue: 600000, views: 1700 },
  { month: "Aug", revenue: 575000, views: 1620 },
  { month: "Sep", revenue: 680000, views: 1900 },
  { month: "Oct", revenue: 720000, views: 2100 },
  { month: "Nov", revenue: 695000, views: 1980 },
  { month: "Dec", revenue: 810000, views: 2300 },
  { month: "Jan", revenue: 760000, views: 2150 },
  { month: "Feb", revenue: 890000, views: 2500 },
  { month: "Mar", revenue: 950000, views: 2780 },
];

const TOP_LISTINGS = [
  { title: "3-Bed Apartment, Westlands",    type: "3 Bedroom",  rent: 85000, views: 420, status: "active"  },
  { title: "Studio, Kilimani",              type: "Studio",     rent: 22000, views: 380, status: "active"  },
  { title: "Bedsitter, Kasarani",           type: "Bedsitter",  rent: 8500,  views: 340, status: "active"  },
  { title: "2-Bed Apartment, Lavington",   type: "2 Bedroom",  rent: 55000, views: 290, status: "active"  },
  { title: "1-Bed, Kileleshwa",            type: "1 Bedroom",  rent: 35000, views: 240, status: "pending" },
];

const TYPE_BREAKDOWN = [
  { type: "Bedsitter",   pct: 38, color: "bg-purple-400" },
  { type: "Studio",      pct: 24, color: "bg-blue-400"   },
  { type: "1 Bedroom",  pct: 20, color: "bg-brand-400"  },
  { type: "2 Bedrooms", pct: 12, color: "bg-amber-400"  },
  { type: "3 Bedrooms", pct: 6,  color: "bg-red-400"    },
];

const maxRevenue = Math.max(...MONTHLY.map((m) => m.revenue));

export default function AnalyticsPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">Sales Analytics</h1>
        <p className="text-sm text-gray-400 mt-0.5">Performance overview · Last 12 months</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Revenue",    value: "KES 7.6M", change: "+14%", up: true,  icon: DollarSign, color: "bg-brand-50 text-brand-600" },
          { label: "Active Listings",  value: "24",       change: "+3",   up: true,  icon: Building2,  color: "bg-blue-50 text-blue-600"   },
          { label: "Total Views",      value: "23,160",   change: "+22%", up: true,  icon: Eye,        color: "bg-purple-50 text-purple-600"},
          { label: "Avg. Rent",        value: formatKES(38500), change: "-2%", up: false, icon: TrendingUp, color: "bg-amber-50 text-amber-600" },
        ].map(({ label, value, change, up, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-3`}>
              <Icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-sm text-gray-600 mt-0.5">{label}</p>
            <div className={`flex items-center gap-1 mt-2 text-xs font-semibold ${up ? "text-green-600" : "text-red-500"}`}>
              {up ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
              {change} vs last year
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold text-gray-900">Monthly Revenue</h2>
            <span className="text-xs text-gray-400 border border-gray-200 px-3 py-1 rounded-full">Apr 2025 – Mar 2026</span>
          </div>
          <div className="flex items-end gap-2 h-48">
            {MONTHLY.map((m) => (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full bg-brand-500 hover:bg-brand-400 rounded-t-lg transition-all cursor-pointer relative group"
                  style={{ height: `${(m.revenue / maxRevenue) * 100}%` }}
                >
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-gray-900 text-white text-[10px] px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    {formatKES(m.revenue)}
                  </div>
                </div>
                <span className="text-[10px] text-gray-400">{m.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Type Breakdown */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-6">By Property Type</h2>
          <div className="space-y-4">
            {TYPE_BREAKDOWN.map(({ type, pct, color }) => (
              <div key={type}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm text-gray-700">{type}</span>
                  <span className="text-sm font-semibold text-gray-900">{pct}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Listings */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Top Performing Listings</h2>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-50">
              {["Property", "Type", "Rent", "Views", "Status"].map((h) => (
                <th key={h} className="text-left text-xs font-semibold text-gray-400 uppercase px-6 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {TOP_LISTINGS.map((l, i) => (
              <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{l.title}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{l.type}</td>
                <td className="px-6 py-4 text-sm font-semibold text-gray-900">{formatKES(l.rent)}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 text-sm text-gray-600">
                    <Eye className="w-3.5 h-3.5 text-gray-400" /> {l.views.toLocaleString()}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize
                    ${l.status === "active" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                    {l.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
