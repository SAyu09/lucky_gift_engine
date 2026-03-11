// src/app/(dashboard)/b2b/reward-pool/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useB2B } from "@/hooks/api/useB2B";
import { useAuthStore } from "@/store/useAuthStore";
import { PaymentStatus } from "@/types/auth.types";
import {
  Database,
  TrendingUp,
  Zap,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  Activity,
  BarChart3,
  Key,
  Lock,
  Gift,
} from "lucide-react";
import Link from "next/link";

// ─── Types (matches actual /api/client/analytics response) ────────────────────
interface Overall {
  totalPoolsGenerated: number;
  totalVolumeInPools: number;
  totalPayoutsFromPools: number;
}

interface StatusBreakdownItem {
  status: string;
  count: number;
}

interface GiftAnalyticsItem {
  giftId: number;
  name: string;
  totalPools: number;
  totalVolume: number;
  totalPayouts: number;
  statusBreakdown: StatusBreakdownItem[];
}

interface AnalyticsData {
  overall: Overall;
  statusBreakdown: StatusBreakdownItem[];
  giftAnalytics: GiftAnalyticsItem[];
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

  const [mode, setMode] = useState<"test" | "live">("test");

  const isPending = paymentStatus !== PaymentStatus.PAID;

  const hasApiKey =
    mode === "test"
      ? user?.clientCredentials?.hasTestApiKey
      : user?.clientCredentials?.hasLiveApiKey;

