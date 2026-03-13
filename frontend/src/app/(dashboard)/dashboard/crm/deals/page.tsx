"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Plus, MoreHorizontal, MessageSquare, Paperclip, SlidersHorizontal,
  ArrowUpDown, Info, X, ChevronDown,
} from "lucide-react";
import { formatKES } from "@/lib/utils";
import { cn } from "@/lib/utils";

type Priority = "Low" | "Medium" | "High";
type Stage = "New" | "Viewing Scheduled" | "Negotiation" | "Legal & Documentation";

interface Deal {
  id: string; ref: string; title: string; price: number; area: string;
  priority: Priority; client: string; clientAvatar: string; date: string;
  source: string; comments: number; files: number; assignees: string[];
  image: string; status: string; stage: Stage;
}

const STAGE_COLORS: Record<Stage, string> = {
  "New":                   "bg-purple-500",
  "Viewing Scheduled":     "bg-amber-500",
  "Negotiation":           "bg-blue-500",
  "Legal & Documentation": "bg-red-500",
};

const PRIORITY_BADGE: Record<Priority, string> = {
  Low:    "bg-blue-50  text-blue-600",
  Medium: "bg-amber-50 text-amber-600",
  High:   "bg-red-50   text-red-500",
};

const INITIAL_DEALS: Deal[] = [
  { id:"d1", ref:"#HK-04219", title:"3-Bed in Nairobi — Terrace & Garden",          price:85000,  area:"Apartment, 195 m²", priority:"Low",    client:"James Kamau",    clientAvatar:"JK", date:"25 Nov 2025", source:"homifykenya.co.ke",  comments:3,  files:1,  assignees:["JK"],          image:"https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=400&q=80", status:"Reservation", stage:"New" },
  { id:"d2", ref:"#HK-04220", title:"2-Bed Studio in Mombasa — Sea View",           price:42000,  area:"Studio, 90 m²",     priority:"Low",    client:"Fatuma Hassan",  clientAvatar:"FH", date:"30 Nov 2025", source:"homifykenya.co.ke",  comments:34, files:12, assignees:["FH","JK"],     image:"https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&q=80", status:"Pending",     stage:"New" },
  { id:"d3", ref:"#HK-04217", title:"1-Bed in Westlands — Exclusive Suite",         price:65000,  area:"Apartment, 85 m²",  priority:"Medium", client:"Amira Al-Fayed", clientAvatar:"AA", date:"21 Nov 2025", source:"vacationhomes.ca",   comments:12, files:6,  assignees:["AA","JK"],     image:"https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&q=80", status:"Pending",     stage:"Viewing Scheduled" },
  { id:"d4", ref:"#HK-04208", title:"3-Bed in Karen — Terrace & Sea View",          price:120000, area:"Apartment, 120 m²", priority:"Low",    client:"Wei Chen",       clientAvatar:"WC", date:"22 Nov 2025", source:"bronex.com",         comments:23, files:10, assignees:["WC"],          image:"https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=400&q=80", status:"Reservation", stage:"Negotiation" },
  { id:"d5", ref:"#HK-42009", title:"Bedsitter in Kisumu — City Center",            price:16000,  area:"Bedsitter, 30 m²",  priority:"Low",    client:"Akinyi Otieno",  clientAvatar:"AO", date:"25 Nov 2025", source:"bronex.com",         comments:5,  files:3,  assignees:["AO","WC"],     image:"https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&q=80", status:"Pending",     stage:"Negotiation" },
  { id:"d6", ref:"#HK-04207", title:"2-Bed in Lavington — High Floor & Serviced",   price:95000,  area:"Apartment, 90 m²",  priority:"High",   client:"Vikram Malhotra",clientAvatar:"VM", date:"30 Nov 2025", source:"bronex.com",         comments:34, files:12, assignees:["VM","WC","AO"],image:"https://images.unsplash.com/photo-1576941089067-2de3c901e126?w=400&q=80", status:"Reservation", stage:"Legal & Documentation" },
];

const PIPELINE_STATS = [
  { section: "Pipeline Value",     stats: [{ label: "Total Asset Volume", value: "KES 423M", badge: "↑14% vs last month" }, { label: "Commission", value: "KES 12M", badge: "↑5% vs last month" }] },
  { section: "Deal Activity",      stats: [{ label: "Viewings Booked", value: "20",  badge: "↑12% vs last month" }, { label: "Offers Sent", value: "5",   badge: "↓20% vs last month" }] },
  { section: "Conversion & Speed", stats: [{ label: "Avg. Days to Close", value: "42", badge: "↑5% vs last month" }, { label: "Win Rate", value: "12%", badge: "↑2% vs last month" }] },
];

