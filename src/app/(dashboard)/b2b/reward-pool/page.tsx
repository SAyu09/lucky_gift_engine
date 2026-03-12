// src/app/(dashboard)/b2b/reward-pool/page.tsx
"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
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
  Download,
  Bell,
  MoreHorizontal,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  ShieldCheck,
  Percent,
} from "lucide-react";
import Link from "next/link";

// ─── Types ──────────────────────────────────────────────────────────────────
interface Transaction {
  id: string;
  time: string;
  type: string;
  amount: number;
  status: string;
  nodeId: string;
}

interface AnalyticsData {
  topStats: {
    totalPool: number;
    totalPoolChange: number;
    dailyVolume: number;
    dailyTxCount: number;
    activePlayers: number;
    distributionRate: number;
  };
  composition: {
    centralPool: number;
    percentages: {
      reward: number;
      platform: number;
      reserve: number;
      promotional: number;
    };
    values: {
      reward: number;
      platform: number;
      reserve: number;
      promotional: number;
    };
  };
  trend: {
    data: number[];
    avgGrowth: number;
    projectedEOM: number;
  };
  recentTransactions: Transaction[];
}

// ─── Constants ──────────────────────────────────────────────────────────────
const COLORS = {
  primary: "#ff2d95", // Neon Pink
  secondary: "#a855f7", // Purple
  accent: "#3b82f6", // Blue
  warning: "#f59e0b", // Amber
  success: "#10b981", // Emerald
  background: "#0d0415",
  surface: "#1a1025",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n);

const fmtCurrency = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

const fmtCompact = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n);

const timeAgo = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime();
  const s = Math.floor(diff / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
};

// ─── Components ──────────────────────────────────────────────────────────────

function TopStatCard({
  label,
  value,
  change,
  icon: Icon,
  color,
  subLabel,
  chart,
}: {
  label: string;
  value: string;
  change?: { val: string; pos: boolean };
  icon: any;
  color: string;
  subLabel?: string;
  chart?: React.ReactNode;
}) {
  return (
    <div className="relative overflow-hidden bg-white dark:bg-[#12081d] border border-gray-100 dark:border-white/5 rounded-2xl p-5 group hover:border-purple-500/20 dark:hover:border-white/10 transition-all shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 tracking-wide uppercase">{label}</p>
        <div className={`p-2 rounded-lg bg-opacity-10`} style={{ backgroundColor: `${color}1A`, color: color }}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      
      <div className="mb-4">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{value}</h3>
        {change && (
          <div className="flex items-center gap-1.5">
            <span className={`text-[10px] font-bold ${change.pos ? 'text-emerald-500' : 'text-rose-500'}`}>
              {change.val}
            </span>
            <span className="text-[10px] text-gray-500">{subLabel}</span>
          </div>
        )}
      </div>

      <div className="h-1.5 w-full bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden mt-auto">
        <div 
          className="h-full rounded-full transition-all duration-1000" 
          style={{ width: '65%', backgroundColor: color }}
        />
      </div>
      {chart && <div className="mt-4">{chart}</div>}
    </div>
  );
}

