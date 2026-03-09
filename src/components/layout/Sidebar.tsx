// src/components/layout/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { useUIStore } from "@/store/useUIStore";
import { Role } from "@/types/auth.types";
import {
  Users,
  BarChart2,
  Key,
  List,
  Wallet,
  X,
  Database,
  Receipt,
  DollarSign,
  Shield,
  Sliders,
  Building2,
} from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();
  const { role } = useAuthStore();
  const { isSidebarOpen, setSidebarOpen } = useUIStore();

  // Define navigation based on roles
  const getNavLinks = () => {
    switch (role) {
      case Role.ADMIN:
        return [
          {
            name: "Dashboard",
            href: "/admin/dashboard",
            icon: BarChart2,
          },
          {
            name: "Clients (B2B)",
            href: "/admin/clients",
            icon: Building2,
          },
          {
            name: "Platform Users",
            href: "/admin/users",
            icon: Users,
          },
          {
            name: "Payment Controls",
            href: "/admin/payments",
            icon: DollarSign,
          },
          {
            name: "Set Global Rules",
            href: "/admin/global-rules",
            icon: Sliders,
          },
          {
            name: "Security & Logs",
            href: "/admin/security",
            icon: Shield,
          },
        ];
      case Role.B2B_CLIENT:
        return [
          {
            name: "Dashboard",
            href: "/b2b/dashboard",
            icon: BarChart2,
          },
          { name: "API & Developer", href: "/b2b/api-keys", icon: Key },
          { name: "Reward Pool", href: "/b2b/reward-pool", icon: Database },
          { name: "Transaction Logs", href: "/b2b/transactions", icon: List },
          { name: "Billing Controls", href: "/b2b/billing", icon: Receipt },
          { name: "Wallet", href: "/b2b/wallet", icon: Wallet },
        ];
      default:
        return [];
    }
  };

  const navLinks = getNavLinks();

  return (
    <>
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-900/50 dark:bg-black/70 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-white dark:bg-purple-950/30 border-r border-gray-200 dark:border-purple-500/10 backdrop-blur-xl transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between px-6 border-b border-gray-200 dark:border-purple-500/10">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-xl text-blue-600 dark:text-purple-400"
          >
            {/* Simple logo placeholder */}
            <div className="h-8 w-8 rounded-lg bg-blue-600 dark:bg-purple-600 flex items-center justify-center">
              <span className="text-white text-sm">LE</span>
            </div>
            Lucky Engine
          </Link>
          <button
            type="button"
            className="lg:hidden text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-purple-300"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex flex-col gap-1 px-4 py-4">
          <div className="text-xs font-semibold text-gray-400 dark:text-purple-300 uppercase tracking-wider mb-2 px-2">
            {role?.replace("_", " ")} MENU
          </div>

          <nav className="space-y-1">
            {navLinks.map((item) => {
              const isActive = pathname.startsWith(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-blue-50 dark:bg-purple-500/20 text-blue-700 dark:text-purple-300"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-purple-500/10 hover:text-gray-900 dark:hover:text-purple-200"
                  }`}
                  onClick={() => {
                    // Auto-close on mobile after clicking a link
                    if (window.innerWidth < 1024) {
                      setSidebarOpen(false);
                    }
                  }}
                >
                  <Icon
                    className={`h-5 w-5 ${isActive ? "text-blue-700 dark:text-purple-300" : "text-gray-400 dark:text-gray-500"}`}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}
