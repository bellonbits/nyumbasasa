"use client";

import { useState } from "react";
import { Plus, Search, MoreHorizontal, Phone, Mail, Star, X, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Contact {
  id: string; name: string; email: string; phone: string;
  type: "Client" | "Agent" | "Owner"; properties: number;
  rating: number; avatar: string; location: string; lastContact: string;
}

const TYPE_STYLES = {
  Client: "bg-blue-50 text-blue-700",
  Agent:  "bg-green-50 text-green-700",
  Owner:  "bg-amber-50 text-amber-700",
};

const KENYA_COUNTIES = ["Nairobi","Mombasa","Kisumu","Nakuru","Eldoret","Thika","Nyeri","Machakos"];

const INITIAL_CONTACTS: Contact[] = [
  { id:"c1", name:"James Kamau",   email:"james@gmail.com",   phone:"+254 722 001 001", type:"Client", properties:0,  rating:4, avatar:"JK", location:"Nairobi", lastContact:"2 days ago"  },
  { id:"c2", name:"Grace Wanjiku", email:"grace@outlook.com", phone:"+254 712 006 006", type:"Agent",  properties:12, rating:5, avatar:"GW", location:"Nairobi", lastContact:"Today"       },
  { id:"c3", name:"David Mwangi",  email:"david@gmail.com",   phone:"+254 745 005 005", type:"Agent",  properties:8,  rating:5, avatar:"DM", location:"Nairobi", lastContact:"Yesterday"   },
  { id:"c4", name:"Fatuma Hassan", email:"fatuma@gmail.com",  phone:"+254 711 002 002", type:"Owner",  properties:3,  rating:4, avatar:"FH", location:"Mombasa", lastContact:"3 days ago"  },
  { id:"c5", name:"Peter Ochieng", email:"peter@yahoo.com",   phone:"+254 733 003 003", type:"Agent",  properties:5,  rating:5, avatar:"PO", location:"Kisumu",  lastContact:"1 week ago"  },
  { id:"c6", name:"Akinyi Otieno", email:"akinyi@gmail.com",  phone:"+254 700 004 004", type:"Client", properties:0,  rating:4, avatar:"AO", location:"Nakuru",  lastContact:"4 days ago"  },
];

function AddContactModal({ onClose, onAdd }: { onClose: () => void; onAdd: (c: Contact) => void }) {
  const [form, setForm] = useState({
    name: "", email: "", phone: "",
    type: "Client" as "Client" | "Agent" | "Owner",
    location: "Nairobi", rating: 4,
  });

  const submit = () => {
    if (!form.name.trim() || !form.email.trim()) return;
    const initials = form.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
    onAdd({
      id: Date.now().toString(),
      ...form,
      properties: 0,
      avatar: initials,
      lastContact: "Just now",
    });
    onClose();
  };

  const inp = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent placeholder:text-gray-400";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">Add Contact</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name *</label>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. James Kamau" className={inp} autoFocus />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email *</label>
              <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="name@email.com" className={inp} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
              <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+254 700 000 000" className={inp} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Type</label>
              <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as "Client" | "Agent" | "Owner" }))} className={inp}>
                <option value="Client">Client</option>
                <option value="Agent">Agent</option>
                <option value="Owner">Owner</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Location</label>
              <select value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} className={inp}>
                {KENYA_COUNTIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
            <div className="flex items-center gap-1">
              {[1,2,3,4,5].map(s => (
                <button key={s} type="button" onClick={() => setForm(f => ({ ...f, rating: s }))}>
                  <Star className={cn("w-6 h-6 transition-colors", s <= form.rating ? "fill-amber-400 text-amber-400" : "text-gray-200 hover:text-amber-200")} />
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex gap-3 px-6 pb-6">
          <button onClick={onClose} className="flex-1 border border-gray-200 text-gray-700 font-medium py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-sm">Cancel</button>
          <button onClick={submit} className="flex-1 bg-gray-900 hover:bg-gray-700 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm">Add Contact</button>
        </div>
      </div>
    </div>
  );
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState(INITIAL_CONTACTS);
  const [search, setSearch]     = useState("");
  const [filter, setFilter]     = useState<"All" | "Client" | "Agent" | "Owner">("All");
  const [showModal, setShowModal] = useState(false);

  const filtered = contacts.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.location.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || c.type === filter;
    return matchSearch && matchFilter;
  });

  const addContact  = (c: Contact) => setContacts(cs => [c, ...cs]);
  const removeContact = (id: string) => setContacts(cs => cs.filter(c => c.id !== id));

  return (
    <div className="p-4 sm:p-6">
      {showModal && <AddContactModal onClose={() => setShowModal(false)} onAdd={addContact} />}

      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Contacts</h1>
          <p className="text-sm text-gray-400 mt-0.5">{contacts.length} total contacts</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-gray-900 hover:bg-gray-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Contact
        </button>
      </div>

      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 flex-1 min-w-48 max-w-sm">
          <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search contacts..."
            className="text-sm bg-transparent focus:outline-none flex-1 text-gray-700 placeholder:text-gray-400"
          />
          {search && (
            <button onClick={() => setSearch("")} className="text-gray-300 hover:text-gray-500">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="flex items-center gap-1 flex-wrap">
          {(["All","Client","Agent","Owner"] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
                filter === f ? "bg-gray-900 text-white" : "border border-gray-200 text-gray-600 hover:border-gray-400"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400 text-sm">No contacts found</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(contact => (
            <div key={contact.id} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-shadow group">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center text-sm font-bold text-brand-700 flex-shrink-0">
                    {contact.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{contact.name}</p>
                    <span className={cn("text-[11px] font-semibold px-2 py-0.5 rounded-full", TYPE_STYLES[contact.type])}>
                      {contact.type}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => removeContact(contact.id)}
                  className="text-gray-200 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-1.5 text-xs text-gray-500 mb-4">
                <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" /> <span className="truncate">{contact.email}</span></div>
                <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" /> {contact.phone}</div>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-gray-50 text-xs text-gray-400">
                <div className="flex items-center gap-0.5">
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} className={cn("w-3 h-3", s <= contact.rating ? "fill-amber-400 text-amber-400" : "text-gray-200")} />
                  ))}
                </div>
                <span>Last: {contact.lastContact}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
