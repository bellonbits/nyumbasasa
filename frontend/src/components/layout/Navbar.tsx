"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Menu, X, PlusCircle, LogOut, LayoutDashboard, BedDouble, Building, Home, Building2, Warehouse } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMe, useLogout } from "@/hooks/useAuth";
import Logo from "./Logo";

const NAV_LINKS = [
  { label: "Bedsitter",   href: "/search?houseType=bedsitter",    icon: BedDouble  },
  { label: "Studio",      href: "/search?houseType=studio",        icon: Building   },
  { label: "1 Bedroom",   href: "/search?houseType=one_bedroom",   icon: Home       },
  { label: "2 Bedrooms",  href: "/search?houseType=two_bedroom",   icon: Building2  },
  { label: "3 Bedrooms",  href: "/search?houseType=three_bedroom", icon: Warehouse  },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const { data: user } = useMe();
  const logout = useLogout();
  const router = useRouter();

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node))
        setProfileOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 gap-6">

          {/* Logo */}
          <Logo size="md" />

          {/* Nav links */}
          <div className="hidden lg:flex items-center gap-1 flex-1">
            {NAV_LINKS.map(({ label, href }) => (
              <Link key={label} href={href}
                className="text-sm text-gray-500 hover:text-gray-900 font-medium px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap">
                {label}
              </Link>
            ))}
            <span className="text-gray-200 mx-1">·</span>
            <Link href="/search" className="text-sm text-gray-500 hover:text-gray-900 font-medium px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
              All Properties
            </Link>
          </div>

          {/* Right */}
          <div className="flex items-center gap-3 ml-auto">
            {user ? (
              <div ref={profileRef} className="relative">
                <button onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-7 h-7 rounded-full bg-brand-500 flex items-center justify-center text-white text-xs font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:block">{user.name.split(" ")[0]}</span>
                  <ChevronDown className={cn("w-3.5 h-3.5 text-gray-400 transition-transform", profileOpen && "rotate-180")} />
                </button>
                {profileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                    <div className="px-4 py-2.5 border-b border-gray-100 mb-1">
                      <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-400 capitalize">{user.role} account</p>
                    </div>
                    <Link href="/dashboard" onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-brand-500 transition-colors">
                      <LayoutDashboard className="w-4 h-4 text-gray-400" /> Dashboard
                    </Link>
                    <Link href="/dashboard/add-listing" onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-brand-500 transition-colors">
                      <PlusCircle className="w-4 h-4 text-gray-400" /> Add Listing
                    </Link>
                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <button onClick={() => logout.mutate(undefined)}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/auth/login" className="hidden sm:block text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                  Log in
                </Link>
                <Link href="/auth/register"
                  className="text-sm font-semibold bg-gray-900 hover:bg-gray-700 text-white px-5 py-2.5 rounded-full transition-colors">
                  List Property
                </Link>
              </>
            )}
            <button onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile */}
      <div className={cn("lg:hidden bg-white border-t border-gray-100 overflow-hidden transition-all duration-200",
        mobileOpen ? "max-h-screen" : "max-h-0")}>
        <div className="px-4 py-3 space-y-1">
          {NAV_LINKS.map(({ label, href, icon: Icon }) => (
            <Link key={label} href={href} onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
              <Icon className="w-4 h-4 text-gray-400" /> {label}
            </Link>
          ))}
          <div className="pt-3 border-t border-gray-100 space-y-2 pb-3">
            {user ? (
              <>
                <Link href="/dashboard" onClick={() => setMobileOpen(false)}
                  className="block text-center bg-gray-900 text-white font-semibold py-2.5 rounded-xl text-sm">
                  Dashboard
                </Link>
                <button onClick={() => logout.mutate(undefined)}
                  className="w-full text-center border border-gray-200 text-gray-700 font-semibold py-2.5 rounded-xl text-sm">
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" onClick={() => setMobileOpen(false)}
                  className="block text-center border border-gray-200 text-gray-700 font-semibold py-2.5 rounded-xl text-sm">
                  Log in
                </Link>
                <Link href="/auth/register" onClick={() => setMobileOpen(false)}
                  className="block text-center bg-gray-900 text-white font-semibold py-2.5 rounded-xl text-sm">
                  List Property
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
