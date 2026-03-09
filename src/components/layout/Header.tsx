"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { useUIStore } from "@/store/useUIStore";
import { useAuth } from "@/hooks/api/useAuth";
import {
  Menu,
  LogOut,
  User as UserIcon,
  Loader2,
  Coins,
  Plus,
  Moon,
  Sun,
} from "lucide-react";

export function Header() {
  const { user } = useAuthStore();
  const { toggleSidebar, theme, toggleTheme } = useUIStore();
  const { logout } = useAuth();
  const router = useRouter();

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      router.push("/login");
    } catch {
      // Fallback in case of network error during logout
      router.push("/login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Determine if this user role should see the Billing/Wallet UI module
  const showBilling = user?.role === "B2B_CLIENT" || user?.role === "USER";

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-gray-200 dark:border-purple-500/10 bg-white/80 dark:bg-purple-950/30 backdrop-blur-md px-4 sm:px-6 shadow-sm transition-all duration-200">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="rounded-md p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-purple-500/10 hover:text-gray-700 dark:hover:text-purple-300 lg:hidden focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-purple-500 transition-colors"
          aria-label="Toggle Sidebar"
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Breadcrumb / Title area */}
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 hidden sm:flex items-center gap-2">
          Dashboard
          <span className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-purple-500/10 text-xs text-gray-500 dark:text-purple-300 font-medium">
            Verified
          </span>
        </h2>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {/* Payment / Billing Preparation */}
        {showBilling && (
          <div
            onClick={() => router.push("/b2b/wallet")}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200/50 rounded-full cursor-pointer hover:shadow-sm hover:-translate-y-0.5 transition-all group mr-2"
          >
            <Coins className="h-4 w-4 text-yellow-500 group-hover:animate-pulse" />
            <span className="text-sm font-bold text-yellow-700">54,320</span>
            <div className="w-px h-4 bg-yellow-200/60 mx-1"></div>
            <Plus className="h-4 w-4 text-yellow-600 hover:text-yellow-800" />
          </div>
        )}

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="rounded-lg p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-purple-500/10 hover:text-gray-700 dark:hover:text-purple-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-purple-500 transition-all"
          aria-label="Toggle Theme"
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </button>

        <div className="h-6 w-px bg-gray-200 dark:bg-purple-500/20 mx-1 sm:mx-2" />

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100 leading-tight">
              {user?.name || user?.email?.split("@")[0] || "User"}
            </span>
            <span className="text-[11px] font-semibold tracking-wide text-gray-400 dark:text-purple-300 uppercase">
              {user?.role?.replace("_", " ") || "Guest"}
            </span>
          </div>
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-purple-500/20 dark:to-purple-600/20 flex items-center justify-center text-blue-600 dark:text-purple-300 border border-blue-200 dark:border-purple-500/30 shadow-inner">
            <UserIcon className="h-5 w-5" />
          </div>
        </div>

        <div className="h-6 w-px bg-gray-200 dark:bg-purple-500/20 mx-1 sm:mx-2 hidden sm:block" />

        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-500 dark:focus:ring-red-400 transition-colors disabled:opacity-50"
        >
          {isLoggingOut ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <LogOut className="h-4 w-4" />
          )}
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}
