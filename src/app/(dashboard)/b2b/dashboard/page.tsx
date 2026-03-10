// src/app/(dashboard)/b2b/dashboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";
import { useB2B } from "@/hooks/api/useB2B";
import { PaymentStatus } from "@/types/auth.types";
import { PoolAnalyticsResponse } from "@/types/admin.types";
import {
  Settings,
  Key,
  Database,
  List,
  CreditCard,
  TrendingUp,
  Users,
  Zap,
  ArrowRight,
  AlertCircle,
  ShieldAlert,
  Loader2,
} from "lucide-react";

export default function B2BDashboardPage() {
  const { user, paymentStatus } = useAuthStore();
  const { getAnalytics, isLoading: isFetchingAnalytics } = useB2B();

  const [dashboardData, setDashboardData] = useState<PoolAnalyticsResponse["data"] | null>(null);

  // 🟢 Fetch unified analytics on load
  useEffect(() => {
    async function loadStats() {
      try {
        const data = await getAnalytics();
        setDashboardData(data);
      } catch (e) {
        console.error("Failed to load dashboard data", e);
      }
    }
    // Only fetch if they have active API keys / access (paid)
    if (user?.paymentStatus === PaymentStatus.PAID) {
      loadStats();
    }
  }, [getAnalytics, user?.paymentStatus]);

  // 🟢 NEW FLOW LOGIC: Check if API Keys exist via backend credentials
  const credentials = user?.clientCredentials;
  const hasAnyKey = credentials?.hasTestApiKey || credentials?.hasLiveApiKey;
  const isPending = user?.paymentStatus !== PaymentStatus.PAID;
  const showApiWarning = isPending || !hasAnyKey;

  // Derive stats dynamically from the backend response
  const stats = {
    totalSpins: dashboardData?.overallAnalytics.totalSpinsProcessed.toLocaleString() || "0",
    activeConfigs: dashboardData?.pools.length || 0,
    apiCalls24h: "-", // This tracking requires a dedicated API gateway Redis counter, omit for now
    successRate: dashboardData ? "100%" : "-",
  };

  const quickActions = [
    {
      title: "Gift Configuration",
      description: "Define reward probabilities",
      icon: Settings,
      href: "/b2b/configurations",
      color: "from-purple-500 to-pink-500",
      iconBg: "bg-purple-500/10",
      iconColor: "text-purple-400",
    },
    {
      title: "API & Developer",
      description: "API Keys & Integration",
      icon: Key,
      href: "/b2b/api-keys",
      color: "from-blue-500 to-cyan-500",
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-400",
    },
    {
      title: "Reward Pool",
      description: "Manage Prize Inventory",
      icon: Database,
      href: "/b2b/reward-pool",
      color: "from-emerald-500 to-teal-500",
      iconBg: "bg-emerald-500/10",
      iconColor: "text-emerald-400",
    },
    {
      title: "Transaction Logs",
      description: "Monitor Player Spins",
      icon: List,
      href: "/b2b/transactions",
      color: "from-orange-500 to-red-500",
      iconBg: "bg-orange-500/10",
      iconColor: "text-orange-400",
    },
    {
      title: "Billing Controls",
      description: "Usage & Billing Reports",
      icon: CreditCard,
      href: "/b2b/billing",
      color: "from-violet-500 to-purple-500",
      iconBg: "bg-violet-500/10",
      iconColor: "text-violet-400",
    },
    {
      title: "Wallet",
      description: "View & Upgrade Plans",
      icon: Zap,
      href: "/b2b/wallet",
      color: "from-amber-500 to-yellow-500",
      iconBg: "bg-amber-500/10",
      iconColor: "text-amber-400",
    },
  ];

  return (
    <div className="space-y-6 pb-10">
      {/* ─── Header ─── */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Client Dashboard
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Welcome back{user?.name ? `, ${user.name}` : ""}! Manage your
          gamification engine and monitor performance.
        </p>
      </div>

      {/* ─── Dynamic API Key Warning (New Flow) ─── */}
      {showApiWarning && (
        <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl p-4 flex items-start gap-3 shadow-sm">
          <ShieldAlert className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-amber-900 dark:text-amber-300">
              Developer Suite Not Activated
            </h3>
            <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
              You need to unlock your API access to generate your system
              credentials and webhooks. The engine will not accept spins until
              this is complete.
            </p>
          </div>
          <Link
            href="/b2b/api-keys"
            className="text-sm font-bold text-amber-700 dark:text-amber-300 hover:text-amber-800 dark:hover:text-amber-200 whitespace-nowrap bg-amber-100 dark:bg-amber-500/20 px-3 py-1.5 rounded-lg transition-colors"
          >
            Unlock Now →
          </Link>
        </div>
      )}

      {/* ─── Stats Grid ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-[#1a1025] border border-gray-200 dark:border-white/5 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Spins (24h)
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                {stats.totalSpins}
              </p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-purple-500/10 dark:bg-purple-500/20 flex items-center justify-center">
              <Zap className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-emerald-500 mr-1" />
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">
              12% from yesterday
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1a1025] border border-gray-200 dark:border-white/5 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Active Configurations
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                {stats.activeConfigs}
              </p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center">
              <Settings className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              2 pending review
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1a1025] border border-gray-200 dark:border-white/5 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                API Calls (24h)
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                {stats.apiCalls24h}
              </p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center">
              <Key className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Avg latency: 42ms
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1a1025] border border-gray-200 dark:border-white/5 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Success Rate
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                {stats.successRate}
              </p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-orange-500/10 dark:bg-orange-500/20 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
              Optimal Performance
            </span>
          </div>
        </div>
      </div>

      {/* ─── Quick Actions ─── */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.href}
                href={action.href}
                className="group bg-white dark:bg-[#1a1025] border border-gray-200 dark:border-white/5 rounded-2xl p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
              >
                <div className="flex items-start justify-between">
                  <div
                    className={`h-12 w-12 rounded-xl ${action.iconBg} flex items-center justify-center`}
                  >
                    <Icon className={`h-6 w-6 ${action.iconColor}`} />
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 dark:text-gray-600 group-hover:text-purple-500 dark:group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-5">
                  {action.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  {action.description}
                </p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ─── Recent Activity ─── */}
      <div className="bg-white dark:bg-[#1a1025] border border-gray-200 dark:border-white/5 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Recent Activity
          </h2>
          <Link
            href="/b2b/transactions"
            className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
          >
            View All →
          </Link>
        </div>
        <div className="space-y-2">
          {[
            {
              user: "user_12345",
              reward: "100 Coins",
              time: "2 mins ago",
              status: "success",
            },
            {
              user: "user_67890",
              reward: "Premium Badge",
              time: "5 mins ago",
              status: "success",
            },
            {
              user: "user_11223",
              reward: "50 Coins",
              time: "8 mins ago",
              status: "success",
            },
            {
              user: "user_44556",
              reward: "Free Spin",
              time: "12 mins ago",
              status: "success",
            },
          ].map((activity, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors border border-transparent dark:border-white/5"
            >
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-purple-500/10 dark:bg-purple-500/20 flex items-center justify-center">
                  <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {activity.user}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                    Won:{" "}
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                      {activity.reward}
                    </span>
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-400">
                  {activity.status}
                </span>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 font-medium">
                  {activity.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