  const fetchAnalytics = useCallback(
    async (isRefresh = false) => {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setError(null);
      try {
        const result = await getAnalytics();
        // Support both { success, data: {...} } and direct {...} shapes
        const raw = result as { success?: boolean; data?: AnalyticsData } & AnalyticsData;
        const analytics: AnalyticsData = raw.data ?? (raw as unknown as AnalyticsData);
        setData(analytics);
        setLastRefreshed(new Date());
      } catch (err) {
        const e = err as { message?: string };
        setError(e.message ?? "Failed to load analytics");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [getAnalytics]
  );

  useEffect(() => {
    if (isPending) { setLoading(false); return; }
    if (hasApiKey) {
      fetchAnalytics();
    } else {
      setLoading(false);
    }
  }, [hasApiKey, fetchAnalytics, isPending, mode]);

  // ─── Preview / Locked ─────────────────────────────────────────────────
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

  // ─── No API Key ────────────────────────────────────────────────────────
  if (!hasApiKey && !loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-6">
        <div className="flex bg-gray-100 dark:bg-purple-950/40 p-1.5 rounded-xl border border-gray-200 dark:border-purple-500/20 mb-4">
          <button
            onClick={() => setMode("test")}
            className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${mode === "test" ? "bg-amber-500 text-white shadow-md" : "text-gray-500"}`}
          >
            Test Mode
          </button>
          <button
            onClick={() => setMode("live")}
            className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${mode === "live" ? "bg-emerald-500 text-white shadow-md" : "text-gray-500"}`}
          >
            Live Mode
          </button>
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

  // ─── Loading ───────────────────────────────────────────────────────────
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

  // ─── Error ─────────────────────────────────────────────────────────────
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

  const { overall, statusBreakdown, giftAnalytics } = data;

  const houseProfit = (overall.totalVolumeInPools ?? 0) - (overall.totalPayoutsFromPools ?? 0);
  const rtpPct =
    overall.totalVolumeInPools > 0
      ? (overall.totalPayoutsFromPools / overall.totalVolumeInPools) * 100
      : 0;

  return (
    <div className="space-y-6">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Reward Pool
          </h1>
          {lastRefreshed && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Updated {timeAgo(lastRefreshed.toISOString())}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-gray-100 dark:bg-purple-950/40 p-1.5 rounded-xl border border-gray-200 dark:border-purple-500/20">
            <button
              onClick={() => setMode("test")}
              className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${mode === "test" ? "bg-amber-500 text-white shadow-md" : "text-gray-500"}`}
            >
              Test
            </button>
            <button
              onClick={() => setMode("live")}
              className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${mode === "live" ? "bg-emerald-500 text-white shadow-md" : "text-gray-500"}`}
            >
              Live
            </button>
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

      {/* ── Overall Stats ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Database className="h-5 w-5 text-purple-500" />}
          label="Total Pools"
          value={fmt(overall.totalPoolsGenerated)}
          sub="Pools generated"
          accent="bg-purple-500/10 dark:bg-purple-500/20"
        />
        <StatCard
          icon={<DollarSign className="h-5 w-5 text-blue-500" />}
          label="Total Volume"
          value={fmtCurrency(overall.totalVolumeInPools)}
          sub="All pools combined"
          accent="bg-blue-500/10 dark:bg-blue-500/20"
        />
        <StatCard
          icon={<Zap className="h-5 w-5 text-emerald-500" />}
          label="Total Payouts"
          value={fmtCurrency(overall.totalPayoutsFromPools)}
          sub={`RTP: ${rtpPct.toFixed(2)}%`}
          accent="bg-emerald-500/10 dark:bg-emerald-500/20"
        />
        <StatCard
          icon={<TrendingUp className="h-5 w-5 text-amber-500" />}
          label="House Profit"
          value={fmtCurrency(houseProfit)}
          sub={`${(100 - rtpPct).toFixed(2)}% house edge`}
          accent="bg-amber-500/10 dark:bg-amber-500/20"
        />
      </div>

      {/* ── Status Breakdown ─────────────────────────────────────────────── */}
      {statusBreakdown && statusBreakdown.length > 0 && (
        <div className="bg-white dark:bg-[#1a1025] border border-gray-200 dark:border-white/10 rounded-xl p-6">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-purple-500" />
            Pool Status Breakdown
          </h2>
          <div className="flex flex-wrap gap-3">
            {statusBreakdown.map((s) => (
              <div
                key={s.status}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10"
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    s.status === "ACTIVE"
                      ? "bg-emerald-500"
                      : s.status === "COMPLETED"
                      ? "bg-blue-500"
                      : "bg-gray-400"
                  }`}
                />
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {s.count}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                  {s.status.toLowerCase()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Gift Analytics ───────────────────────────────────────────────── */}
      <div>
        <h2 className="text-base font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <Gift className="h-4 w-4 text-purple-500" />
          Gift Analytics ({giftAnalytics.length})
        </h2>

        <div className="space-y-4">
          {giftAnalytics.map((gift) => {
            const giftRtp =
              gift.totalVolume > 0
                ? (gift.totalPayouts / gift.totalVolume) * 100
                : 0;
            const giftProfit = gift.totalVolume - gift.totalPayouts;

            return (
              <div
                key={gift.giftId}
                className="bg-white dark:bg-[#1a1025] border border-gray-200 dark:border-white/10 rounded-xl p-5"
              >
                {/* Gift header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-purple-500/10 dark:bg-purple-500/20 flex items-center justify-center">
                      <Gift className="h-4 w-4 text-purple-500" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">
                        {gift.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Gift ID #{gift.giftId}
                      </p>
                    </div>
                  </div>

                  {/* Per-gift status pills */}
                  {gift.statusBreakdown && gift.statusBreakdown.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap">
                      {gift.statusBreakdown.map((s) => (
                        <span
                          key={s.status}
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                            s.status === "ACTIVE"
                              ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                              : s.status === "COMPLETED"
                              ? "bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400"
                              : "bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              s.status === "ACTIVE"
                                ? "bg-emerald-500"
                                : s.status === "COMPLETED"
                                ? "bg-blue-500"
                                : "bg-gray-400"
                            }`}
                          />
                          {s.count} {s.status.toLowerCase()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* RTP bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500 dark:text-gray-400">Payout RTP</span>
                    <span
                      className={`font-bold ${
                        giftRtp >= 80
                          ? "text-emerald-500"
                          : giftRtp >= 50
                          ? "text-amber-500"
                          : "text-red-500"
                      }`}
                    >
                      {giftRtp.toFixed(2)}%
                    </span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        giftRtp >= 80
                          ? "bg-emerald-500"
                          : giftRtp >= 50
                          ? "bg-amber-500"
                          : "bg-red-500"
                      }`}
                      style={{ width: `${Math.min(giftRtp, 100).toFixed(1)}%` }}
                    />
                  </div>
                </div>

                {/* Metrics grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    {
                      label: "Total Pools",
                      value: fmt(gift.totalPools),
                      icon: <Database className="h-3.5 w-3.5" />,
                    },
                    {
                      label: "Volume",
                      value: fmtCurrency(gift.totalVolume),
                      icon: <DollarSign className="h-3.5 w-3.5" />,
                    },
                    {
                      label: "Payouts",
                      value: fmtCurrency(gift.totalPayouts),
                      icon: <Zap className="h-3.5 w-3.5" />,
                    },
                    {
                      label: "House Profit",
                      value: fmtCurrency(giftProfit),
                      icon: <TrendingUp className="h-3.5 w-3.5" />,
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
            );
          })}

          {giftAnalytics.length === 0 && (
            <div className="bg-white dark:bg-[#1a1025] border border-gray-200 dark:border-white/10 rounded-xl p-12 text-center">
              <Activity className="h-10 w-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                No gift pool activity yet
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Create a gift configuration to start receiving spins.
              </p>
              <Link
                href="/b2b/configurations"
                className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-semibold transition-colors"
              >
                <CheckCircle className="h-4 w-4" />
                Manage Configurations
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}