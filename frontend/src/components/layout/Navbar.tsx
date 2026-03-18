"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  ChevronDown, Menu, X, PlusCircle, LogOut,
  LayoutDashboard, BedDouble, Building, Home,
  Building2, Warehouse, Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useMe, useLogout } from "@/hooks/useAuth";
import Logo from "./Logo";

const NAV_LINKS = [
  { label: "Bedsitter",  href: "/search?houseType=bedsitter",    icon: BedDouble  },
  { label: "Studio",     href: "/search?houseType=studio",        icon: Building   },
  { label: "1 Bedroom",  href: "/search?houseType=one_bedroom",   icon: Home       },
  { label: "2 Bedrooms", href: "/search?houseType=two_bedroom",   icon: Building2  },
  { label: "3 Bedrooms", href: "/search?houseType=three_bedroom", icon: Warehouse  },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen]   = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled]       = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const { data: user } = useMe();
  const logout   = useLogout();
  const pathname = usePathname();

  const isHome = pathname === "/";
  const solid  = !isHome || scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node))
        setProfileOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* ── shared text colours ─────────────────────────────────── */
  const linkCls = solid
    ? "text-ink-muted hover:text-ink hover:bg-surface-muted"
    : "text-white/80 hover:text-white hover:bg-white/10";

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        solid
          ? "bg-white shadow-[0_1px_0_0_#e8ecf2]"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-[68px] gap-8">

          {/* ── Logo ─────────────────────────────────────────── */}
          <Logo size="md" invert={!solid} />

          {/* ── Desktop nav links ────────────────────────────── */}
          <div className="hidden lg:flex items-center gap-0.5 flex-1">
            {NAV_LINKS.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className={cn(
                  "text-sm font-medium px-3.5 py-2 rounded-lg transition-all whitespace-nowrap",
                  linkCls
                )}
              >
                {label}
              </Link>
            ))}

            <div className={cn("mx-1 w-px h-4", solid ? "bg-surface-border" : "bg-white/20")} />

            <Link
              href="/search"
              className={cn(
                "text-sm font-medium px-3.5 py-2 rounded-lg transition-all",
                linkCls
              )}
            >
              All Properties
            </Link>
          </div>

          {/* ── Right actions ────────────────────────────────── */}
          <div className="flex items-center gap-2 ml-auto">

            {/* Search icon shortcut */}
            <Link
              href="/search"
              aria-label="Search properties"
              className={cn(
                "hidden sm:flex w-9 h-9 items-center justify-center rounded-lg transition-all",
                linkCls
              )}
            >
              <Search className="w-4 h-4" />
            </Link>

            {user ? (
              /* ── Profile dropdown ──────────────────────────── */
              <div ref={profileRef} className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className={cn(
                    "flex items-center gap-2 text-sm font-medium pl-2 pr-3 py-1.5 rounded-xl transition-all",
                    solid ? "text-ink hover:bg-surface-muted" : "text-white hover:bg-white/10"
                  )}
                >
                  {/* Avatar */}
                  <div className="w-7 h-7 rounded-full bg-brand-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:block">{user.name.split(" ")[0]}</span>
                  <ChevronDown
                    className={cn(
                      "w-3.5 h-3.5 transition-transform shrink-0",
                      profileOpen && "rotate-180",
                      solid ? "text-ink-faint" : "text-white/50"
                    )}
                  />
                </button>

                {/* Dropdown panel */}
                {profileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-card-hover border border-surface-border py-2 z-50 animate-fade-in">
                    <div className="px-4 py-3 border-b border-surface-border">
                      <p className="text-sm font-semibold text-ink">{user.name}</p>
                      <p className="text-xs text-ink-faint capitalize">{user.role} account</p>
                    </div>

                    <div className="py-1">
                      <Link
                        href="/dashboard"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-ink-muted hover:text-brand-600 hover:bg-brand-50 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4" /> Dashboard
                      </Link>
                      <Link
                        href="/dashboard/add-listing"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-ink-muted hover:text-brand-600 hover:bg-brand-50 transition-colors"
                      >
                        <PlusCircle className="w-4 h-4" /> Add Listing
                      </Link>
                    </div>

                    <div className="border-t border-surface-border pt-1">
                      <button
                        onClick={() => logout.mutate(undefined)}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* ── Auth buttons ────────────────────────────── */
              <>
                <Link
                  href="/auth/login"
                  className={cn(
                    "hidden sm:block text-sm font-medium px-4 py-2 rounded-lg transition-all",
                    linkCls
                  )}
                >
                  Log in
                </Link>
                <Link
                  href="/auth/register"
                  className={cn(
                    "text-sm font-semibold px-5 py-2.5 rounded-xl transition-all",
                    solid
                      ? "bg-brand-500 hover:bg-brand-600 text-white shadow-blue hover:shadow-blue-lg"
                      : "bg-white hover:bg-gray-50 text-ink shadow-sm"
                  )}
                >
                  List Property
                </Link>
              </>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={cn(
                "lg:hidden w-9 h-9 flex items-center justify-center rounded-lg transition-all",
                solid ? "text-ink-muted hover:bg-surface-muted" : "text-white hover:bg-white/10"
              )}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile drawer ──────────────────────────────────────── */}
      <div
        className={cn(
          "lg:hidden bg-white border-t border-surface-border overflow-hidden transition-all duration-250",
          mobileOpen ? "max-h-[600px]" : "max-h-0"
        )}
      >
        <div className="px-4 py-3 space-y-0.5">
          {NAV_LINKS.map(({ label, href, icon: Icon }) => (
            <Link
              key={label}
              href={href}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-ink-muted hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-colors"
            >
              <Icon className="w-4 h-4 text-ink-faint" /> {label}
            </Link>
          ))}
          <Link
            href="/search"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-ink-muted hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-colors"
          >
            <Search className="w-4 h-4 text-ink-faint" /> All Properties
          </Link>
        </div>

        <div className="px-4 pb-4 pt-2 border-t border-surface-border space-y-2">
          {user ? (
            <>
              <Link
                href="/dashboard"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 w-full bg-brand-500 hover:bg-brand-600 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors"
              >
                <LayoutDashboard className="w-4 h-4" /> Dashboard
              </Link>
              <button
                onClick={() => { logout.mutate(undefined); setMobileOpen(false); }}
                className="w-full border border-surface-border text-ink-muted font-semibold py-2.5 rounded-xl text-sm hover:bg-surface-muted transition-colors"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center w-full border border-surface-border text-ink font-semibold py-2.5 rounded-xl text-sm hover:bg-surface-muted transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/auth/register"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center w-full bg-brand-500 hover:bg-brand-600 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors"
              >
                List Property
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
