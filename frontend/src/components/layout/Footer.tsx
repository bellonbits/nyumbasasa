"use client";

import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin, MapPin, Phone, Mail, ArrowRight } from "lucide-react";
import Logo from "./Logo";

const COLS = [
  {
    title: "Properties",
    links: [
      { label: "Bedsitters",   href: "/search?houseType=bedsitter"   },
      { label: "Studios",      href: "/search?houseType=studio"      },
      { label: "1 Bedroom",    href: "/search?houseType=one_bedroom" },
      { label: "2 Bedrooms",   href: "/search?houseType=two_bedroom" },
      { label: "All Listings", href: "/search"                       },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us",   href: "/about"   },
      { label: "Blog",       href: "/blog"    },
      { label: "Top Agents", href: "/agents"  },
      { label: "Careers",    href: "/careers" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Renters Guide", href: "/guide"   },
      { label: "Agents Guide",  href: "/agents"  },
      { label: "Price Trends",  href: "/search"  },
      { label: "Support",       href: "/support" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Use",   href: "/terms"   },
    ],
  },
];

const SOCIALS = [
  { icon: Facebook,  href: "#", label: "Facebook"  },
  { icon: Twitter,   href: "#", label: "Twitter"   },
  { icon: Linkedin,  href: "#", label: "LinkedIn"  },
  { icon: Instagram, href: "#", label: "Instagram" },
];

export default function Footer() {
  return (
    <footer className="bg-[#0f1117] text-gray-400">

      {/* ── Newsletter strip ──────────────────────────────────── */}
      <div className="border-b border-white/[0.07]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <h3 className="text-white font-bold text-lg mb-1 tracking-tight">
                Get new listings in your inbox
              </h3>
              <p className="text-sm text-gray-500">
                Be first to know when new homes are listed.
              </p>
            </div>
            <form
              className="flex gap-2 w-full sm:w-auto"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 sm:w-64 bg-white/[0.06] border border-white/[0.12] text-white
                           placeholder:text-gray-600 text-sm px-4 py-2.5 rounded-xl
                           focus:outline-none focus:border-brand-400/60 transition-colors"
              />
              <button
                type="submit"
                className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600
                           text-white font-semibold text-sm px-5 py-2.5 rounded-xl
                           transition-all whitespace-nowrap shadow-blue hover:shadow-blue-lg"
              >
                Subscribe <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* ── Main footer body ──────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
        <div className="flex flex-col lg:flex-row gap-12">

          {/* Brand column */}
          <div className="lg:w-64 shrink-0">
            <div className="mb-5">
              <Logo size="md" invert />
            </div>
            <p className="text-sm text-gray-500 leading-relaxed mb-6">
              Kenya&apos;s leading rental marketplace. Finding affordable homes across all 47 counties.
            </p>

            {/* Contact */}
            <ul className="space-y-3">
              <li className="flex items-center gap-2.5 text-sm">
                <Phone className="w-4 h-4 text-brand-400 shrink-0" />
                <span>+254 700 000 000</span>
              </li>
              <li className="flex items-center gap-2.5 text-sm">
                <Mail className="w-4 h-4 text-brand-400 shrink-0" />
                <span>hello@nyumbasasa.co.ke</span>
              </li>
              <li className="flex items-start gap-2.5 text-sm">
                <MapPin className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                <span>Westlands, Nairobi, Kenya</span>
              </li>
            </ul>
          </div>

          {/* Link columns */}
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {COLS.map(({ title, links }) => (
              <div key={title}>
                <p className="text-white text-[11px] font-bold uppercase tracking-[0.15em] mb-5">
                  {title}
                </p>
                <ul className="space-y-3">
                  {links.map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        className="text-sm text-gray-500 hover:text-white transition-colors"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* ── Bottom bar ──────────────────────────────────────── */}
        <div className="border-t border-white/[0.07] mt-14 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600">
            © {new Date().getFullYear()} Nyumbasasa. All rights reserved. Built for Kenyans, by Kenyans.
          </p>
          <div className="flex items-center gap-2">
            {SOCIALS.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="w-9 h-9 rounded-full bg-white/[0.05] hover:bg-brand-500/20
                           border border-white/[0.08] hover:border-brand-500/40
                           flex items-center justify-center
                           text-gray-500 hover:text-brand-400
                           transition-all"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
