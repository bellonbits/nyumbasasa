"use client";

import { Star, TrendingUp, Eye, Building2, BadgeCheck } from "lucide-react";
import { formatKES } from "@/lib/utils";

const AGENTS = [
  { name: "Grace Wanjiku",  agency: "Wanjiku Real Estate",    listings: 24, views: 8420, deals: 18, revenue: 2100000, rating: 4.9, verified: true,  avatar: "GW" },
  { name: "David Mwangi",   agency: "Nairobi Homes Ltd",      listings: 19, views: 6200, deals: 14, revenue: 1650000, rating: 4.8, verified: true,  avatar: "DM" },
  { name: "Peter Ochieng",  agency: "Rift Valley Homes",      listings: 16, views: 5100, deals: 11, revenue: 980000,  rating: 4.7, verified: true,  avatar: "PO" },
  { name: "Akinyi Otieno",  agency: "Lakeside Properties",    listings: 14, views: 4400, deals: 9,  revenue: 720000,  rating: 4.6, verified: true,  avatar: "AO" },
  { name: "Fatuma Hassan",  agency: "Coast Properties Agency",listings: 12, views: 3800, deals: 7,  revenue: 540000,  rating: 4.5, verified: false, avatar: "FH" },
  { name: "James Kamau",    agency: "Kamau Properties",       listings: 10, views: 3100, deals: 6,  revenue: 420000,  rating: 4.4, verified: false, avatar: "JK" },
];

export default function AgentsPage() {
  const maxRevenue = Math.max(...AGENTS.map((a) => a.revenue));

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Agent Performance</h1>
        <p className="text-sm text-gray-400 mt-0.5">{AGENTS.length} agents · Last 12 months</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Agents",   value: AGENTS.length.toString(),                    icon: Building2,  color: "bg-blue-50 text-blue-600"   },
          { label: "Total Listings", value: AGENTS.reduce((s,a) => s+a.listings, 0).toString(), icon: Building2, color: "bg-brand-50 text-brand-600" },
          { label: "Total Views",    value: AGENTS.reduce((s,a) => s+a.views, 0).toLocaleString(), icon: Eye, color: "bg-purple-50 text-purple-600" },
          { label: "Total Deals",    value: AGENTS.reduce((s,a) => s+a.deals, 0).toString(), icon: TrendingUp, color: "bg-green-50 text-green-600" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-3`}>
              <Icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-sm text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Agent table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Leaderboard</h2>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-50 bg-gray-50/50">
              {["#", "Agent", "Listings", "Total Views", "Deals", "Revenue", "Rating", ""].map((h) => (
                <th key={h} className="text-left text-xs font-semibold text-gray-400 uppercase px-5 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {AGENTS.map((agent, i) => (
              <tr key={agent.name} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-5 py-4 text-sm font-bold text-gray-400">#{i + 1}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center text-xs font-bold text-brand-700 flex-shrink-0">
                      {agent.avatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="text-sm font-semibold text-gray-900">{agent.name}</p>
                        {agent.verified && <BadgeCheck className="w-3.5 h-3.5 text-blue-500" />}
                      </div>
                      <p className="text-xs text-gray-400">{agent.agency}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-sm text-gray-700 font-medium">{agent.listings}</td>
                <td className="px-5 py-4 text-sm text-gray-700">{agent.views.toLocaleString()}</td>
                <td className="px-5 py-4 text-sm text-gray-700 font-medium">{agent.deals}</td>
                <td className="px-5 py-4">
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-gray-900">{formatKES(agent.revenue)}</p>
                    <div className="h-1.5 bg-gray-100 rounded-full w-24">
                      <div
                        className="h-full bg-brand-400 rounded-full"
                        style={{ width: `${(agent.revenue / maxRevenue) * 100}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-semibold text-gray-900">{agent.rating}</span>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <button className="text-xs font-semibold text-brand-500 hover:text-brand-600 transition-colors">
                    View Profile
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
