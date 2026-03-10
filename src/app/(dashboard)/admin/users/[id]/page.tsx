"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { use } from "react";
import {
  ArrowLeft,
  Calendar,
  Activity,
  DollarSign,
  Zap,
  Shield,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

export default function ClientDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [rtpTarget, setRtpTarget] = useState(92);

  const client = {
    id,
    name: "Casino Royale Tech",
    email: "api@casinoroyale.com",
    joinDate: "2026-01-15",
    lastActivity: "2 mins ago",
    status: "ACTIVE",
    region: "Mumbai, IN",
    licenseType: "Enterprise Tier",
    rewardPool: 1125000,
    dailyUtilization: 68,
    totalSpins: "1.2M",
    totalWins: "458k",
    totalBets: "₹8.4M",
    avgRtp: "91.4%",
    rtpTarget: 92,
    maxWinMultiplier: "10x",
    maxPayoutPerSpin: "₹5,000",
  };

  const mockTransactions = [
    {
      date: "Oct 24, 14:32",
      txnId: "#TRX-99021",
      gift: "Lucky Chest",
      bet: "250.00",
      win: "+1,200.00",
      status: "COMPLETED",
    },
    {
      date: "Oct 24, 14:30",
      txnId: "#TRX-99018",
      gift: "Mega Spin",
      bet: "100.00",
      win: "0.00",
      status: "COMPLETED",
    },
    {
      date: "Oct 24, 14:28",
      txnId: "#TRX-98992",
      gift: "Bronze Pack",
      bet: "50.00",
      win: "+150.00",
      status: "COMPLETED",
    },
  ];

  const getRtpLabel = (val: number) => {
    if (val <= 85) return { label: "Conservative", color: "text-blue-500 dark:text-blue-400" };
    if (val <= 92) return { label: "Balanced", color: "text-purple-600 dark:text-purple-400" };
    return { label: "Aggressive", color: "text-rose-500 dark:text-rose-400" };
  };

  const rtpMeta = getRtpLabel(rtpTarget);

  return (
    <div className="space-y-5 pb-10 px-1 sm:px-0">
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
            Client Details &amp; Controls
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Manage client account status, reward configuration, pool settings, and transaction activity.
          </p>
        </div>
      </div>

      {/* Client Info Card */}
      <div className="bg-gradient-to-br from-purple-700 to-purple-900 dark:from-purple-900/40 dark:to-purple-950/60 border border-purple-500/30 dark:border-purple-500/20 rounded-xl p-5 sm:p-6 transition-all duration-300">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-xl bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center shadow-lg flex-shrink-0">
              <span className="text-white font-bold text-xl sm:text-2xl">
                {client.name.charAt(0)}
              </span>
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white">{client.name}</h3>
              <p className="text-purple-200 text-sm mt-0.5">
                {client.email} | ID: {client.id}
              </p>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-purple-300">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {client.joinDate}
                </span>
                <span className="flex items-center gap-1">
                  <Activity className="h-3 w-3" />
                  {client.lastActivity}
                </span>
              </div>
            </div>
          </div>
          <span
            className={`self-start px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
              client.status === "ACTIVE"
                ? "bg-green-500/20 text-green-300 border border-green-500/30"
                : "bg-red-500/20 text-red-300 border border-red-500/30"
            }`}
          >
            {client.status} STATUS
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-5 border-t border-purple-500/25">
          <div>
            <p className="text-xs text-purple-300 uppercase tracking-wide">Region</p>
            <p className="text-white font-semibold mt-1">{client.region}</p>
          </div>
          <div>
            <p className="text-xs text-purple-300 uppercase tracking-wide">License Type</p>
            <p className="text-white font-semibold mt-1">{client.licenseType}</p>
          </div>
          <div className="flex gap-2">
            <button type="button" className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 active:scale-95 text-white rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200">
              ENABLE
            </button>
            <button type="button" className="flex-1 px-3 py-2 bg-gray-600 hover:bg-gray-700 active:scale-95 text-white rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200">
              DISABLE
            </button>
            <button type="button" className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 active:scale-95 text-white rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200">
              SUSPEND
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Client Reward Pool */}
        <div className="bg-white dark:bg-[#1a1025] border border-gray-200 dark:border-purple-500/10 rounded-xl p-5 sm:p-6 transition-colors duration-300">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-500/10 flex items-center justify-center flex-shrink-0">
              <DollarSign className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white">Client Reward Pool</h3>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                Available Pool Balance
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                ₹{client.rewardPool.toLocaleString()}
              </p>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Daily Utilization
                </p>
                <p className="text-sm font-bold text-gray-900 dark:text-white">
                  {client.dailyUtilization}%
                </p>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                  style={{ width: `${client.dailyUtilization}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Daily Limit: ₹1,650,653
              </p>
            </div>
            <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-purple-500/10">
              <button type="button" className="flex-1 px-3 py-2 bg-gray-700 hover:bg-gray-600 active:scale-95 text-white rounded-lg text-xs font-semibold transition-all duration-200">
                RESET
              </button>
              <button type="button" className="flex-1 px-3 py-2 bg-purple-600 hover:bg-purple-700 active:scale-95 text-white rounded-lg text-xs font-semibold transition-all duration-200">
                REBALANCE
              </button>
              <button type="button" className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 active:scale-95 text-white rounded-lg text-xs font-semibold transition-all duration-200">
                FREEZE
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="lg:col-span-2 grid grid-cols-2 gap-4">
          {[
            { label: "Total Spins", value: client.totalSpins, trend: "+12%", up: true },
            { label: "Total Wins", value: client.totalWins, trend: "-3%", up: false },
            { label: "Total Bets", value: client.totalBets, trend: null, up: true },
            { label: "Avg RTP", value: client.avgRtp, trend: null, up: true },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white dark:bg-[#1a1025] border border-gray-200 dark:border-purple-500/10 rounded-xl p-4 hover:border-purple-300 dark:hover:border-purple-500/30 transition-all duration-200"
            >
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                {stat.label}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              {stat.trend && (
                <div className={`flex items-center gap-1 text-xs mt-1 ${stat.up ? "text-green-600 dark:text-green-400" : "text-red-500 dark:text-red-400"}`}>
                  {stat.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  <span>{stat.trend}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Win Probability Settings ── */}
      <div className="bg-white dark:bg-[#1a1025] border border-gray-200 dark:border-purple-500/10 rounded-xl p-5 sm:p-6 transition-colors duration-300">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-500/10 flex items-center justify-center">
              <Zap className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white text-base sm:text-lg">
              Win Probability Settings
            </h3>
          </div>
          <span className="px-2.5 py-1 bg-purple-100 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 rounded-md text-xs font-semibold border border-purple-200 dark:border-purple-500/20">
            LIVE CONFIG
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">

          {/* RTP Slider Section */}
          <div className="space-y-4">
            {/* Header row */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                RTP Target
              </span>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${
                  rtpTarget <= 85
                    ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/20"
                    : rtpTarget <= 92
                    ? "bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-500/20"
                    : "bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-500/20"
                }`}>
                  {rtpMeta.label}
                </span>
                <span className="text-2xl font-bold text-purple-600 dark:text-purple-400 tabular-nums">
                  {rtpTarget}%
                </span>
              </div>
            </div>

            {/* Gradient track + thumb */}
            <div className="relative py-3">
              {/* coloured gradient bar behind the range */}
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-3 rounded-full overflow-hidden pointer-events-none"
                style={{ background: "linear-gradient(to right, #3b82f6, #a855f7, #ec4899, #f43f5e)" }}
              />
              {/* semi-transparent overlay that masks the "unfilled" portion */}
              <div
                className="absolute top-1/2 -translate-y-1/2 right-0 h-3 rounded-r-full pointer-events-none bg-gray-200/80 dark:bg-gray-800/80 transition-all duration-150"
                style={{ width: `${100 - ((rtpTarget - 80) / 19) * 100}%` }}
              />
              <input
                type="range"
                min="80"
                max="99"
                value={rtpTarget}
                onChange={(e) => setRtpTarget(Number(e.target.value))}
                className="relative w-full h-3 bg-transparent rounded-lg appearance-none cursor-pointer
                  [&::-webkit-slider-thumb]:appearance-none
                  [&::-webkit-slider-thumb]:w-6
                  [&::-webkit-slider-thumb]:h-6
                  [&::-webkit-slider-thumb]:rounded-full
                  [&::-webkit-slider-thumb]:bg-white
                  [&::-webkit-slider-thumb]:border-2
                  [&::-webkit-slider-thumb]:border-purple-500
                  [&::-webkit-slider-thumb]:shadow-lg
                  [&::-webkit-slider-thumb]:shadow-purple-500/40
                  [&::-webkit-slider-thumb]:transition-transform
                  [&::-webkit-slider-thumb]:duration-150
                  [&::-webkit-slider-thumb]:hover:scale-110
                  [&::-webkit-slider-thumb]:cursor-grab
                  [&::-webkit-slider-thumb]:active:cursor-grabbing
                  [&::-moz-range-thumb]:w-6
                  [&::-moz-range-thumb]:h-6
                  [&::-moz-range-thumb]:rounded-full
                  [&::-moz-range-thumb]:bg-white
                  [&::-moz-range-thumb]:border-2
                  [&::-moz-range-thumb]:border-purple-500
                  [&::-moz-range-thumb]:shadow-lg
                  [&::-moz-range-thumb]:cursor-grab"
              />
            </div>

            {/* Tick labels */}
            <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500 -mt-1">
              <span>80% · Conservative</span>
              <span>99% · Aggressive</span>
            </div>

            {/* Mini stat pills */}
            <div className="grid grid-cols-3 gap-2 mt-2">
              {[
                { label: "Min RTP", val: "80%" },
                { label: "Current", val: `${rtpTarget}%` },
                { label: "Max RTP", val: "99%" },
              ].map((p) => (
                <div key={p.label} className="rounded-lg bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-purple-500/10 p-2 text-center">
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wide">{p.label}</p>
                  <p className="text-sm font-bold text-gray-800 dark:text-white mt-0.5">{p.val}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Max Win / Max Payout */}
          <div className="space-y-4">
            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2 block font-semibold">
                Max Win Multiplier
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  defaultValue={client.maxWinMultiplier}
                  className="flex-1 px-3 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-purple-500/20 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition-all duration-200"
                />
                <button
                  type="button"
                  className="p-2.5 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-500/10 rounded-lg border border-purple-200 dark:border-purple-500/20 transition-all duration-200 active:scale-95"
                >
                  <Shield className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2 block font-semibold">
                Max Payout Per Spin
              </label>
              <input
                type="text"
                defaultValue={client.maxPayoutPerSpin}
                className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-purple-500/20 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/40 transition-all duration-200"
              />
            </div>

            {/* Visual RTP bar indicator */}
            <div className="rounded-xl bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-purple-500/10 p-4 space-y-3 mt-2">
              <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wide">
                Return to Player Breakdown
              </p>
              {[
                { label: "House Edge", pct: 100 - rtpTarget, color: "bg-rose-500" },
                { label: "Player Return", pct: rtpTarget, color: "bg-gradient-to-r from-purple-500 to-pink-500" },
              ].map((row) => (
                <div key={row.label} className="space-y-1">
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>{row.label}</span>
                    <span className="font-semibold text-gray-700 dark:text-gray-200">{row.pct.toFixed(1)}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${row.color} rounded-full transition-all duration-500`}
                      style={{ width: `${row.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* System Controls */}
      <div className="bg-white dark:bg-[#1a1025] border border-gray-200 dark:border-purple-500/10 rounded-xl p-5 sm:p-6 transition-colors duration-300">
        <div className="flex items-center gap-2 mb-6">
          <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center">
            <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="font-bold text-gray-900 dark:text-white">System Controls</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { label: "Fraud Monitoring", sub: "Real-time detection", checked: true },
            { label: "RTP Stabilization", sub: "Auto-adjust probability", checked: true },
            { label: "Pool Auto-Rebalance", sub: "Intelligent liquidity mining", checked: false },
          ].map((ctrl) => (
            <div
              key={ctrl.label}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-purple-500/10 hover:border-purple-300 dark:hover:border-purple-500/30 transition-all duration-200"
            >
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{ctrl.label}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{ctrl.sub}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer ml-3 flex-shrink-0">
                <input type="checkbox" className="sr-only peer" defaultChecked={ctrl.checked} />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-500 dark:peer-focus:ring-purple-600 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600 transition-colors duration-200"></div>
              </label>
            </div>
          ))}
        </div>

        <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-500/5 border border-amber-200 dark:border-amber-500/20 rounded-lg flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">WARNING</p>
            <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
              Manual adjustments to RTP Target may affect payout delays by up to 30 seconds across nodes.
            </p>
          </div>
        </div>
      </div>

      {/* Transaction Logs */}
      <div className="bg-white dark:bg-[#1a1025] border border-gray-200 dark:border-purple-500/10 rounded-xl p-5 sm:p-6 transition-colors duration-300">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-500/10 flex items-center justify-center">
              <Activity className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white">Transaction Logs</h3>
          </div>
          <div className="flex gap-2">
            <button type="button" className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200">
              Filter
            </button>
            <button type="button" className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200">
              Export
            </button>
          </div>
        </div>

        <div className="overflow-x-auto -mx-2 px-2">
          <table className="w-full min-w-[540px]">
            <thead>
              <tr className="border-b border-gray-200 dark:border-purple-500/10">
                {["Date", "TXN ID", "Gift", "Bet (₹)", "Win (₹)", "Status"].map((h) => (
                  <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mockTransactions.map((txn, idx) => (
                <tr
                  key={idx}
                  className="border-b border-gray-100 dark:border-purple-500/5 hover:bg-gray-50 dark:hover:bg-purple-500/5 transition-colors duration-150"
                >
                  <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">{txn.date}</td>
                  <td className="py-3 px-4 text-sm font-mono text-purple-600 dark:text-purple-400">{txn.txnId}</td>
                  <td className="py-3 px-4 text-sm text-gray-900 dark:text-white font-medium">{txn.gift}</td>
                  <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">{txn.bet}</td>
                  <td className="py-3 px-4 text-sm font-semibold text-green-600 dark:text-green-400">{txn.win}</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-500/20">
                      {txn.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 text-center">
          <button type="button" className="text-sm font-semibold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors duration-200">
            View All Transactions →
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-gray-200 dark:border-purple-500/10">
        <button
          type="button"
          className="w-full sm:w-auto px-6 py-2.5 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-700 active:scale-95 transition-all duration-200"
        >
          Reset Client Rules
        </button>
        <button
          type="button"
          className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 active:scale-95 text-white rounded-lg font-semibold shadow-lg shadow-purple-500/20 transition-all duration-200"
        >
          Save Client Settings
        </button>
      </div>
    </div>
  );
}