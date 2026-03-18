import Link from "next/link";
import Image from "next/image";
import { Star, ArrowRight, BadgeCheck, Phone } from "lucide-react";

const AGENTS = [
  { name: "Grace Wanjiku",  agency: "Wanjiku Real Estate", props: 453, rating: 5.0, avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200&q=80" },
  { name: "David Mwangi",   agency: "Nairobi Homes Ltd",   props: 325, rating: 5.0, avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80" },
  { name: "Peter Ochieng",  agency: "Rift Valley Homes",   props: 289, rating: 5.0, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80" },
  { name: "Akinyi Otieno",  agency: "Lakeside Properties", props: 230, rating: 5.0, avatar: "https://images.unsplash.com/photo-1589156229687-496a31ad1d1f?w=200&q=80" },
];

const CTA_STATS = [
  { value: "10K+", label: "Active Listings", sub: "Updated daily"  },
  { value: "500+", label: "Verified Agents", sub: "Across Kenya"   },
  { value: "5K+",  label: "Families Housed", sub: "Since 2021"     },
  { value: "4.9★", label: "Agent Rating",    sub: "Average score"  },
];

export default function AgentCTA() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── CTA Banner ─────────────────────────────────────── */}
        <div className="relative overflow-hidden rounded-3xl bg-[#0f1117] mb-16">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-72 h-72 bg-brand-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-0 items-center">
            {/* Left */}
            <div className="p-10 lg:p-14">
              <div className="inline-flex items-center gap-2 bg-brand-500/20 border border-brand-400/30 text-brand-300 text-xs font-bold px-4 py-2 rounded-full mb-6">
                <BadgeCheck className="w-3.5 h-3.5" />
                Verified Professionals
              </div>
              <h2 className="text-display-sm font-extrabold text-white mb-4 leading-tight">
                Connect with Kenya&apos;s<br />Top Real Estate Agents
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-md">
                Skip the hustle. Our verified agents handle everything — viewings, negotiations,
                and paperwork — so you can move in stress-free.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/auth/register" className="btn-primary">
                  Become an Agent <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/search"
                  className="inline-flex items-center gap-2 border border-white/20 hover:border-white/40 text-white font-semibold text-sm px-6 py-3 rounded-xl transition-all"
                >
                  Browse Listings
                </Link>
              </div>
            </div>

            {/* Right — stats grid */}
            <div className="grid grid-cols-2 border-t lg:border-t-0 lg:border-l border-white/[0.08]">
              {CTA_STATS.map(({ value, label, sub }, i) => (
                <div
                  key={label}
                  className={`p-8 flex flex-col items-center text-center border-white/[0.08]
                    ${i % 2 === 0 ? "border-r" : ""}
                    ${i < 2 ? "border-b" : ""}`}
                >
                  <p className="text-display-sm font-extrabold text-brand-400 mb-1 leading-none">{value}</p>
                  <p className="text-white text-xs font-semibold mb-0.5">{label}</p>
                  <p className="text-gray-500 text-xs">{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Agent cards ────────────────────────────────────── */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="section-label mb-1 block">Our Experts</span>
            <h2 className="text-display-sm font-extrabold text-ink">Top Agents This Month</h2>
          </div>
          <Link
            href="/search"
            className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-ink-muted hover:text-ink border border-surface-border hover:border-ink-faint px-4 py-2 rounded-full transition-all"
          >
            All agents <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {AGENTS.map((agent) => (
            <div
              key={agent.name}
              className="group bg-white border border-surface-border hover:border-brand-200 rounded-2xl p-6 text-center hover:shadow-card-hover transition-all duration-300 cursor-pointer"
            >
              <div className="relative w-16 h-16 rounded-full overflow-hidden mx-auto mb-4 ring-4 ring-surface-muted group-hover:ring-brand-100 transition-all">
                <Image src={agent.avatar} alt={agent.name} fill className="object-cover" />
              </div>

              <div className="flex items-center justify-center gap-0.5 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                ))}
              </div>

              <p className="text-sm font-bold text-ink leading-tight mb-0.5">{agent.name}</p>
              <p className="text-xs text-ink-faint mb-1">{agent.agency}</p>
              <p className="text-xs font-semibold text-brand-500 mb-4">{agent.props} properties</p>

              <button className="w-full flex items-center justify-center gap-2 border border-surface-border hover:border-brand-400 hover:bg-brand-50 hover:text-brand-600 text-ink-muted text-xs font-semibold py-2.5 rounded-xl transition-all">
                <Phone className="w-3.5 h-3.5" /> Contact
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
