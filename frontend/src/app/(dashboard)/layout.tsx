"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/layout/Logo";
import {
  LayoutDashboard, Building2, PlusCircle, BarChart2,
  Settings, LogOut, Users, ClipboardList, MessageSquare,
  GitBranch, UserCheck, CheckSquare, Bell, ChevronRight, X, Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useMe, useLogout } from "@/hooks/useAuth";

const NAV_SECTIONS = [
  {
    label: null,
    items: [
      { icon: LayoutDashboard, label: "Overview",    href: "/dashboard"              },
      { icon: Building2,       label: "Properties",  href: "/dashboard/listings"     },
      { icon: PlusCircle,      label: "Add Listing", href: "/dashboard/add-listing"  },
    ],
  },
  {
    label: "CRM",
    items: [
      { icon: GitBranch,     label: "Deals",    href: "/dashboard/crm/deals"    },
      { icon: UserCheck,     label: "Leads",    href: "/dashboard/crm/leads"    },
      { icon: CheckSquare,   label: "Tasks",    href: "/dashboard/crm/tasks"    },
      { icon: Users,         label: "Contacts", href: "/dashboard/crm/contacts" },
      { icon: MessageSquare, label: "Messages", href: "/dashboard/crm/messages" },
    ],
  },
  {
    label: "Analytics",
    items: [
      { icon: BarChart2,     label: "Sales Analytics",   href: "/dashboard/analytics"        },
      { icon: Users,         label: "Agent Performance", href: "/dashboard/analytics/agents" },
      { icon: ClipboardList, label: "Conversion Funnel", href: "/dashboard/analytics/funnel" },
    ],
  },
  {
    label: "System Settings",
    items: [
      { icon: Settings, label: "Settings", href: "/dashboard/settings" },
    ],
  },
];

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const { data: user } = useMe();
  const logout = useLogout();

  const isActive = (href: string) =>
    pathname === href || (href !== "/dashboard" && pathname.startsWith(href));

  return (
    <div className="flex flex-col h-full">
      {/* User header */}
      <div className="px-4 py-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-brand-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {user?.name?.charAt(0).toUpperCase() ?? "A"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-gray-900 truncate">{user?.name ?? "Agent"}</p>
            <p className="text-xs text-gray-400 capitalize">{user?.role?.toLowerCase() ?? "agent"}</p>
          </div>
          {onClose ? (
            <button onClick={onClose} className="text-gray-400 hover:text-gray-700 lg:hidden">
              <X className="w-5 h-5" />
            </button>
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
          )}
        </div>
      </div>

      {/* Search */}
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
          <svg className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            placeholder="Search by client, phone or property ID"
            className="text-xs bg-transparent text-gray-600 focus:outline-none flex-1 placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 overflow-y-auto space-y-4">
        {NAV_SECTIONS.map(({ label, items }) => (
          <div key={label ?? "main"}>
            {label && (
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2 mb-1">{label}</p>
            )}
            <div className="space-y-0.5">
              {items.map(({ icon: Icon, label: itemLabel, href }) => {
                const active = isActive(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={onClose}
                    className={cn(
                      "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all",
                      active
                        ? "bg-gray-100 text-gray-900 font-semibold"
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                    )}
                  >
                    <Icon className={cn("w-4 h-4 flex-shrink-0", active ? "text-gray-700" : "text-gray-400")} />
                    {itemLabel}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Logo + logout */}
      <div className="border-t border-gray-100 p-4 space-y-3">
        <Logo size="sm" />
        <button
          onClick={() => logout.mutate(undefined)}
          className="flex items-center gap-2 w-full text-sm text-gray-400 hover:text-red-500 transition-colors"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 bg-white border-r border-gray-100 flex-shrink-0 sticky top-0 h-screen">
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 bg-white flex flex-col transition-transform duration-300 lg:hidden",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <SidebarContent onClose={() => setSidebarOpen(false)} />
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-100 px-4 sm:px-6 py-3 flex items-center justify-between flex-shrink-0 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            {/* Hamburger — mobile only */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden w-9 h-9 rounded-lg border border-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-800 hover:bg-gray-50 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Country selector */}
            <div className="flex items-center gap-2 border border-gray-200 rounded-full px-3 py-1.5 text-xs font-medium text-gray-600 cursor-pointer hover:border-gray-300 transition-colors">
              <span className="text-base">🇰🇪</span>
              <span className="hidden sm:inline">Kenya</span>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button className="relative w-9 h-9 rounded-full border border-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-700 transition-colors">
              <Bell className="w-4 h-4" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
