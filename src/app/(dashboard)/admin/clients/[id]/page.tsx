"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, use } from "react";
import {
  ArrowLeft,
  Calendar,
  Activity,
  DollarSign,
  Zap,
  Shield,
  AlertTriangle,
  TrendingUp,
  Loader2,
  Lock,
  Globe,
  Wallet,
  History,
  Search,
  ChevronDown,
  ChevronUp,
  ToggleLeft,
  ToggleRight
} from "lucide-react";
import { useAdmin } from "@/hooks/api/useAdmin";
import { ClientDetailResponse, LedgerEntry } from "@/types/admin.types";

export default function ClientDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { getClientDetails, getClientLedger, updateClientStatus, isLoading, error } = useAdmin();
  const [data, setData] = useState<ClientDetailResponse['data'] | null>(null);
  const [ledger, setLedger] = useState<LedgerEntry[]>([]);
  const [rtpTarget, setRtpTarget] = useState(95);
  const [isLedgerLoading, setIsLedgerLoading] = useState(false);
  const [isLedgerVisible, setIsLedgerVisible] = useState(false);
  const [isTogglingStatus, setIsTogglingStatus] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientRes, ledgerRes] = await Promise.all([
          getClientDetails(id),
          getClientLedger(id)
        ]);

        if (clientRes && clientRes.success) {
          setData(clientRes.data);
          setRtpTarget(clientRes.data.configuration.targetRtpPercent);
        }

        if (ledgerRes && ledgerRes.success) {
          setLedger(ledgerRes.data);
        }
      } catch (err) {
        console.error("Failed to load client intelligence:", err);
      }
    };
    fetchData();
  }, [id, getClientDetails, getClientLedger]);

  const handleToggleStatus = async () => {
    if (!data || isTogglingStatus) return;
    
    setIsTogglingStatus(true);
    try {
      const newStatus = !data.profile.isActive;
      const res = await updateClientStatus(id, newStatus);
      if (res && res.success) {
        setData(prev => prev ? {
          ...prev,
          profile: {
            ...prev.profile,
            isActive: res.data.isActive
          }
        } : null);
      }
    } catch (err) {
      console.error("Failed to toggle client status:", err);
    } finally {
      setIsTogglingStatus(false);
    }
  };

  if (isLoading && !data) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 text-purple-600 animate-spin" />
        <p className="text-gray-500 animate-pulse">Fetching client intelligence...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-4">
        <div className="h-16 w-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
          <AlertTriangle className="h-8 w-8 text-red-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Connection Failed</h2>
        <p className="text-gray-500 max-w-md">{error || "The requested client data could not be retrieved from the server."}</p>
        <button 
          onClick={() => router.back()}
          className="mt-2 px-6 py-2 bg-gray-900 dark:bg-white dark:text-gray-900 text-white rounded-lg font-semibold"
        >
          Go Back
        </button>
      </div>
    );
  }

  const { profile, configuration, billing, analytics, recharges, pools } = data;

  const getRtpLabel = (val: number) => {
    if (val <= 85) return { label: "Conservative", color: "text-blue-500 dark:text-blue-400" };
    if (val <= 92) return { label: "Balanced", color: "text-purple-600 dark:text-purple-400" };
    return { label: "Aggressive", color: "text-rose-500 dark:text-rose-400" };
  };

  const rtpMeta = getRtpLabel(rtpTarget);

  return (
    <div className="space-y-6 pb-10 px-1 sm:px-0 max-w-7xl mx-auto">
      {/* Back Button & Header */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 dark:hover:bg-purple-500/10 rounded-lg transition-colors duration-200"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        </button>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            Client Intelligence Center
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Full profile audit, billing ledger, and real-time engine configurations for {profile.name}.
          </p>
        </div>
      </div>

      {/* Hero Profile Card */}
      <div className="bg-gradient-to-br from-purple-700 to-indigo-900 dark:from-[#1a1025] dark:to-[#120a1d] border border-purple-500/30 dark:border-white/10 rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/10 rounded-full -ml-16 -mb-16 blur-3xl pointer-events-none" />
        
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center shadow-2xl flex-shrink-0 border-2 border-white/20">
              <span className="text-white font-bold text-3xl">
                {profile.name.charAt(0)}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-2xl font-bold text-white">{profile.name}</h3>
              </div>
              <p className="text-purple-200/80 text-sm mt-1 font-medium">
                {profile.user.email} • <span className="text-purple-300">#{profile.id}</span>
              </p>
              <div className="flex flex-wrap items-center gap-4 mt-4">
                <div className="flex items-center gap-1.5 text-xs text-purple-300/90 font-medium">
                  <Calendar className="h-3.5 w-3.5" />
                  Joined {new Date(profile.createdAt).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-purple-300/90 font-medium">
                  <Shield className="h-3.5 w-3.5" />
                  {profile.user.role}
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap lg:flex-nowrap gap-3 items-stretch justify-center lg:justify-end w-full lg:w-auto">

            {/* ── Toggle Button ── */}
            <button
              onClick={handleToggleStatus}
              disabled={isTogglingStatus}
              className="flex-1 lg:flex-none px-6 py-3 min-w-[170px] bg-gradient-to-b from-white/10 to-transparent rounded-xl border border-white/10 backdrop-blur-md transition-all duration-300 hover:scale-[1.02] active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg"
            >
              <p className="text-[10px] font-bold text-purple-200 uppercase tracking-widest mb-3 text-center">
                Account Status
              </p>

              {isTogglingStatus ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 text-white/70 animate-spin" />
                  <span className="text-xs font-bold text-white/50">Updating…</span>
                </div>
              ) : (
                /* ── pill + label stacked vertically so they never overlap ── */
                <div className="flex flex-col items-center gap-2">
                  {/* pill track — fixed 56×28 so knob has room */}
                  <div
                    style={{ width: 56, height: 28, borderRadius: 14, position: 'relative', flexShrink: 0 }}
                    className={`transition-all duration-500 ease-in-out ${
                      profile.isActive
                        ? "bg-emerald-500 shadow-[0_0_16px_rgba(16,185,129,0.5)]"
                        : "bg-rose-500/80 shadow-[0_0_16px_rgba(244,63,94,0.4)]"
                    }`}
                  >
                    {/* knob — 22×22, inset 3px from top, slides left↔right */}
                    <span
                      style={{
                        position: 'absolute',
                        top: 3,
                        width: 22,
                        height: 22,
                        borderRadius: '50%',
                        backgroundColor: 'white',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
                        transition: 'left 0.45s cubic-bezier(0.4,0,0.2,1)',
                        left: profile.isActive ? 56 - 22 - 3 : 3,
                      }}
                    />
                  </div>

                  {/* label below pill */}
                  <span
                    className={`text-sm font-black tracking-wider transition-colors duration-300 ${
                      profile.isActive ? "text-emerald-400" : "text-rose-400"
                    }`}
                  >
                    {profile.isActive ? "ACTIVE" : "INACTIVE"}
                  </span>
                </div>
              )}
            </button>

            <div className="flex-1 lg:flex-none px-6 py-3 min-w-[140px] bg-gradient-to-b from-white/10 to-transparent rounded-xl border border-white/10 backdrop-blur-md flex flex-col justify-center items-center">
              <p className="text-[10px] font-bold text-purple-200 uppercase tracking-widest mb-1">Total Deposits</p>
              <p className="text-xl font-black text-white">₹{recharges.totalRechargeAmount.toLocaleString()}</p>
            </div>
            <div className="flex-1 lg:flex-none px-6 py-3 min-w-[120px] bg-gradient-to-b from-white/10 to-transparent rounded-xl border border-white/10 backdrop-blur-md flex flex-col justify-center items-center">
              <p className="text-[10px] font-bold text-purple-200 uppercase tracking-widest mb-1">Global Rank</p>
              <p className="text-xl font-black text-white">#12</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Wallet & Billing Ledger */}
        <div className="bg-white dark:bg-[#1a1025] border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center">
                <Wallet className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white">Billing Snapshot</h3>
            </div>
            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
              billing.paymentStatus === 'PAID' ? "bg-green-50 dark:bg-green-500/10 text-green-700 border-green-200" : "bg-red-50 text-red-700 border-red-200"
            }`}>
              {billing.paymentStatus}
            </span>
          </div>

          <div className="space-y-5">
            <div>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-widest font-bold mb-1">Available Balance</p>
              <p className="text-3xl font-black text-gray-900 dark:text-white tabular-nums">
                ₹{billing.walletBalance.toLocaleString()}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100 dark:border-white/5">
              <div>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-bold">Reserves</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white mt-0.5">₹{billing.globalReserve.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-bold">Total Recharged</p>
                <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">₹{recharges.totalRechargeAmount.toLocaleString()}</p>
              </div>
            </div>

            <div className="pt-4 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500 font-medium">Test API Integration</span>
                <span className={billing.hasTestApiKey ? "text-green-600 font-bold" : "text-gray-400"}>{billing.hasTestApiKey ? 'CONNECTED' : 'EXPIRED'}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500 font-medium">Live API Integration</span>
                <span className={billing.hasLiveApiKey ? "text-purple-600 font-bold" : "text-gray-400"}>{billing.hasLiveApiKey ? 'ACTIVE' : 'INACTIVE'}</span>
              </div>
            </div>

            <button 
              onClick={() => setIsLedgerVisible(!isLedgerVisible)}
              className="w-full py-2.5 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 text-gray-900 dark:text-white rounded-xl text-xs font-bold transition-all border border-gray-200 dark:border-white/10 mt-2 flex items-center justify-center gap-2"
            >
              {isLedgerVisible ? 'Hide Recharge History' : 'View Recharge History'}
              {isLedgerVisible ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Analytics Grid */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: "Total Spins", value: analytics.totalSpinsProcessed.toLocaleString(), sub: "executions", icon: Activity, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-500/10" },
            { label: "Volume Processed", value: `₹${analytics.totalVolumeProcessed.toLocaleString()}`, sub: "gross wager", icon: Globe, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-500/10" },
            { label: "Client Profit", value: `₹${analytics.totalClientProfit.toLocaleString()}`, sub: "net earnings", icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
            { label: "Platform Revenue", value: `₹${analytics.totalPlatformRevenue.toLocaleString()}`, sub: "service fee", icon: Zap, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-500/10" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white dark:bg-[#1a1025] border border-gray-200 dark:border-white/10 rounded-2xl p-5 shadow-sm hover:border-purple-300 dark:hover:border-purple-500/30 transition-all group">
              <div className="flex items-center justify-between mb-4">
                <div className={`h-10 w-10 rounded-xl ${stat.bg} flex items-center justify-center transition-transform group-hover:scale-110`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <TrendingUp className="h-4 w-4 text-gray-300" />
              </div>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase tracking-widest font-bold">{stat.label}</p>
              <div className="flex items-baseline gap-2 mt-1">
                <h4 className="text-2xl font-black text-gray-900 dark:text-white tabular-nums">{stat.value}</h4>
                <span className="text-[10px] text-gray-400 font-medium">{stat.sub}</span>
              </div>
            </div>
          ))}

          <div className="sm:col-span-2 bg-white dark:bg-[#1a1025] border border-gray-200 dark:border-white/10 rounded-2xl p-5 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-orange-100 dark:bg-orange-500/10 flex items-center justify-center">
                <Activity className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">Active Pools</p>
                <p className="text-xs text-gray-500">{pools.totalPools} pools configured across gifts</p>
              </div>
            </div>
            <div className="flex gap-2 text-right">
              <div>
                <p className="text-lg font-black text-gray-900 dark:text-white">{pools.breakdown.COMPLETED}</p>
                <p className="text-[10px] text-gray-500 uppercase font-bold">Finalized</p>
              </div>
              <div className="px-4 border-l border-gray-100 dark:border-white/5">
                <p className="text-lg font-black text-blue-600 animate-pulse">{pools.breakdown.FILLED + pools.breakdown.PENDING}</p>
                <p className="text-[10px] text-gray-500 uppercase font-bold">Warping</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recharge History Ledger */}
      {isLedgerVisible && (
        <div id="ledger-section" className="bg-white dark:bg-[#1a1025] border border-gray-200 dark:border-white/10 rounded-2xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="p-6 border-b border-gray-200 dark:border-white/10">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-purple-100 dark:bg-purple-500/10 flex items-center justify-center">
                      <History className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h2 className="text-lg font-black text-gray-900 dark:text-white">Transaction & Recharge Ledger</h2>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest text-gray-500 transition-all hover:bg-gray-100">
                      Export CSV
                  </button>
                </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="bg-gray-50 dark:bg-[#1f132b]">
                  <tr>
                      <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</th>
                      <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Description</th>
                      <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount</th>
                      <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Balance After</th>
                      <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Reference</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                  {ledger.length > 0 ? (
                      ledger.map((entry) => (
                        <tr key={entry.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                  {new Date(entry.createdAt).toLocaleString()}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <p className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1">{entry.description}</p>
                              <span className="text-[10px] text-gray-400 font-medium uppercase tracking-tighter">Event ID: {entry.id}</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`text-sm font-black ${entry.amount >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600'}`}>
                                  {entry.amount >= 0 ? '+' : ''}₹{entry.amount.toLocaleString()}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center gap-1.5">
                                  <Wallet className="h-3 w-3 text-gray-400" />
                                  <span className="text-sm font-bold text-gray-700 dark:text-gray-300">₹{entry.balanceAfter.toLocaleString()}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 py-0.5 bg-gray-100 dark:bg-white/5 rounded text-[10px] font-mono text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-white/10">
                                  {entry.referenceId.slice(0, 12)}...
                              </span>
                            </td>
                        </tr>
                      ))
                  ) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-20 text-center">
                            <History className="h-10 w-10 text-gray-200 dark:text-white/10 mx-auto mb-4" />
                            <p className="text-gray-500 font-medium">No recharge history found for this client.</p>
                        </td>
                      </tr>
                  )}
                </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Engine Configuration */}
      <div className="bg-white dark:bg-[#1a1025] border border-gray-200 dark:border-white/10 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-purple-100 dark:bg-purple-500/10 flex items-center justify-center">
              <Zap className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-black text-gray-900 dark:text-white">Continuous Engine Configuration</h3>
              <p className="text-xs text-gray-500">Real-time adjustments for win probabilities and payout thresholds.</p>
            </div>
          </div>
          <div className="hidden sm:block">
            <span className="px-3 py-1 bg-purple-500 text-white rounded-lg text-[10px] font-black tracking-widest shadow-lg shadow-purple-500/20">
              LIVE BROADCAST
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-200">Target RTP (Return to Player)</label>
                <div className="flex items-center gap-3">
                   <span className={`text-[10px] font-black px-2 py-1 rounded-md border ${rtpMeta.color} border-current opacity-80 uppercase tracking-tighter`}>
                    {rtpMeta.label} MODE
                  </span>
                  <span className="text-3xl font-black text-purple-600 dark:text-purple-400 tabular-nums">{rtpTarget}%</span>
                </div>
              </div>

              <div className="relative py-4 group">
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-2.5 rounded-full bg-gray-100 dark:bg-white/5 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-rose-500 transition-all duration-300" style={{ width: `${((rtpTarget - 80) / 20) * 100}%` }} />
                </div>
                <input
                  type="range"
                  min="80"
                  max="100"
                  value={rtpTarget}
                  onChange={(e) => setRtpTarget(Number(e.target.value))}
                  className="relative w-full h-2.5 bg-transparent appearance-none cursor-pointer z-10
                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-purple-600 [&::-webkit-slider-thumb]:shadow-xl [&::-webkit-slider-thumb]:transition-transform group-hover:[&::-webkit-slider-thumb]:scale-110"
                />
              </div>
              <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                <span>Safe 80%</span>
                <span>Balanced</span>
                <span>Jackpot 100%</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Platform Cut (%)</label>
                <div className="relative group">
                  <input 
                    type="number" 
                    defaultValue={configuration.platformCutPercent} 
                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-purple-500/40 outline-none transition-all"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold">%</div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Client Profit (%)</label>
                <div className="relative group">
                  <input 
                    type="number" 
                    defaultValue={configuration.clientProfitPercent} 
                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-purple-500/40 outline-none transition-all"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold">%</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-white/5 rounded-2xl p-6 border border-gray-100 dark:border-white/5">
            <h4 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-widest mb-4 flex items-center gap-2">
              <Activity className="h-4 w-4 text-purple-500" />
              RTP & Probability Matrix
            </h4>
            <div className="space-y-3">
              {configuration.probabilityTable.map((row) => (
                <div key={row.multiplier} className="flex items-center gap-4">
                  <div className="w-12 text-xs font-black text-gray-500 tabular-nums">{row.multiplier}x</div>
                  <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: `${row.probability * 100}%` }} />
                  </div>
                  <div className="w-16 text-right text-xs font-bold text-gray-900 dark:text-white tabular-nums">
                    {(row.probability * 100).toFixed(1)}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
           <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />
              <p className="text-[10px] text-gray-500 max-w-sm">
                <b>Guardrail Warning:</b> Modifying the probability table manually may void current pool integrity. The engine will auto-rebalance remaining reserves within 60 seconds of saving.
              </p>
           </div>
           <button className="px-8 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/10">
             Push Config to Engine
           </button>
        </div>
      </div>
    </div>
  );
}