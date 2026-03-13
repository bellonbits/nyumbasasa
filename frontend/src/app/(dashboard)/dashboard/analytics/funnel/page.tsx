"use client";

import { ArrowDown, TrendingUp, Clock } from "lucide-react";

const FUNNEL_STAGES = [
  { stage: "Property Views",    count: 23160, pct: 100, color: "bg-purple-500", light: "bg-purple-50 text-purple-700" },
  { stage: "Inquiries",         count: 3474,  pct: 15,  color: "bg-blue-500",   light: "bg-blue-50 text-blue-700"   },
  { stage: "Viewings Booked",   count: 694,   pct: 3,   color: "bg-brand-500",  light: "bg-brand-50 text-brand-700" },
  { stage: "Offers Made",       count: 208,   pct: 0.9, color: "bg-amber-500",  light: "bg-amber-50 text-amber-700" },
  { stage: "Deals Closed",      count: 65,    pct: 0.28,color: "bg-green-500",  light: "bg-green-50 text-green-700" },
];

const CONVERSION_RATES = [
  { from: "Views → Inquiries",      rate: "15.0%", good: true  },
  { from: "Inquiries → Viewings",   rate: "20.0%", good: true  },
  { from: "Viewings → Offers",      rate: "30.0%", good: true  },
  { from: "Offers → Closed",        rate: "31.3%", good: true  },
];

const AVG_TIME = [
  { stage: "First contact to viewing", time: "3 days"  },
  { stage: "Viewing to offer",         time: "7 days"  },
  { stage: "Offer to close",           time: "14 days" },
  { stage: "Total cycle time",         time: "24 days" },
];

export default function FunnelPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Conversion Funnel</h1>
        <p className="text-sm text-gray-400 mt-0.5">Lead to deal pipeline · Last 12 months</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Funnel visualization */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-6">Pipeline Funnel</h2>
          <div className="space-y-1">
            {FUNNEL_STAGES.map((s, i) => (
              <div key={s.stage}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium text-gray-700">{s.stage}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-gray-900">{s.count.toLocaleString()}</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${s.light}`}>
                      {s.pct}%
                    </span>
                  </div>
                </div>
                <div
                  className="h-10 rounded-xl flex items-center px-4 transition-all"
                  style={{ width: `${Math.max(s.pct * 1.5 + 25, 30)}%`, background: "" }}
                >
                  <div className={`h-10 rounded-xl w-full ${s.color} opacity-80`} />
                </div>
                {i < FUNNEL_STAGES.length - 1 && (
                  <div className="flex justify-center my-1">
                    <ArrowDown className="w-4 h-4 text-gray-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          {/* Conversion rates */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-brand-500" />
              <h2 className="font-semibold text-gray-900">Conversion Rates</h2>
            </div>
            <div className="space-y-4">
              {CONVERSION_RATES.map(({ from, rate, good }) => (
                <div key={from} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{from}</span>
                  <span className={`text-sm font-bold px-3 py-1 rounded-full ${
                    good ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"
                  }`}>
                    {rate}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Average time */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-4 h-4 text-brand-500" />
              <h2 className="font-semibold text-gray-900">Average Time per Stage</h2>
            </div>
            <div className="space-y-3">
              {AVG_TIME.map(({ stage, time }) => (
                <div key={stage} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{stage}</span>
                  <span className="text-sm font-semibold text-gray-900 bg-gray-50 px-3 py-1 rounded-lg">
                    {time}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Win rate card */}
          <div className="bg-gradient-to-r from-brand-500 to-brand-600 rounded-2xl p-6 text-white">
            <p className="text-sm text-brand-100 mb-1">Overall Win Rate</p>
            <p className="text-4xl font-bold mb-1">12.4%</p>
            <p className="text-xs text-brand-200">↑ 2.1% vs last quarter</p>
          </div>
        </div>
      </div>
    </div>
  );
}
