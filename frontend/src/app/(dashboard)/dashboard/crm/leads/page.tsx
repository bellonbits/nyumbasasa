"use client";

import { useState } from "react";
import { Plus, Search, MoreHorizontal, Phone, Mail, MapPin, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type LeadStatus = "New" | "Contacted" | "Qualified" | "Lost";

interface Lead {
  id: string; name: string; email: string; phone: string; location: string;
  interest: string; budget: string; status: LeadStatus; date: string; avatar: string;
}

const STATUS_STYLES: Record<LeadStatus, string> = {
  New:       "bg-purple-50 text-purple-700",
  Contacted: "bg-blue-50   text-blue-700",
  Qualified: "bg-green-50  text-green-700",
  Lost:      "bg-red-50    text-red-600",
};

const HOUSE_TYPES = ["Bedsitter", "Studio", "1 Bedroom", "2 Bedroom", "3 Bedroom"];
const KENYA_COUNTIES = ["Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret", "Thika", "Nyeri", "Machakos", "Garissa", "Kakamega"];

const INITIAL_LEADS: Lead[] = [
  { id:"l1", name:"James Kamau",   email:"james@gmail.com",   phone:"+254 722 001 001", location:"Nairobi", interest:"2 Bedroom", budget:"KES 30K–50K", status:"Qualified", date:"10 Mar 2026", avatar:"JK" },
  { id:"l2", name:"Fatuma Hassan", email:"fatuma@gmail.com",  phone:"+254 711 002 002", location:"Mombasa", interest:"Bedsitter", budget:"KES 8K–15K",  status:"New",       date:"9 Mar 2026",  avatar:"FH" },
  { id:"l3", name:"Peter Ochieng", email:"peter@yahoo.com",   phone:"+254 733 003 003", location:"Kisumu",  interest:"Studio",    budget:"KES 10K–20K", status:"Contacted", date:"8 Mar 2026",  avatar:"PO" },
  { id:"l4", name:"Akinyi Otieno", email:"akinyi@gmail.com",  phone:"+254 700 004 004", location:"Nakuru",  interest:"1 Bedroom", budget:"KES 15K–25K", status:"New",       date:"7 Mar 2026",  avatar:"AO" },
  { id:"l5", name:"David Mwangi",  email:"david@gmail.com",   phone:"+254 745 005 005", location:"Nairobi", interest:"3 Bedroom", budget:"KES 60K–90K", status:"Qualified", date:"6 Mar 2026",  avatar:"DM" },
  { id:"l6", name:"Grace Wanjiku", email:"grace@outlook.com", phone:"+254 712 006 006", location:"Nairobi", interest:"2 Bedroom", budget:"KES 35K–55K", status:"Lost",      date:"5 Mar 2026",  avatar:"GW" },
];

function AddLeadModal({ onClose, onAdd }: { onClose: () => void; onAdd: (lead: Lead) => void }) {
  const [form, setForm] = useState({
    name: "", email: "", phone: "", location: "Nairobi",
    interest: "1 Bedroom", budget: "", status: "New" as LeadStatus,
  });

  const submit = () => {
    if (!form.name.trim() || !form.email.trim()) return;
    const initials = form.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
    onAdd({
      id: Date.now().toString(),
      ...form,
      date: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
      avatar: initials,
    });
    onClose();
  };

  const inp = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent placeholder:text-gray-400";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white">
          <h2 className="font-bold text-gray-900">Add Lead</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name *</label>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. James Kamau" className={inp} autoFocus />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email *</label>
              <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="name@email.com" className={inp} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
              <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+254 700 000 000" className={inp} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Location</label>
              <select value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} className={inp}>
                {KENYA_COUNTIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Interest</label>
              <select value={form.interest} onChange={e => setForm(f => ({ ...f, interest: e.target.value }))} className={inp}>
                {HOUSE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Budget Range</label>
              <input value={form.budget} onChange={e => setForm(f => ({ ...f, budget: e.target.value }))} placeholder="e.g. KES 20K–35K" className={inp} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
              <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as LeadStatus }))} className={inp}>
                {(["New","Contacted","Qualified","Lost"] as LeadStatus[]).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </div>
        <div className="flex gap-3 px-6 pb-6">
          <button onClick={onClose} className="flex-1 border border-gray-200 text-gray-700 font-medium py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-sm">Cancel</button>
          <button onClick={submit} className="flex-1 bg-gray-900 hover:bg-gray-700 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm">Add Lead</button>
        </div>
      </div>
    </div>
  );
}

export default function LeadsPage() {
  const [leads, setLeads] = useState(INITIAL_LEADS);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingStatus, setEditingStatus] = useState<string | null>(null);

  const filtered = leads.filter(l =>
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.location.toLowerCase().includes(search.toLowerCase()) ||
    l.email.toLowerCase().includes(search.toLowerCase())
  );

  const addLead = (lead: Lead) => setLeads(ls => [lead, ...ls]);

  const updateStatus = (id: string, status: LeadStatus) => {
    setLeads(ls => ls.map(l => l.id === id ? { ...l, status } : l));
    setEditingStatus(null);
  };

  const removeLead = (id: string) => setLeads(ls => ls.filter(l => l.id !== id));

  return (
    <div className="p-4 sm:p-6">
      {showModal && <AddLeadModal onClose={() => setShowModal(false)} onAdd={addLead} />}

      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Leads</h1>
          <p className="text-sm text-gray-400 mt-0.5">{leads.length} total leads</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-gray-900 hover:bg-gray-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Lead
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 mb-5 max-w-sm">
        <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search leads..."
          className="text-sm bg-transparent focus:outline-none flex-1 text-gray-700 placeholder:text-gray-400"
        />
        {search && (
          <button onClick={() => setSearch("")} className="text-gray-300 hover:text-gray-500">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Table — scrollable on mobile */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {["Lead","Contact","Location","Interest","Budget","Status","Date",""].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-400 px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-sm text-gray-400">No leads found</td>
                </tr>
              ) : filtered.map(lead => (
                <tr key={lead.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center text-xs font-bold text-brand-700 flex-shrink-0">
                        {lead.avatar}
                      </div>
                      <p className="text-sm font-semibold text-gray-900">{lead.name}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Mail className="w-3 h-3 flex-shrink-0" /> <span className="truncate max-w-[140px]">{lead.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <Phone className="w-3 h-3 flex-shrink-0" /> {lead.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5 text-sm text-gray-600">
                      <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" /> {lead.location}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{lead.interest}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{lead.budget}</td>
                  <td className="px-4 py-3">
                    {editingStatus === lead.id ? (
                      <select
                        autoFocus
                        value={lead.status}
                        onChange={e => updateStatus(lead.id, e.target.value as LeadStatus)}
                        onBlur={() => setEditingStatus(null)}
                        className="text-xs font-semibold border border-gray-200 rounded-full px-2 py-1 bg-white focus:outline-none cursor-pointer"
                      >
                        {(["New","Contacted","Qualified","Lost"] as LeadStatus[]).map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    ) : (
                      <button
                        onClick={() => setEditingStatus(lead.id)}
                        className={cn("flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full hover:opacity-80 transition-opacity", STATUS_STYLES[lead.status])}
                      >
                        {lead.status} <ChevronDown className="w-3 h-3" />
                      </button>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400">{lead.date}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => removeLead(lead.id)}
                      className="text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
