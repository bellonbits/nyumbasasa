"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

const TESTIMONIALS = [
  {
    id: 1,
    name: "Grace Wanjiku",
    location: "Nairobi, KE",
    avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&q=80",
    rating: 5,
    text: "This is my third time using Nyumbasasa. They have delivered every time — always reliable, honest, and on top of everything. I wouldn't trust anyone else for renting in Nairobi.",
  },
  {
    id: 2,
    name: "Brian Omondi",
    location: "Kisumu, KE",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80",
    rating: 5,
    text: "Found my studio in Kisumu within 48 hours! The WhatsApp contact feature made it so easy to communicate directly with the landlord. No middlemen, no extra fees.",
  },
  {
    id: 3,
    name: "Amina Hassan",
    location: "Mombasa, KE",
    avatar: "https://images.unsplash.com/photo-1589156229687-496a31ad1d1f?w=400&q=80",
    rating: 5,
    text: "As a working mama, I needed something affordable near school routes. Nyumbasasa helped me compare options across estates in Nyali. Highly recommend!",
  },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const t = TESTIMONIALS[current];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Header ─────────────────────────────────────────── */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="section-label mb-2">Testimonials</p>
            <h2 className="text-display-sm font-extrabold text-ink">
              What Our Customers Say<br />About Nyumbasasa
            </h2>
          </div>
          <div className="hidden sm:flex gap-2">
            <button
              onClick={() => setCurrent((c) => (c - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)}
              className="w-10 h-10 rounded-full border-2 border-surface-border hover:border-brand-400 flex items-center justify-center transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-ink-muted" />
            </button>
            <button
              onClick={() => setCurrent((c) => (c + 1) % TESTIMONIALS.length)}
              className="w-10 h-10 rounded-full bg-brand-500 hover:bg-brand-600 flex items-center justify-center transition-colors shadow-blue"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Avatar image */}
          <div className="relative h-80 rounded-3xl overflow-hidden bg-surface-muted">
            <Image src={t.avatar} alt={t.name} fill className="object-cover" />
          </div>

          {/* Quote card */}
          <div className="bg-surface rounded-3xl p-8 lg:p-10 border border-surface-border">
            <div className="flex gap-1 mb-6">
              {Array.from({ length: t.rating }).map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <blockquote className="text-ink text-lg leading-relaxed mb-6 font-medium">
              &quot;{t.text}&quot;
            </blockquote>
            <div>
              <p className="font-bold text-ink">— {t.name}</p>
              <p className="text-ink-faint text-sm">{t.location}</p>
            </div>

            {/* Progress dots */}
            <div className="flex gap-2 mt-8">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === current ? "bg-brand-500 w-6" : "bg-surface-border w-2 hover:bg-ink-faint"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
