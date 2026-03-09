// src/app/(dashboard)/b2b/reward-pool/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useB2B } from "@/hooks/api/useB2B";
import { useAuthStore } from "@/store/useAuthStore";
import { PaymentStatus } from "@/types/auth.types";
import {
  Database,
  TrendingUp,
  TrendingDown,
  Zap,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Users,
  DollarSign,
  Activity,
  BarChart3,
  Clock,
  Key,
  Shield,
  Lock,
} from "lucide-react";
import Link from "next/link";

// ─── Types (matches exact /api/client/analytics response) ─────────────────────
interface PoolMetrics {
  totalEntries: number;
  completedMultiplayerRounds: number;
  totalCollected: number;
  totalInstantPayout: number;
  totalPoolPayout: number;
  totalCombinedPayout: number;
  houseProfit: number;
  globalReserveBalance: number;
}

interface Pool {
  giftId: number;
  name: string;
  status: "ACTIVE" | "INACTIVE";
  targetRtpPercent: number;
  actualRtpPercent: number;
  metrics: PoolMetrics;
}

interface InstantSpin {
  transactionId: string;
  userId: number;
  betAmount: number;
  winAmount: number;
  multiplier: number;
  timestamp: string;
}

interface OverallAnalytics {
  totalSpinsProcessed: number;
  totalMultiplayerPoolsCompleted: number;
  totalCollectedAmount: number;
  payoutBreakdown: {
    instantWins: number;
    poolWins: number;
    combinedTotal: number;
  };
  totalHouseProfit: number;
  actualGlobalRtp: number;
  totalRtpShieldInterventions: number;
}

interface AnalyticsData {
  client: { id: number; name: string; isActive: boolean };
  overallAnalytics: OverallAnalytics;
  pools: Pool[];
  recentActivity: {
    instantSpins: InstantSpin[];
    completedPools: unknown[];
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 }).format(n);

const fmtCurrency = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

const rtpColor = (actual: number, target: number) => {
  const pct = (actual / target) * 100;
  if (pct >= 80) return "text-emerald-500";
  if (pct >= 50) return "text-amber-500";
  return "text-red-500";
};

const rtpBarColor = (actual: number, target: number) => {
  const pct = (actual / target) * 100;
  if (pct >= 80) return "bg-emerald-500";
  if (pct >= 50) return "bg-amber-500";
  return "bg-red-500";
};

