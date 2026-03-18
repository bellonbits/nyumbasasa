"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/layout/Logo";
import {
  LayoutDashboard, Building2, PlusCircle, BarChart2,
  Settings, LogOut, Users, ClipboardList, MessageSquare,
  GitBranch, UserCheck, CheckSquare, Bell, ChevronRight, X, Menu, Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useMe, useLogout } from "@/hooks/useAuth";

const NAV_SECTIONS = [
  {
    label: null,
    items: [
      { icon: LayoutDashboard, label: "Overview",    href: "/dashboard"             },
      { icon: Building2,       label: "Properties",  href: "/dashboard/listings"    },
      { icon: PlusCircle,      label: "Add Listing", href: "/dashboard/add-listing" },
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
    label: "System",
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
      <div className="px-4 py-5 border-b border-surface-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-brand-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-blue">
            {user?.name?.charAt(0).toUpperCase() ?? "A"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-ink truncate">{user?.name ?? "Agent"}</p>
            <p className="text-xs text-ink-faint capitalize">{user?.role?.toLowerCase() ?? "agent"}</p>
          </div>
          {onClose ? (
            <button onClick={onClose} className="text-ink-faint hover:text-ink lg:hidden">
              <X className="w-5 h-5" />
            </button>
          ) : (
            <ChevronRight className="w-4 h-4 text-ink-faint flex-shrink-0" />
          )}
        </div>
      </div>

      {/* Search */}
      <div className="px-4 py-3 border-b border-surface-border">
        <div className="flex items-center gap-2 bg-surface-sage rounded-xl px-3 py-2.5">
          <Search className="w-3.5 h-3.5 text-ink-faint flex-shrink-0" />
          <input
            placeholder="Search client, property..."
            className="text-xs bg-transparent text-ink focus:outline-none flex-1 placeholder:text-ink-faint"
          />
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 overflow-y-auto space-y-5">
        {NAV_SECTIONS.map(({ label, items }) => (
          <div key={label ?? "main"}>
            {label && (
              <p className="text-[10px] font-bold text-ink-faint uppercase tracking-widest px-2 mb-2">{label}</p>
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
                      "flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-all",
                      active
                        ? "bg-brand-50 text-brand-700 font-semibold"
                        : "text-ink-muted hover:bg-surface-sage hover:text-ink"
                    )}
                  >
                    <Icon className={cn(
                      "w-4 h-4 flex-shrink-0",
                      active ? "text-brand-600" : "text-ink-faint"
                    )} />
                    {itemLabel}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Logo + logout */}
      <div className="border-t border-surface-border p-4 space-y-3">
        <Logo size="sm" />
        <button
          onClick={() => logout.mutate(undefined)}
          className="flex items-center gap-2 w-full text-sm text-ink-faint hover:text-red-500 transition-colors"
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
    <div className="flex min-h-screen bg-surface-sage">

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-[240px] bg-white border-r border-surface-border flex-shrink-0 sticky top-0 h-screen">
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
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
        <header className="bg-white border-b border-surface-border px-4 sm:px-6 py-3 flex items-center justify-between flex-shrink-0 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden w-9 h-9 rounded-xl border border-surface-border flex items-center justify-center text-ink-muted hover:text-ink hover:bg-surface-sage transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Country selector */}
            <div className="flex items-center gap-2 border border-surface-border rounded-full px-3 py-1.5 text-xs font-medium text-ink-muted cursor-pointer hover:border-ink-faint transition-colors">
              <span className="text-base">🇰🇪</span>
              <span className="hidden sm:inline">Kenya</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="relative w-9 h-9 rounded-full border border-surface-border flex items-center justify-center text-ink-faint hover:text-ink hover:bg-surface-sage transition-colors">
              <Bell className="w-4 h-4" />
              {/* Notification dot */}
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