const STAGES: Stage[] = ["New", "Viewing Scheduled", "Negotiation", "Legal & Documentation"];

// ─── New Deal Modal ──────────────────────────────────────────────────────────
function NewDealModal({ onClose, onSave }: { onClose: () => void; onSave: (deal: Partial<Deal>) => void }) {
  const [form, setForm] = useState({ title: "", price: "", client: "", stage: "New" as Stage, priority: "Low" as Priority, area: "", source: "" });

  const submit = () => {
    if (!form.title || !form.client || !form.price) return;
    onSave({
      ref: `#HK-${Math.floor(10000 + Math.random() * 90000)}`,
      title: form.title,
      price: Number(form.price),
      client: form.client,
      clientAvatar: form.client.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2),
      stage: form.stage,
      priority: form.priority,
      area: form.area || "Apartment",
      source: form.source || "homifykenya.co.ke",
      date: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
      comments: 0, files: 0, assignees: [],
      image: "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=400&q=80",
      status: "New",
    });
    onClose();
  };

  const inp = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">New Deal</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Property Title *</label>
            <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. 2-Bed in Westlands" className={inp} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Rent (KES) *</label>
              <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="50000" className={inp} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Area</label>
              <input value={form.area} onChange={e => setForm(f => ({ ...f, area: e.target.value }))} placeholder="Apartment, 85 m²" className={inp} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Client Name *</label>
            <input value={form.client} onChange={e => setForm(f => ({ ...f, client: e.target.value }))} placeholder="e.g. James Kamau" className={inp} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Stage</label>
              <select value={form.stage} onChange={e => setForm(f => ({ ...f, stage: e.target.value as Stage }))} className={inp}>
                {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Priority</label>
              <select value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value as Priority }))} className={inp}>
                {(["Low","Medium","High"] as Priority[]).map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Source</label>
            <input value={form.source} onChange={e => setForm(f => ({ ...f, source: e.target.value }))} placeholder="homifykenya.co.ke" className={inp} />
          </div>
        </div>
        <div className="flex gap-3 px-6 pb-6">
          <button onClick={onClose} className="flex-1 border border-gray-200 text-gray-700 font-medium py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-sm">Cancel</button>
          <button onClick={submit} className="flex-1 bg-gray-900 hover:bg-gray-700 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm">Create Deal</button>
        </div>
      </div>
    </div>
  );
}