const timeAgo = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime();
  const s = Math.floor(diff / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({
  icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  accent: string;
}) {
  return (
    <div className="bg-white dark:bg-[#1a1025] border border-gray-200 dark:border-white/10 rounded-xl p-5 flex items-start gap-4">
      <div className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 ${accent}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          {label}
        </p>
        <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white truncate">
          {value}
        </p>
        {sub && (
          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{sub}</p>
        )}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function RewardPoolPage() {
  const { getAnalytics } = useB2B();
  const { paymentStatus, user } = useAuthStore();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);
  
  // 🟢 NEW: Read environment mode to allow switching context
  const [mode, setMode] = useState<'test' | 'live'>('test');

  const isPending = paymentStatus !== PaymentStatus.PAID;
  
  // 🟢 FIXED: Use backend credentials instead of local storage
  const hasApiKey = mode === 'test' 
    ? user?.clientCredentials?.hasTestApiKey 
    : user?.clientCredentials?.hasLiveApiKey;

  const fetchAnalytics = useCallback(
    async (isRefresh = false) => {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setError(null);
      try {
        // If your backend eventually supports filtering by mode, pass mode here:
        // const result = await getAnalytics(mode);
        const result = await getAnalytics(); 
        setData(result as unknown as AnalyticsData);
        setLastRefreshed(new Date());
      } catch (err) {
        const e = err as { message?: string };
        setError(e.message ?? "Failed to load analytics");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [getAnalytics /*, mode*/]
  );

  useEffect(() => {
    if (isPending) { setLoading(false); return; }
    
    // Only fetch if the user has unlocked the key for this mode
    if (hasApiKey) {
      fetchAnalytics();
    } else {
      setLoading(false);
    }
  }, [hasApiKey, fetchAnalytics, isPending, mode]);

  // ─── Preview / Locked (payment pending) ───────────────────
  if (isPending) {
    return (
      <div className="space-y-6">
        <div className="rounded-xl border border-amber-200 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/10 px-5 py-4 flex items-center gap-4">
          <Lock className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
              Preview Mode — Reward Pool is locked
            </p>
            <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
              Unlock API access to view real-time pool analytics and engine activity.
            </p>
          </div>
          <Link
            href="/b2b/api-keys"
            className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            Unlock Access
          </Link>
        </div>

        {/* Blurred placeholder analytics */}
        <div className="blur-sm opacity-40 pointer-events-none select-none space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-[#1a1025] border border-gray-200 dark:border-white/10 rounded-xl p-5 flex items-start gap-4">
                <div className="h-11 w-11 rounded-xl bg-purple-500/10" />
                <div className="space-y-2 flex-1">
                  <div className="h-3 w-20 bg-gray-200 dark:bg-white/20 rounded" />
                  <div className="h-7 w-24 bg-gray-300 dark:bg-white/30 rounded" />
                </div>
              </div>
            ))}
          </div>
          <div className="h-48 bg-white dark:bg-[#1a1025] border border-gray-200 dark:border-white/10 rounded-xl" />
        </div>
      </div>
    );
  }

  // ─── No API Key Generated Yet ───────────────────────────────────────
  if (!hasApiKey && !loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-6">
        {/* Toggle still visible so they can check other environments */}
        <div className="flex bg-gray-100 dark:bg-purple-950/40 p-1.5 rounded-xl border border-gray-200 dark:border-purple-500/20 mb-4">
          <button onClick={() => setMode('test')} className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${mode === 'test' ? 'bg-amber-500 text-white shadow-md' : 'text-gray-500'}`}>Test Mode</button>
          <button onClick={() => setMode('live')} className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${mode === 'live' ? 'bg-emerald-500 text-white shadow-md' : 'text-gray-500'}`}>Live Mode</button>
        </div>

        <div className="h-16 w-16 rounded-2xl bg-amber-500/10 flex items-center justify-center">
          <Key className="h-8 w-8 text-amber-500" />
        </div>
        <div className="text-center max-w-md">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">System Key Pending</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Your {mode} environment API Key hasn&apos;t been generated by the system yet.
          </p>
        </div>
        <Link
          href="/b2b/api-keys"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-semibold transition-colors"
        >
          <Key className="h-4 w-4" /> Go to Developer Suite
        </Link>
      </div>
    );
  }

  // ─── Loading ─────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 w-48 bg-gray-200 dark:bg-white/10 rounded-lg" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-gray-200 dark:bg-white/10 rounded-xl" />
          ))}
        </div>
        <div className="h-64 bg-gray-200 dark:bg-white/10 rounded-xl" />
      </div>
    );
  }

  // ─── Error ───────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <AlertTriangle className="h-10 w-10 text-red-500" />
        <p className="text-gray-700 dark:text-gray-300 font-medium">{error}</p>
        <button
          type="button"
          onClick={() => fetchAnalytics()}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-semibold transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!data) return null;

  const { client, overallAnalytics: oa, pools, recentActivity } = data;
  const rtpDelta = oa.actualGlobalRtp - 95; // vs 95% target

  return (
    <div className="space-y-6">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Reward Pool
            </h1>
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                client.isActive
                  ? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400"
                  : "bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-400"
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${client.isActive ? "bg-emerald-500 animate-pulse" : "bg-red-500"}`} />
              {client.isActive ? "Active" : "Inactive"}
            </span>
          </div>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {client.name} &bull; Client #{client.id}
            {lastRefreshed && (
              <span className="ml-2 text-xs">
                &bull; Updated {timeAgo(lastRefreshed.toISOString())}
              </span>
            )}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex bg-gray-100 dark:bg-purple-950/40 p-1.5 rounded-xl border border-gray-200 dark:border-purple-500/20">
            <button onClick={() => setMode('test')} className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${mode === 'test' ? 'bg-amber-500 text-white shadow-md' : 'text-gray-500'}`}>Test</button>
            <button onClick={() => setMode('live')} className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${mode === 'live' ? 'bg-emerald-500 text-white shadow-md' : 'text-gray-500'}`}>Live</button>
          </div>
          
          <button
            type="button"
            onClick={() => fetchAnalytics(true)}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* ── RTP Shield Warning ───────────────────────────────────────────── */}
      {oa.totalRtpShieldInterventions > 0 && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20">
          <Shield className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
              RTP Shield Triggered {oa.totalRtpShieldInterventions} time{oa.totalRtpShieldInterventions > 1 ? "s" : ""}
            </p>
            <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
              The engine downgraded payout(s) to prevent reserve bankruptcy. Actual RTP ({oa.actualGlobalRtp.toFixed(2)}%) is below target (95%). Consider topping up reserve or reviewing probability tables.
            </p>
          </div>
        </div>
      )}

      {/* ── Overall Stats ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Zap className="h-5 w-5 text-purple-500" />}
          label="Total Spins"
          value={fmt(oa.totalSpinsProcessed)}
          sub={`${pools.length} active gift${pools.length !== 1 ? "s" : ""}`}
          accent="bg-purple-500/10 dark:bg-purple-500/20"
        />
        <StatCard
          icon={<DollarSign className="h-5 w-5 text-blue-500" />}
          label="Total Collected"
          value={fmtCurrency(oa.totalCollectedAmount)}
          sub="All pools combined"
          accent="bg-blue-500/10 dark:bg-blue-500/20"
        />
        <StatCard
          icon={<TrendingUp className="h-5 w-5 text-emerald-500" />}
          label="House Profit"
          value={fmtCurrency(oa.totalHouseProfit)}
          sub={`${(100 - oa.actualGlobalRtp).toFixed(2)}% house edge`}
          accent="bg-emerald-500/10 dark:bg-emerald-500/20"
        />
        <StatCard
          icon={
            rtpDelta >= 0 ? (
              <TrendingUp className="h-5 w-5 text-emerald-500" />
            ) : (
              <TrendingDown className="h-5 w-5 text-red-500" />
            )
          }
          label="Actual Global RTP"
          value={`${oa.actualGlobalRtp.toFixed(2)}%`}
          sub={`Target: 95% (${rtpDelta >= 0 ? "+" : ""}${rtpDelta.toFixed(2)}%)`}
          accent={
            rtpDelta >= -10
              ? "bg-emerald-500/10 dark:bg-emerald-500/20"
              : "bg-red-500/10 dark:bg-red-500/20"
          }
        />
      </div>

      {/* ── Payout Breakdown ─────────────────────────────────────────────── */}
      <div className="bg-white dark:bg-[#1a1025] border border-gray-200 dark:border-white/10 rounded-xl p-6">
        <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-purple-500" />
          Payout Breakdown
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {
              label: "Instant Wins",
              value: oa.payoutBreakdown.instantWins,
              color: "bg-purple-500",
              pct: oa.totalCollectedAmount > 0
                ? (oa.payoutBreakdown.instantWins / oa.totalCollectedAmount) * 100
                : 0,
            },
            {
              label: "Pool Wins",
              value: oa.payoutBreakdown.poolWins,
              color: "bg-blue-500",
              pct: oa.totalCollectedAmount > 0
                ? (oa.payoutBreakdown.poolWins / oa.totalCollectedAmount) * 100
                : 0,
            },
            {
              label: "Total Payout",
              value: oa.payoutBreakdown.combinedTotal,
              color: "bg-emerald-500",
              pct: oa.totalCollectedAmount > 0
                ? (oa.payoutBreakdown.combinedTotal / oa.totalCollectedAmount) * 100
                : 0,
            },
          ].map((item) => (
            <div key={item.label}>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-gray-600 dark:text-gray-400 font-medium">{item.label}</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {fmtCurrency(item.value)}
                </span>
              </div>
              <div className="h-2 w-full bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${item.color}`}
                  style={{ width: `${Math.min(item.pct, 100).toFixed(1)}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {item.pct.toFixed(1)}% of collected
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Per-Pool Breakdown ───────────────────────────────────────────── */}
      <div>
        <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <Database className="h-4 w-4 text-purple-500" />
          Gift Pools ({pools.length})
        </h2>
        <div className="space-y-4">
          {pools.map((pool) => (
            <div
              key={pool.giftId}
              className="bg-white dark:bg-[#1a1025] border border-gray-200 dark:border-white/10 rounded-xl p-5"
            >
              {/* Pool header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-purple-500/10 dark:bg-purple-500/20 flex items-center justify-center">
                    <Database className="h-4 w-4 text-purple-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">
                      {pool.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Gift ID #{pool.giftId}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                      pool.status === "ACTIVE"
                        ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                        : "bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${pool.status === "ACTIVE" ? "bg-emerald-500" : "bg-gray-400"}`} />
                    {pool.status}
                  </span>
                  <span className="text-xs font-mono text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-white/10 px-2 py-0.5 rounded-full">
                    Target RTP: {pool.targetRtpPercent}%
                  </span>
                </div>
              </div>

              {/* RTP bar */}
              <div className="mb-4">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-500 dark:text-gray-400">Actual RTP</span>
                  <span className={`font-bold ${rtpColor(pool.actualRtpPercent, pool.targetRtpPercent)}`}>
                    {pool.actualRtpPercent.toFixed(2)}%
                    <span className="ml-1 text-gray-400 font-normal">
                      / {pool.targetRtpPercent}% target
                    </span>
                  </span>
                </div>
                <div className="h-2 w-full bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${rtpBarColor(pool.actualRtpPercent, pool.targetRtpPercent)}`}
                    style={{
                      width: `${Math.min((pool.actualRtpPercent / pool.targetRtpPercent) * 100, 100).toFixed(1)}%`,
                    }}
                  />
                </div>
              </div>

              {/* Metrics grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  {
                    label: "Total Entries",
                    value: fmt(pool.metrics.totalEntries),
                    icon: <Users className="h-3.5 w-3.5" />,
                  },
                  {
                    label: "Collected",
                    value: fmtCurrency(pool.metrics.totalCollected),
                    icon: <DollarSign className="h-3.5 w-3.5" />,
                  },
                  {
                    label: "Instant Payouts",
                    value: fmtCurrency(pool.metrics.totalInstantPayout),
                    icon: <Zap className="h-3.5 w-3.5" />,
                  },
                  {
                    label: "House Profit",
                    value: fmtCurrency(pool.metrics.houseProfit),
                    icon: <TrendingUp className="h-3.5 w-3.5" />,
                  },
                  {
                    label: "Pool Payouts",
                    value: fmtCurrency(pool.metrics.totalPoolPayout),
                    icon: <Activity className="h-3.5 w-3.5" />,
                  },
                  {
                    label: "Completed Rounds",
                    value: fmt(pool.metrics.completedMultiplayerRounds),
                    icon: <CheckCircle className="h-3.5 w-3.5" />,
                  },
                  {
                    label: "Combined Payout",
                    value: fmtCurrency(pool.metrics.totalCombinedPayout),
                    icon: <DollarSign className="h-3.5 w-3.5" />,
                  },
                  {
                    label: "Reserve Balance",
                    value: fmtCurrency(pool.metrics.globalReserveBalance),
                    icon: <Database className="h-3.5 w-3.5" />,
                  },
                ].map((m) => (
                  <div
                    key={m.label}
                    className="bg-gray-50 dark:bg-white/5 rounded-lg p-3"
                  >
                    <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 mb-1">
                      {m.icon}
                      <span className="text-xs">{m.label}</span>
                    </div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                      {m.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {pools.length === 0 && (
            <div className="bg-white dark:bg-[#1a1025] border border-gray-200 dark:border-white/10 rounded-xl p-12 text-center">
              <Database className="h-10 w-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-sm font-medium text-gray-900 dark:text-white">No active gift pools</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Create a gift configuration to start receiving spins.
              </p>
              <Link
                href="/b2b/configurations"
                className="inline-flex mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-semibold transition-colors"
              >
                Manage Configurations
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* ── Recent Spin Activity ─────────────────────────────────────────── */}
      <div className="bg-white dark:bg-[#1a1025] border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-white/10 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Clock className="h-4 w-4 text-purple-500" />
            Recent Spin Activity
          </h2>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Last {recentActivity.instantSpins.length} transactions
          </span>
        </div>

        {recentActivity.instantSpins.length === 0 ? (
          <div className="p-12 text-center text-gray-500 dark:text-gray-400 text-sm">
            No recent activity yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100 dark:divide-white/10">
              <thead className="bg-gray-50 dark:bg-[#1f132b]">
                <tr>
                  {["Transaction ID", "User ID", "Bet", "Win", "Multiplier", "Result", "Time"].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-white/5">
                {recentActivity.instantSpins.map((spin) => {
                  const won = spin.winAmount > 0;
                  return (
                    <tr
                      key={spin.transactionId}
                      className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <code className="text-xs font-mono text-gray-500 dark:text-gray-400">
                          {spin.transactionId.slice(0, 20)}…
                        </code>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                        #{spin.userId}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                        {fmtCurrency(spin.betAmount)}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium">
                        <span className={won ? "text-emerald-600 dark:text-emerald-400" : "text-gray-400 dark:text-gray-500"}>
                          {won ? fmtCurrency(spin.winAmount) : "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">
                        {spin.multiplier > 0 ? `${spin.multiplier}×` : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                            won
                              ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                              : "bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400"
                          }`}
                        >
                          {won ? <CheckCircle className="h-3 w-3" /> : null}
                          {won ? "Win" : "Loss"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                        {timeAgo(spin.timestamp)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Multiplayer Pools (completed) ──────────────────────────────── */}
      {recentActivity.completedPools.length > 0 && (
        <div className="bg-white dark:bg-[#1a1025] border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-white/10">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Activity className="h-4 w-4 text-blue-500" />
              Completed Multiplayer Rounds ({recentActivity.completedPools.length})
            </h2>
          </div>
          <div className="p-6 text-sm text-gray-600 dark:text-gray-400">
            {recentActivity.completedPools.length} round(s) completed.
          </div>
        </div>
      )}
    </div>
  );
}