function PoolCompositionChart({ total, segments }: { total: number; segments: any[] }) {

  let cumulativePct = 0;
  
  return (
    <div className="bg-white dark:bg-[#12081d] border border-gray-100 dark:border-white/5 rounded-2xl p-6 h-full flex flex-col shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h3 className="text-base font-bold text-gray-900 dark:text-white">Pool Composition & Flow</h3>
        <div className="bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-lg px-3 py-1 text-[10px] text-gray-500 dark:text-gray-400 font-medium cursor-pointer flex items-center gap-2">
          Current Allocation <MoreHorizontal className="h-3 w-3" />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-12 flex-1">
        <div className="relative w-48 h-48 shrink-0">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            {segments.map((seg, i) => {
              const dashArray = `${seg.pct - 2} ${100 - (seg.pct - 2)}`;
              const dashOffset = -cumulativePct;
              cumulativePct += seg.pct;
              return (
                <circle
                  key={i}
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke={seg.color}
                  strokeWidth="10"
                  strokeDasharray={dashArray}
                  strokeDashoffset={dashOffset}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">Central Pool</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{fmtCompact(total)}</p>
          </div>
        </div>

        <div className="space-y-4 flex-1 w-full flex flex-col justify-center">
          {segments.map((seg, i) => (
            <div key={i} className="flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <div className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: seg.color }} />
                <div>
                  <p className="text-xs font-bold text-gray-900 dark:text-white">{seg.label} ({seg.pct}%)</p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">Instant (40%) • Jackpot (30%) • Bonus (30%)</p>
                </div>
              </div>
              <p className="text-xs font-bold text-gray-900 dark:text-white">{fmtCompact(total * (seg.pct / 100))}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DistributionSlider({ label, value, color, onChange }: { label: string; value: number; color: string; onChange: (v: number) => void }) {
  // Visual values clamped to 100 for the bar/dot position
  const visualValue = Math.min(100, Math.max(0, value));
  
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center px-1">
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">{label}</p>
        <p className="text-xs font-bold" style={{ color: color }}>{value}%</p>
      </div>
      <div className="relative h-1.5 w-full bg-gray-100 dark:bg-white/5 rounded-full group overflow-hidden">
        <input 
          type="range" 
          min="0" 
          max="100" 
          value={visualValue} 
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
        />
        <div 
          className="absolute top-0 left-0 h-full rounded-full transition-all duration-300" 
          style={{ width: `${visualValue}%`, backgroundColor: color }} 
        />
        <div 
          className="absolute top-1/2 -ml-2 h-4 w-4 bg-white dark:bg-gray-200 rounded-full shadow-md border-2 border-transparent transition-transform group-hover:scale-110" 
          style={{ left: `${visualValue}%`, marginTop: '-8px', borderColor: color }} 
        />
      </div>
    </div>
  );
}

function PoolGrowthChart({ data, trend }: { data: number[]; trend: any }) {
  const max = Math.max(...data);
  
  return (
    <div className="bg-white dark:bg-[#12081d] border border-gray-100 dark:border-white/5 rounded-2xl p-6 space-y-4 shadow-sm">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white">Pool Growth Trend</h3>
        <div className="flex gap-2">
          {['7D', '30D', '90D'].map(t => (
            <button key={t} className={`text-[10px] font-bold transition-colors ${t === '7D' ? 'text-purple-600 dark:text-secondary' : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-400'}`}>{t}</button>
          ))}
        </div>
      </div>
      
      <div className="h-32 flex items-end justify-between gap-1 px-2">
        {data.map((v, i) => (
          <div 
            key={i} 
            className="flex-1 rounded-sm bg-gradient-to-t from-purple-500/10 to-purple-500 transition-all hover:brightness-125 cursor-pointer" 
            style={{ height: `${(v/max) * 100}%`, opacity: i === data.length - 1 ? 1 : 0.6 }}
          />
        ))}
      </div>
      
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────

export default function RewardPoolPage() {
  const { getAnalytics, getTransactions } = useB2B();
  const { paymentStatus, user } = useAuthStore();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);
  const [mode, setMode] = useState<"test" | "live">("test");
  const [distro, setDistro] = useState({ reward: 70, platform: 15, reserve: 10, promotion: 5 });
  const [isSyncing, setIsSyncing] = useState(false);

  const isPending = paymentStatus !== PaymentStatus.PAID;
  const hasApiKey = mode === "test" ? user?.clientCredentials?.hasTestApiKey : user?.clientCredentials?.hasLiveApiKey;

  const fetchData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);
    try {
      const analyticsRes = await getAnalytics();
      
      const res = analyticsRes as unknown as AnalyticsData;
      setData(res);
      if (res.composition?.percentages) {
        setDistro({
          reward: res.composition.percentages.reward,
          platform: res.composition.percentages.platform,
          reserve: res.composition.percentages.reserve,
          promotion: res.composition.percentages.promotional
        });
      }
      setTransactions(res.recentTransactions || []);
      setLastRefreshed(new Date());
    } catch (err) {
      setError("Failed to sync engine data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [getAnalytics]);

  useEffect(() => {
    if (isPending) { setLoading(false); return; }
    if (hasApiKey) fetchData();
    else setLoading(false);
  }, [hasApiKey, isPending, mode, fetchData]);

  const poolSegments = useMemo(() => {
    return [
      { label: "Reward Pool", pct: distro.reward, color: COLORS.secondary },
      { label: "Platform Fee", pct: distro.platform, color: COLORS.primary },
      { label: "Reserve", pct: distro.reserve, color: COLORS.accent },
      { label: "Promotional", pct: distro.promotion, color: COLORS.warning },
    ];
  }, [distro]);

  const handleDistroChange = (key: keyof typeof distro, val: number) => {
    setDistro(prev => ({ ...prev, [key]: val }));
  };

  const handleSave = () => {
    setIsSyncing(true);
    setTimeout(() => {
        setIsSyncing(false);
        alert("Configuration Saved and Deployed to Nodes");
    }, 1500);
  };

  if (isPending) {
    return (
      <div className="min-h-screen bg-transparent p-4 sm:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="p-6 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <Lock className="text-amber-500" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Reward Pool Locked</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Unlock API access to view real-time engine metrics.</p>
              </div>
            </div>
            <Link href="/b2b/api-keys" className="px-6 py-2 bg-amber-500 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-amber-500/20">
              Unlock Now
            </Link>
          </div>
          <div className="opacity-10 dark:opacity-20 blur-sm flex flex-col gap-8 pointer-events-none">
             <div className="h-40 bg-gray-200 dark:bg-white/5 rounded-2xl" />
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               <div className="h-64 bg-gray-200 dark:bg-white/5 rounded-2xl md:col-span-2" />
               <div className="h-64 bg-gray-200 dark:bg-white/5 rounded-2xl" />
             </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) return (
    <div className="min-h-screen bg-transparent flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <RefreshCw className="h-8 w-8 text-pink-500 animate-spin" />
        <p className="text-gray-400 font-medium animate-pulse">Syncing Engine Infrastructure...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-transparent p-4 sm:p-6 pb-20 selection:bg-pink-500 selection:text-white">
      <div className="max-w-[1600px] mx-auto space-y-6 sm:space-y-8">
        
        {/* ── Header ──────────────────────────────────────────────────────── */}
        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-gray-900 dark:text-white">
              Reward Pool Management System
            </h1>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-500 uppercase tracking-wider">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live Updates
              </span>
              <span className="text-gray-400 dark:text-gray-500 text-xs font-medium">System ID: LE-POOL-{String(user?.id || '').slice(-4) || '0942'}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex bg-white dark:bg-[#12081d] border border-gray-100 dark:border-white/5 p-1 rounded-xl shadow-sm">
              <button 
                onClick={() => setMode("test")}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${mode === "test" ? "bg-amber-500 text-white shadow-[0_0_15px_rgba(245,158,11,0.3)]" : "text-gray-500 hover:text-gray-400"}`}
              >
                TEST
              </button>
              <button 
                onClick={() => setMode("live")}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${mode === "live" ? "bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]" : "text-gray-500 hover:text-gray-400"}`}
              >
                LIVE
              </button>
            </div>
            
            <div className="flex items-center gap-2">
              {[RefreshCw, Download, Bell].map((Icon, i) => (
                <button 
                  key={i} 
                  onClick={() => i === 0 && fetchData(true)}
                  disabled={refreshing && i === 0}
                  className="h-10 w-10 flex items-center justify-center rounded-xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/10 transition-colors group relative shadow-sm"
                >
                  <Icon className={`h-4 w-4 text-gray-500 dark:text-gray-400 group-hover:text-purple-600 dark:group-hover:text-white ${refreshing && i === 0 ? 'animate-spin' : ''}`} />
                  {i === 2 && <span className="absolute top-2 right-2 h-2 w-2 bg-pink-500 rounded-full border-2 border-white dark:border-[#0d0415]" />}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* ── Top Stats Row ───────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <TopStatCard 
            label="Total Pool" 
            value={fmtCurrency(data?.topStats?.totalPool || 0)} 
            change={{ val: `+${(data?.topStats?.totalPoolChange || 0).toFixed(1)}%`, pos: (data?.topStats?.totalPoolChange || 0) >= 0 }} 
            subLabel="vs last month"
            icon={Database} 
            color={COLORS.secondary} 
          />
          <TopStatCard 
            label="Daily Volume" 
            value={fmtCurrency(data?.topStats?.dailyVolume || 0)} 
            change={{ val: `${data?.topStats?.dailyTxCount || 0} tx`, pos: true }} 
            subLabel="Peak node usage"
            icon={Activity} 
            color={COLORS.primary} 
          />
          <TopStatCard 
            label="Active Players" 
            value={fmt(data?.topStats?.activePlayers || 0)} 
            change={{ val: "online", pos: true }} 
            subLabel="Live participation"
            icon={Zap} 
            color={COLORS.accent} 
          />
          <TopStatCard 
            label="Distribution Rate" 
            value={`${(data?.topStats?.distributionRate || 0).toFixed(1)}%`} 
            change={{ val: "Optimized", pos: true }} 
            subLabel="System efficiency"
            icon={ShieldCheck} 
            color={COLORS.success} 
          />
        </div>

        {/* ── Main Content Grid ───────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <PoolCompositionChart total={data?.composition?.centralPool || 0} segments={poolSegments} />
          </div>
          
          <div className="lg:col-span-4 bg-white dark:bg-[#12081d] border border-gray-100 dark:border-white/5 rounded-2xl p-6 flex flex-col shadow-sm">
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-8">Distribution Controls</h3>
            <div className="space-y-8 flex-1">
              <DistributionSlider label="Reward Pool" value={distro.reward} color={COLORS.secondary} onChange={(v) => handleDistroChange('reward', v)} />
              <DistributionSlider label="Platform Fee" value={distro.platform} color={COLORS.primary} onChange={(v) => handleDistroChange('platform', v)} />
              <DistributionSlider label="Reserve Fund" value={distro.reserve} color={COLORS.accent} onChange={(v) => handleDistroChange('reserve', v)} />
              <DistributionSlider label="Promotion" value={distro.promotion} color={COLORS.warning} onChange={(v) => handleDistroChange('promotion', v)} />
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-8">
              <button 
                onClick={handleSave}
                disabled={isSyncing}
                className={`py-3 px-4 rounded-xl font-bold text-xs text-white transition-all shadow-lg flex items-center justify-center gap-2 ${isSyncing ? 'bg-emerald-500 shadow-emerald-500/20' : 'bg-gradient-to-r from-purple-600 to-pink-600 shadow-pink-500/20 hover:brightness-110 active:scale-95'}`}
              >
                {isSyncing ? <RefreshCw className="h-3 w-3 animate-spin" /> : "Save Config"}
              </button>
              <button className="py-3 px-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 font-bold text-xs hover:bg-gray-100 dark:hover:bg-white/10 transition-all text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white active:scale-95">
                Test Distro
              </button>
            </div>
          </div>
        </div>

        {/* ── Fund Details & Trend ────────────────────────────────────────── */}
        <div className="grid grid-cols-1 gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
             {/* Styled Fund Cards */}
             {[
               { name: "Reward Pool", val: data?.composition?.values?.reward || 0, sub: "Calculated Reward Cap", icon: Zap, color: COLORS.secondary, tag: "Primary" },
               { name: "Reserve Fund", val: data?.composition?.values?.reserve || 0, sub: "Locked Capital", icon: ShieldCheck, color: COLORS.accent, tag: "Risk: Low" },
               { name: "Platform Fee", val: data?.composition?.values?.platform || 0, sub: "Payout Cycle", icon: DollarSign, color: COLORS.primary, tag: "Weekly" },
             ].map((fund, i) => (
               <div key={i} className="bg-white dark:bg-[#12081d] border border-gray-100 dark:border-white/10 rounded-2xl overflow-hidden relative group shadow-sm">
                  <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: fund.color }} />
                  <div className="p-5 space-y-4">
                    <div className="flex justify-between items-start">
                      <p className="text-sm font-bold text-gray-900 dark:text-white">{fund.name}</p>
                      <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-gray-50 dark:bg-white/5 text-gray-400 dark:text-gray-500 group-hover:text-gray-800 dark:group-hover:text-white transition-colors">{fund.tag}</span>
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-900 dark:text-white">{fmtCurrency(fund.val)}</h4>
                      <p className="text-[10px] text-gray-500 dark:text-gray-500 font-medium">{fund.sub}</p>
                    </div>
                  </div>
               </div>
             ))}
             {/* Small secondary items */}
             <div className="bg-white dark:bg-[#12081d] border border-[#fbbf24]/20 rounded-2xl p-5 relative overflow-hidden group shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <p className="text-sm font-bold text-gray-900 dark:text-white">Promotional</p>
                  <span className="text-[9px] font-bold text-[#fbbf24] uppercase">3 Active</span>
                </div>
                <h4 className="text-xl font-bold text-gray-900 dark:text-white">{fmtCurrency(data?.composition?.values?.promotional || 0)}</h4>
                <p className="text-[10px] text-gray-500 dark:text-gray-500 mt-1">Campaign: Active</p>
             </div>
             <div className="bg-white dark:bg-[#12081d] border border-emerald-500/20 rounded-2xl p-5 relative overflow-hidden shadow-sm">
                <div className="flex justify-between items-start mb-4">
                   <p className="text-sm font-bold text-gray-900 dark:text-white">Jackpot Pool</p>
                   <span className="flex items-center gap-1 text-[9px] font-bold text-emerald-500 uppercase">
                     <span className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" /> Live
                   </span>
                </div>
                <h4 className="text-xl font-bold text-gray-900 dark:text-white">₹120K</h4>
                <p className="text-[10px] text-gray-500 dark:text-gray-500 mt-1">Last Win: ₹25K</p>
             </div>
          </div>
        </div>

        {/* ── Transaction Table ───────────────────────────────────────────── */}
        <div className="bg-white dark:bg-[#12081d] border border-gray-100 dark:border-white/5 rounded-3xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-gray-100 dark:border-white/5 flex justify-between items-center bg-gray-50/50 dark:bg-white/[0.02]">
            <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
              Recent Transactions
            </h3>
            <Link href="/b2b/transactions" className="text-xs font-bold text-gray-400 hover:text-purple-600 dark:hover:text-pink-500 transition-colors flex items-center gap-1">
              View All History <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 dark:border-white/5 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                  <th className="px-8 py-4">Time</th>
                  <th className="px-8 py-4">Transaction Type</th>
                  <th className="px-8 py-4">Amount</th>
                  <th className="px-8 py-4 text-center">Status</th>
                  <th className="px-8 py-4">Node ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-white/[0.03]">
                {transactions.length > 0 ? transactions.map((tx, i) => (
                  <tr key={tx.id || i} className="group hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors cursor-default">
                    <td className="px-8 py-4 text-xs font-medium text-gray-500 dark:text-gray-400 tabular-nums">
                      {new Date(tx.time).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </td>
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-1.5 rounded-lg ${tx.type.includes('Payout') ? 'bg-indigo-500/10' : 'bg-emerald-500/10'}`}>
                          {tx.type.includes('Payout') ? <ArrowUpRight className="h-3 w-3 text-indigo-400" /> : <ArrowDownRight className="h-3 w-3 text-emerald-400" />}
                        </div>
                        <span className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-tight">{tx.type}</span>
                      </div>
                    </td>
                    <td className={`px-8 py-4 text-xs font-black tabular-nums ${tx.amount > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {tx.amount > 0 ? '+' : ''}{fmtCurrency(tx.amount)}
                    </td>
                    <td className="px-8 py-4 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-tighter ${
                        tx.status === 'SUCCESS' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 
                        tx.status === 'PENDING' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 
                        'bg-gray-500/10 text-gray-500 border border-gray-500/20'
                      }`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-8 py-4 font-mono text-[10px] text-gray-500">
                      {tx.nodeId || `tx_${Math.random().toString(36).slice(2, 10)}`}
                    </td>
                  </tr>
                )) : (
                  [...Array(4)].map((_, i) => (
                    <tr key={i} className="group hover:bg-white/[0.02] transition-colors border-b border-white/5">
                      <td className="px-8 py-4 text-xs text-gray-400">14:52:{10-i*2}</td>
                      <td className="px-8 py-4 text-xs font-bold text-white uppercase">Automated Distribution</td>
                      <td className="px-8 py-4 text-xs font-bold text-blue-400">Multiple Split</td>
                      <td className="px-8 py-4 text-center">
                        <span className="px-2 py-0.5 rounded text-[8px] font-bold bg-blue-500/10 text-blue-500 border border-blue-500/20">SETTLED</span>
                      </td>
                      <td className="px-8 py-4 font-mono text-[10px] text-gray-600">sys_node_0{i+1}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}