// ─── Deal Card (Kanban) ───────────────────────────────────────────────────────
function DealCard({ deal }: { deal: Deal }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative h-32 overflow-hidden">
        <Image src={deal.image} alt={deal.title} fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 px-3 py-2">
          <span className="text-[10px] font-medium text-white/90 bg-black/30 backdrop-blur-sm px-2 py-0.5 rounded-full">
            {deal.status}
          </span>
        </div>
      </div>
      <div className="p-3">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <p className="text-[10px] text-gray-400 font-mono">{deal.ref}</p>
            <span className={cn("text-[10px] font-semibold px-1.5 py-0.5 rounded mt-0.5 inline-block", PRIORITY_BADGE[deal.priority])}>
              {deal.priority}
            </span>
          </div>
          <button className="text-gray-300 hover:text-gray-600 transition-colors"><MoreHorizontal className="w-4 h-4" /></button>
        </div>
        <p className="text-sm font-semibold text-gray-900 leading-tight mb-1">{deal.title}</p>
        <p className="text-xs text-gray-500 mb-2">{deal.area}</p>
        <p className="text-base font-bold text-gray-900 mb-3">
          {formatKES(deal.price)}<span className="text-xs font-normal text-gray-400">/mo</span>
        </p>
        <div className="space-y-1 text-[11px] text-gray-400 mb-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Client</span>
            <span className="text-gray-700 font-medium">{deal.client}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Date</span>
            <span>{deal.date}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Source</span>
            <span className="text-brand-600">{deal.source}</span>
          </div>
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-gray-50">
          <div className="flex -space-x-1">
            {deal.assignees.map((a, i) => (
              <div key={i} className="w-6 h-6 rounded-full bg-brand-100 border-2 border-white flex items-center justify-center text-[9px] font-bold text-brand-700">
                {a}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3 text-[11px] text-gray-400">
            <span className="flex items-center gap-0.5"><MessageSquare className="w-3 h-3" /> {deal.comments}</span>
            <span className="flex items-center gap-0.5"><Paperclip className="w-3 h-3" /> {deal.files}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function DealsPage() {
  const [view, setView] = useState<"kanban" | "table" | "list">("kanban");
  const [deals, setDeals] = useState<Deal[]>(INITIAL_DEALS);
  const [showModal, setShowModal] = useState(false);
  const [sortField, setSortField] = useState<"date" | "price" | "client">("date");

  const addDeal = (partial: Partial<Deal>) => {
    const newDeal: Deal = {
      id: Date.now().toString(),
      ref: partial.ref ?? "#HK-00000",
      title: partial.title ?? "",
      price: partial.price ?? 0,
      area: partial.area ?? "Apartment",
      priority: partial.priority ?? "Low",
      client: partial.client ?? "",
      clientAvatar: partial.clientAvatar ?? "?",
      date: partial.date ?? "",
      source: partial.source ?? "",
      comments: 0, files: 0,
      assignees: partial.assignees ?? [],
      image: partial.image ?? "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=400&q=80",
      status: partial.status ?? "New",
      stage: partial.stage ?? "New",
    };
    setDeals(prev => [newDeal, ...prev]);
  };

  const dealsGrouped = STAGES.reduce((acc, stage) => {
    acc[stage] = deals.filter(d => d.stage === stage);
    return acc;
  }, {} as Record<Stage, Deal[]>);

  const sortedDeals = [...deals].sort((a, b) => {
    if (sortField === "price") return b.price - a.price;
    if (sortField === "client") return a.client.localeCompare(b.client);
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <div className="h-full flex flex-col">
      {showModal && <NewDealModal onClose={() => setShowModal(false)} onSave={addDeal} />}

      {/* Page header */}
      <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-100 bg-white flex items-start justify-between gap-4 flex-wrap">
        <h1 className="text-xl font-bold text-gray-900">Deals pipeline</h1>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex -space-x-2">
            {["GW","DM","PO","AO"].map((a, i) => (
              <div key={i} className="w-8 h-8 rounded-full bg-brand-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-brand-700">
                {a}
              </div>
            ))}
            <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-gray-500">+2</div>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-gray-900 hover:bg-gray-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" /> New Deal
          </button>
        </div>
      </div>

      {/* Pipeline stats — responsive grid */}
      <div className="bg-white border-b border-gray-100 px-4 sm:px-6 py-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6">
          {PIPELINE_STATS.map(({ section, stats }) => (
            <div key={section} className="border border-gray-100 rounded-xl p-4">
              <div className="flex items-center gap-1.5 mb-3">
                <p className="text-xs font-semibold text-gray-700">{section}</p>
                <Info className="w-3 h-3 text-gray-300" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                {stats.map(({ label, value, badge }) => (
                  <div key={label}>
                    <p className="text-[11px] text-gray-400 mb-0.5">{label}</p>
                    <p className="text-lg font-bold text-gray-900">{value}</p>
                    <p className={cn("text-[10px] font-medium mt-0.5",
                      badge.startsWith("↑") ? "text-brand-500" : badge.startsWith("↓") ? "text-red-500" : "text-gray-400")}>
                      {badge}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white border-b border-gray-100 px-4 sm:px-6 py-3 flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 text-sm font-semibold text-gray-900 bg-gray-100 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> New Deal
          </button>
          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
            {(["kanban","table","list"] as const).map((v, i) => (
              <button key={v} onClick={() => setView(v)}
                className={cn("px-2.5 py-1.5 transition-colors", view === v ? "bg-gray-900 text-white" : "text-gray-500 hover:bg-gray-50")}
              >
                {i === 0 ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                    <rect x="1" y="1" width="6" height="14" rx="1"/><rect x="9" y="1" width="6" height="14" rx="1"/>
                  </svg>
                ) : i === 1 ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 6h18M3 14h18M3 18h18"/>
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h8M4 18h12"/>
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={sortField}
            onChange={e => setSortField(e.target.value as typeof sortField)}
            className="flex items-center gap-1.5 text-sm text-gray-600 border border-gray-200 px-3 py-1.5 rounded-lg hover:border-gray-300 transition-colors bg-white focus:outline-none cursor-pointer"
          >
            <option value="date">Sort: Date</option>
            <option value="price">Sort: Price</option>
            <option value="client">Sort: Client</option>
          </select>
        </div>
      </div>

      {/* Content area */}
      {view === "kanban" && (
        <div className="flex-1 overflow-x-auto p-4 sm:p-6">
          <div className="flex gap-4 sm:gap-5 h-full" style={{ minWidth: "900px" }}>
            {STAGES.map((stage) => (
              <div key={stage} className="flex flex-col w-72 flex-shrink-0">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className={cn("w-2 h-2 rounded-full", STAGE_COLORS[stage])} />
                    <span className="text-sm font-semibold text-gray-700">{stage}</span>
                    <span className="text-xs text-gray-400 font-medium">{dealsGrouped[stage].length}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => setShowModal(true)} className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-700 rounded transition-colors">
                      <Plus className="w-4 h-4" />
                    </button>
                    <button className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-700 rounded transition-colors">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="flex-1 space-y-3 overflow-y-auto">
                  {dealsGrouped[stage].map((deal) => <DealCard key={deal.id} deal={deal} />)}
                  <button
                    onClick={() => setShowModal(true)}
                    className="w-full border-2 border-dashed border-gray-200 hover:border-gray-300 rounded-xl py-3 text-sm text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    + Add deal
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {view === "table" && (
        <div className="flex-1 overflow-auto p-4 sm:p-6">
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    {["Property", "Client", "Stage", "Priority", "Rent", "Date", "Source", ""].map(h => (
                      <th key={h} className="text-left text-xs font-semibold text-gray-400 px-4 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {sortedDeals.map(deal => (
                    <tr key={deal.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-[10px] text-gray-400 font-mono">{deal.ref}</p>
                          <p className="text-sm font-semibold text-gray-900">{deal.title}</p>
                          <p className="text-xs text-gray-400">{deal.area}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-brand-100 flex items-center justify-center text-[10px] font-bold text-brand-700 flex-shrink-0">
                            {deal.clientAvatar}
                          </div>
                          <p className="text-sm text-gray-700">{deal.client}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <span className={cn("w-2 h-2 rounded-full flex-shrink-0", STAGE_COLORS[deal.stage])} />
                          <span className="text-xs text-gray-600">{deal.stage}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn("text-xs font-semibold px-2 py-0.5 rounded", PRIORITY_BADGE[deal.priority])}>
                          {deal.priority}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm font-bold text-gray-900">{formatKES(deal.price)}<span className="text-xs font-normal text-gray-400">/mo</span></td>
                      <td className="px-4 py-3 text-xs text-gray-400">{deal.date}</td>
                      <td className="px-4 py-3 text-xs text-brand-600">{deal.source}</td>
                      <td className="px-4 py-3">
                        <button className="text-gray-300 hover:text-gray-600 transition-colors">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {view === "list" && (
        <div className="flex-1 overflow-auto p-4 sm:p-6">
          <div className="space-y-3">
            {sortedDeals.map(deal => (
              <div key={deal.id} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-4 hover:shadow-sm transition-shadow">
                <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                  <Image src={deal.image} alt={deal.title} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-[10px] text-gray-400 font-mono">{deal.ref}</p>
                    <span className={cn("text-[10px] font-semibold px-1.5 py-0.5 rounded", PRIORITY_BADGE[deal.priority])}>{deal.priority}</span>
                    <div className="flex items-center gap-1">
                      <span className={cn("w-1.5 h-1.5 rounded-full", STAGE_COLORS[deal.stage])} />
                      <span className="text-[10px] text-gray-500">{deal.stage}</span>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-gray-900 mt-0.5 truncate">{deal.title}</p>
                  <p className="text-xs text-gray-400">{deal.area} · {deal.client}</p>
                </div>
                <div className="text-right flex-shrink-0 hidden sm:block">
                  <p className="text-base font-bold text-gray-900">{formatKES(deal.price)}<span className="text-xs font-normal text-gray-400">/mo</span></p>
                  <p className="text-xs text-gray-400 mt-0.5">{deal.date}</p>
                </div>
                <button className="text-gray-300 hover:text-gray-600 transition-colors flex-shrink-0">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
