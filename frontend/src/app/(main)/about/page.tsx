import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Building2, Users, BadgeCheck, ArrowRight } from "lucide-react";

export const metadata: Metadata = { title: "About Us" };

const STATS = [
  { value: "10,000+", label: "Verified Listings"  },
  { value: "47",      label: "Counties Covered"   },
  { value: "5,000+",  label: "Happy Renters"       },
  { value: "2,000+",  label: "Verified Agents"     },
];

const TEAM = [
  { name: "Brian Otieno",  role: "CEO & Co-founder",     avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80" },
  { name: "Amina Kariuki", role: "Head of Product",      avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200&q=80" },
  { name: "Kevin Nganga",  role: "CTO",                  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80" },
  { name: "Zara Odhiambo", role: "Head of Agent Network",avatar: "https://images.unsplash.com/photo-1589156229687-496a31ad1d1f?w=200&q=80" },
];

const VALUES = [
  { icon: BadgeCheck, title: "Transparency",    desc: "Every listing goes through a verification process. We eliminate fake listings and misleading prices." },
  { icon: MapPin,     title: "Nationwide",      desc: "We cover all 47 counties — not just Nairobi. Every Kenyan deserves access to quality housing." },
  { icon: Users,      title: "Community First", desc: "We connect renters directly with agents and landlords, cutting out unnecessary middlemen." },
  { icon: Building2,  title: "Quality Homes",   desc: "Our platform standards ensure listings meet minimum quality requirements for habitability." },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-[#F5F3EE] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            Connecting Kenyans to<br />their next home
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto mb-8">
            Homify Kenya was built to solve a simple problem: finding affordable, verified rentals in Kenya is too hard.
            We're changing that — one listing at a time.
          </p>
          <Link href="/search"
            className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-700 text-white font-semibold px-6 py-3 rounded-full transition-colors">
            Browse Listings <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white py-14 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {STATS.map(({ value, label }) => (
              <div key={label}>
                <p className="text-3xl font-bold text-gray-900">{value}</p>
                <p className="text-gray-400 text-sm mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-brand-500 text-sm font-semibold tracking-widest uppercase mb-3">Our Story</p>
              <h2 className="text-3xl font-bold text-gray-900 mb-5">Started in Nairobi,<br />built for all of Kenya</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  In 2024, our founders struggled to find verified, affordable housing when moving within Kenya.
                  The existing platforms were cluttered, full of duplicate listings, and focused only on Nairobi.
                </p>
                <p>
                  So we built Homify Kenya — a clean, fast, and trustworthy platform where renters can search across
                  all 47 counties, connect directly with agents on WhatsApp, and move into their new home with confidence.
                </p>
                <p>
                  Today, we're the leading rental marketplace for affordable housing in Kenya, serving thousands of
                  renters and agents every month.
                </p>
              </div>
            </div>
            <div className="relative h-80 rounded-3xl overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1611348586804-61bf6c080437?w=800&q=80"
                alt="Nairobi skyline"
                fill className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-[#F5F3EE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Our Values</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl p-6 border border-gray-100">
                <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600 mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900">Meet the Team</h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {TEAM.map(({ name, role, avatar }) => (
              <div key={name} className="text-center">
                <div className="relative w-20 h-20 rounded-full overflow-hidden mx-auto mb-3">
                  <Image src={avatar} alt={name} fill className="object-cover" />
                </div>
                <p className="font-semibold text-gray-900">{name}</p>
                <p className="text-sm text-gray-400">{role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gray-900 text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">Find your next home today</h2>
          <p className="text-gray-400 mb-8">Browse thousands of verified rentals across all 47 counties in Kenya.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/search" className="bg-brand-500 hover:bg-brand-600 text-white font-semibold px-6 py-3 rounded-full transition-colors">
              Browse Listings
            </Link>
            <Link href="/auth/register" className="border border-white/20 hover:border-white/40 text-white font-semibold px-6 py-3 rounded-full transition-colors">
              List a Property
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
