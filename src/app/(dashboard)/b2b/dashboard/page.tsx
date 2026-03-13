// src/app/(dashboard)/b2b/dashboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";
import { useAuth } from "@/hooks/api/useAuth";
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
  Wallet,
  Coins,
  RotateCcw,
  Target,
  Activity,
  History,
  Download,
  Plus,
  ArrowUpRight,
  LayoutDashboard,
} from "lucide-react";

export default function B2BDashboardPage() {
  const { user } = useAuthStore();
  const { getAnalytics, isLoading: isFetchingAnalytics } = useB2B();

  const [dashboardData, setDashboardData] = useState<PoolAnalyticsResponse["data"] | null>(null);

  const { getMe } = useAuth();

  useEffect(() => {
    async function loadStats() {
      try {
        await getMe(); // Refresh user profile (includes walletBalance)
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
  }, [getAnalytics, getMe, user?.paymentStatus]);

  const balance = user?.walletBalance ?? 0;
  const isLowBalance = balance < 500;

  const stats = {
    totalSpins: dashboardData?.overallAnalytics?.totalSpinsProcessed?.toLocaleString() || "1,245",
    distributed: dashboardData?.overallAnalytics?.payoutBreakdown?.combinedTotal?.toLocaleString() || "8,430",
    clientProfit: dashboardData?.overallAnalytics?.totalClientProfit?.toLocaleString() || "742",
    totalCollected: dashboardData?.overallAnalytics?.totalCollectedAmount?.toLocaleString() || "37,100",
  };

  const quickActions = [
    {
      title: "Configure Reward Pool",
      description: "Define reward probabilities",
      icon: Settings,
      href: "/b2b/reward-pool",
      iconColor: "text-purple-400",
    },
    {
      title: "View Transactions",
      description: "Monitor Player Spins",
      icon: List,
      href: "/b2b/transactions",
      iconColor: "text-blue-400",
    },
    {
      title: "Add Wallet Funds",
      description: "Usage & Billing Reports",
      icon: CreditCard,
      href: "/b2b/wallet",
      iconColor: "text-emerald-400",
    },
    {
      title: "API & Dev Settings",
      description: "API Keys & Integration",
      icon: Key,
      href: "/b2b/api-keys",
      iconColor: "text-orange-400",
    },
  ];

  return (
    <div className="space-y-8 pb-10">
      {/* ─── Header ─── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            Client Dashboard
          </h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Overview of platform activity, reward pool performance, and wallet usage.
          </p>
        </div>
        <div className="flex items-center gap-3">
          
        </div>
      </div>

      {/* ─── Low Balance Warning ─── */}
      {isLowBalance && (
        <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-2xl p-4 flex items-center justify-between group animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-500/20 flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-500" />
            </div>
            <p className="text-red-700 dark:text-red-500 font-semibold">
              Low balance warning: Wallet is below ₹500
            </p>
          </div>
          <Link
            href="/b2b/wallet"
            className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-bold text-sm underline decoration-red-500/30 underline-offset-4 decoration-2 transition-all"
          >
            Top up now
          </Link>
        </div>
      )}

      {/* ─── Wallet Overview ─── */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Wallet className="h-5 w-5 text-orange-500" />
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Wallet Overview</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Wallet Balance */}
          <div className="bg-white dark:bg-[#1a1025]/60 backdrop-blur-xl border border-gray-200 dark:border-white/5 rounded-3xl p-6 relative overflow-hidden group shadow-sm dark:shadow-none">
            <div className="flex items-start justify-between relative z-10">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Wallet Balance</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">₹{balance.toLocaleString()}</span>
                </div>
                <div className="mt-4 flex items-center text-xs">
                  <TrendingUp className="h-3 w-3 text-emerald-600 dark:text-emerald-500 mr-1" />
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">+12% from last week</span>
                </div>
              </div>
              <Link href="/b2b/wallet" className="h-8 w-8 rounded-lg bg-gray-100 dark:bg-white/5 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-white/10 transition-colors">
                <Plus className="h-4 w-4 text-gray-600 dark:text-white" />
              </Link>
            </div>
            <div className="absolute -right-8 -bottom-8 h-32 w-32 bg-purple-600/5 dark:bg-purple-600/10 rounded-full blur-3xl group-hover:bg-purple-600/20 transition-all duration-700" />
          </div>

          {/* Coins Used Today */}
          <div className="bg-white dark:bg-[#1a1025]/60 backdrop-blur-xl border border-gray-200 dark:border-white/5 rounded-3xl p-6 relative overflow-hidden group shadow-sm dark:shadow-none">
            <div className="relative z-10">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Coins Used Today</p>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">₹2,100</span>
              </div>
              <div className="mt-6 h-1 w-full bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-red-500 to-pink-500 w-[65%]" />
              </div>
            </div>
          </div>

          {/* Last Recharge */}
          <div className="bg-white dark:bg-[#1a1025]/60 backdrop-blur-xl border border-gray-200 dark:border-white/5 rounded-3xl p-6 relative overflow-hidden group shadow-sm dark:shadow-none">
            <div className="relative z-10">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Recharge</p>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">₹10,000</span>
              </div>
              <div className="mt-4">
                <p className="text-xs text-gray-400 dark:text-gray-500 font-medium uppercase tracking-wider">Processed on Feb 24, 2026</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* ─── Game Activity ─── */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-orange-500" />
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Game Activity</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white dark:bg-[#1a1025]/60 backdrop-blur-md border border-gray-200 dark:border-white/5 rounded-2xl p-5 shadow-sm dark:shadow-none">
              <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 dark:text-gray-500">Total Spins</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.totalSpins}</p>
            </div>
            <div className="bg-white dark:bg-[#1a1025]/60 backdrop-blur-md border border-gray-200 dark:border-white/5 rounded-2xl p-5 shadow-sm dark:shadow-none">
              <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 dark:text-gray-500">Distributed</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">₹{stats.distributed}</p>
            </div>
            <div className="bg-white dark:bg-[#1a1025]/60 backdrop-blur-md border border-gray-200 dark:border-white/5 rounded-2xl p-5 shadow-sm dark:shadow-none">
              <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 dark:text-gray-500">Current RTP</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">95%</p>
            </div>
            <div className="bg-white dark:bg-[#1a1025]/60 backdrop-blur-md border border-gray-200 dark:border-white/5 rounded-2xl p-5 shadow-sm dark:shadow-none">
              <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 dark:text-gray-500">Active Players</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">320</p>
            </div>
          </div>
        </div>

        {/* ─── Reward Pool Status ─── */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center gap-2">
            <RotateCcw className="h-5 w-5 text-orange-500" />
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Reward Pool Status</h2>
          </div>
          <div className="bg-white dark:bg-[#1a1025]/60 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl p-8 relative overflow-hidden group h-full shadow-sm dark:shadow-none">
            <div className="flex items-start justify-between relative z-10 mb-8">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Reward Pool Balance</p>
                <p className="text-4xl font-bold text-gray-900 dark:text-white mt-2">₹{stats.totalCollected}</p>
              </div>
              <div className="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full text-xs font-bold border border-emerald-200 dark:border-emerald-500/20 flex items-center gap-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Healthy
              </div>
            </div>

            <div className="space-y-6 relative z-10">
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/5 pb-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Payouts</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white">₹36,358</p>
              </div>
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/5 pb-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">House Profit</p>
                <p className="text-sm font-bold text-pink-600 dark:text-pink-500">₹{stats.clientProfit}</p>
              </div>
              
              <div className="pt-2">
                <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 dark:text-gray-500 mb-4">Stability Score</p>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((step) => (
                    <div 
                      key={step} 
                      className={`h-1.5 flex-1 rounded-full ${step <= 4 ? "bg-emerald-500" : "bg-gray-100 dark:bg-white/10"}`} 
                    />
                  ))}
                </div>
              </div>
            </div>
            
            <div className="absolute right-0 top-0 h-full w-48 bg-gradient-to-l from-emerald-500/5 to-transparent pointer-events-none" />
          </div>
        </div>
      </div>

      {/* ─── Quick Actions ─── */}
      <section>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.href}
                href={action.href}
                className="group bg-white dark:bg-[#1a1025]/40 backdrop-blur-sm border border-gray-200 dark:border-white/5 rounded-3xl p-6 hover:bg-gray-50 dark:hover:bg-[#1a1025]/60 hover:border-gray-300 dark:hover:border-white/10 transition-all duration-300 shadow-sm dark:shadow-none"
              >
                <div className="h-12 w-12 rounded-2xl bg-gray-100 dark:bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Icon className={`h-6 w-6 ${action.iconColor}`} />
                </div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                  {action.title}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">
                  {action.description}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ─── Recent Activity (Simplified) ─── */}
      <div className="bg-white dark:bg-[#1a1025]/40 backdrop-blur-md border border-gray-200 dark:border-white/5 rounded-3xl p-8 shadow-sm dark:shadow-none">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Activity</h2>
          <Link
            href="/b2b/transactions"
            className="text-sm font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors flex items-center gap-1"
          >
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="space-y-4">
          {dashboardData?.recentActivity?.instantSpins?.slice(0, 4).map((activity: any, idx: number) => (
            <div
              key={idx}
              className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 hover:border-gray-200 dark:hover:border-white/10 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-500/10 flex items-center justify-center">
                  <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">user_{activity.userId}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">
                    Bet: <span className="text-gray-700 dark:text-gray-300">₹{activity.betAmount}</span>
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                  +₹{activity.winAmount}
                </p>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1 uppercase font-bold tracking-wider">
                  {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          )) || Array(4).fill(0).map((_, idx) => (
             <div key={idx} className="h-16 w-full animate-pulse bg-gray-100 dark:bg-white/5 rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
