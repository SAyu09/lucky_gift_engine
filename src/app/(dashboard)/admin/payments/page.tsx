"use client";

import { useState, useEffect } from "react";
import {
  DollarSign,
  TrendingUp,
  Search,
  Filter,
  Download,
  MoreVertical,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Wallet,
  History,
  ArrowUpRight,
  Loader2,
} from "lucide-react";
import { useAdmin } from "@/hooks/api/useAdmin";

export default function PaymentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { getDashboardStats, isLoading } = useAdmin();
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getDashboardStats();
        if (res && res.success) {
          setStats(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch financial stats:", err);
      }
    };
    fetchStats();
  }, [getDashboardStats]);

  // Mock recharge transactions (Since there's no global list endpoint yet)
  const recentRecharges = [
    {
      id: "RCH-99021",
      client: "Nipun Dixit",
      amount: "₹1,200",
      coins: "1,200",
      status: "paid",
      date: "2026-03-09",
      method: "Stripe",
    },
    {
      id: "RCH-99018",
      client: "Ayush Kumar Rai",
      amount: "₹5,000",
      coins: "5,000",
      status: "paid",
      date: "2026-03-09",
      method: "Manual Admin",
    },
    {
      id: "RCH-99015",
      client: "Casino Royale Tech",
      amount: "₹10,000",
      coins: "10,000",
      status: "pending",
      date: "2026-03-08",
      method: "Bank Transfer",
    },
    {
      id: "RCH-99012",
      client: "Global Spin Partners",
      amount: "₹2,500",
      coins: "2,500",
      status: "paid",
      date: "2026-03-07",
      method: "Stripe",
    },
    {
      id: "RCH-99009",
      client: "Example Client",
      amount: "₹500",
      coins: "500",
      status: "failed",
      date: "2026-03-06",
      method: "Credit Card",
    },
  ];

  const getStatusBadge = (status: string) => {
    const styles = {
      paid: "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-400",
      pending: "bg-yellow-100 dark:bg-yellow-500/10 text-yellow-800 dark:text-yellow-400",
      failed: "bg-red-100 dark:bg-red-500/10 text-red-800 dark:text-red-400",
    };

    const icons = {
      paid: CheckCircle,
      pending: Clock,
      failed: XCircle,
    };

    const Icon = icons[status as keyof typeof icons] || AlertCircle;

    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${styles[status as keyof typeof styles]}`}>
        <Icon className="h-3 w-3" />
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Wallet className="h-7 w-7 text-blue-600 dark:text-purple-400" />
            Payment & Wallet Controls
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Monitor global wallet recharges, coin distributions, and financial ledgers.
          </p>
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-purple-600/20 transition-all active:scale-95">
          <Download className="h-4 w-4" />
          Financial Report
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#1a1025] border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
              Total Lifetime Deposits
            </p>
            <div className="h-8 w-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center">
               <DollarSign className="h-4 w-4 text-emerald-600" />
            </div>
          </div>
          <p className="text-3xl font-black text-gray-900 dark:text-white tabular-nums">
            {isLoading ? <Loader2 className="h-6 w-6 animate-spin text-gray-400" /> : `₹${stats?.financials?.totalWalletRecharges?.toLocaleString() || '0'}`}
          </p>
          <div className="mt-2 flex items-center text-xs">
            <TrendingUp className="h-3 w-3 text-emerald-500 mr-1" />
            <span className="text-emerald-600 font-bold">+12.5% from last month</span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1a1025] border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
              Current Client Balances
            </p>
            <div className="h-8 w-8 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center">
               <Wallet className="h-4 w-4 text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-black text-gray-900 dark:text-white tabular-nums">
            {isLoading ? <Loader2 className="h-6 w-6 animate-spin text-gray-400" /> : `₹${stats?.financials?.totalPendingClientBalances?.toLocaleString() || '0'}`}
          </p>
          <p className="mt-2 text-[10px] text-gray-400 font-medium">Sum of all B2B wallet credits</p>
        </div>

        <div className="bg-white dark:bg-[#1a1025] border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
              Total Spins Processed
            </p>
            <div className="h-8 w-8 rounded-lg bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center">
               <ArrowUpRight className="h-4 w-4 text-purple-600" />
            </div>
          </div>
          <p className="text-3xl font-black text-gray-900 dark:text-white tabular-nums">
            {isLoading ? <Loader2 className="h-6 w-6 animate-spin text-gray-400" /> : stats?.metrics?.totalSpinsProcessed?.toLocaleString() || '0'}
          </p>
          <p className="mt-2 text-[10px] text-gray-400 font-medium font-mono text-purple-400 uppercase tracking-tighter">Real-time throughput</p>
        </div>

        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white shadow-xl shadow-indigo-500/20">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Platform Statistics</p>
            <Activity className="h-4 w-4 opacity-80" />
          </div>
          <div className="space-y-1">
             <p className="text-2xl font-black">{stats?.metrics?.totalActiveClients || '0'} Clients</p>
             <p className="text-sm font-medium opacity-80">{stats?.metrics?.totalEndUsers || '0'} End Users Joined</p>
          </div>
          <button className="mt-3 w-full py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-[10px] font-black tracking-widest transition-all">
            VIEW ANALYTICS
          </button>
        </div>
      </div>

      {/* Wallet Recharge Overview - Replaces Subscription Plans */}
      <div className="bg-white dark:bg-[#1a1025] border border-gray-200 dark:border-white/10 rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <History className="h-5 w-5 text-purple-500" />
          Wallet Recharge Intelligence
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-5 border border-gray-100 dark:border-white/5">
             <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4">Average Recharge</h3>
             <p className="text-2xl font-black text-gray-900 dark:text-white">₹2,850</p>
             <div className="h-1.5 w-full bg-gray-200 dark:bg-white/10 rounded-full mt-4 overflow-hidden">
                <div className="h-full w-2/3 bg-blue-500 rounded-full" />
             </div>
             <p className="text-[10px] text-gray-400 mt-2 font-medium">Standard deposit value</p>
          </div>
          
          <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-5 border border-gray-100 dark:border-white/5">
             <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4">Pending Requests</h3>
             <p className="text-2xl font-black text-yellow-600 dark:text-yellow-400">3</p>
             <div className="flex gap-1 mt-4">
                {[1, 2, 3].map(i => <div key={i} className="h-1.5 flex-1 bg-yellow-400 rounded-full" />)}
             </div>
             <p className="text-[10px] text-yellow-600/80 mt-2 font-bold uppercase tracking-widest">Manual approvals required</p>
          </div>

          <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-5 border border-gray-100 dark:border-white/5">
             <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4">Top Client Volume</h3>
             <p className="text-2xl font-black text-purple-600 dark:text-purple-400">₹8,400</p>
             <p className="text-[10px] text-purple-500 mt-2 font-bold uppercase tracking-widest">Nipun Dixit · 12 Recharges</p>
          </div>
        </div>
      </div>

      {/* Recent Recharge Transactions */}
      <div className="bg-white dark:bg-[#1a1025] border border-gray-200 dark:border-white/10 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-lg font-black text-gray-900 dark:text-white">
              Recent Recharge Logs
            </h2>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search ledger..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-gray-50 dark:bg-[#1f132b] border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 dark:text-white"
                />
              </div>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-white/10 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                <Filter className="h-4 w-4" />
                Filter
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-[#1f132b] border-b border-gray-200 dark:border-white/10">
              <tr>
                <th className="px-6 py-4 text-left text-[10px] font-black text-gray-500 uppercase tracking-widest">
                  Transaction ID
                </th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-gray-500 uppercase tracking-widest">
                  B2B Client
                </th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-gray-500 uppercase tracking-widest">
                  Method
                </th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-gray-500 uppercase tracking-widest">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-gray-500 uppercase tracking-widest">
                  Coins Added
                </th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-gray-500 uppercase tracking-widest">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-[10px] font-black text-gray-500 uppercase tracking-widest">
                  Date
                </th>
                <th className="px-6 py-4 text-right text-[10px] font-black text-gray-500 uppercase tracking-widest">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-white/10">
              {recentRecharges.map((transaction) => (
                <tr
                  key={transaction.id}
                  className="hover:bg-gray-50 dark:hover:bg-[#1f132b] transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400">
                      {transaction.id}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-purple-500/10 dark:to-indigo-500/10 flex items-center justify-center border border-blue-200 dark:border-purple-500/20">
                        <span className="text-xs font-black text-blue-700 dark:text-purple-300">
                          {transaction.client.charAt(0)}
                        </span>
                      </div>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                        {transaction.client}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      {transaction.method}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-black text-gray-900 dark:text-white uppercase transition-all">
                      {transaction.amount}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                      +{transaction.coins}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(transaction.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                      {new Date(transaction.date).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                      <MoreVertical className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-[#1a1025] border-t border-gray-200 dark:border-white/10 flex items-center justify-between">
          <p className="text-xs text-gray-500 font-medium tracking-wide">
            Showing latest 5 financial events
          </p>
          <div className="flex gap-2">
            <button className="px-4 py-1.5 bg-white dark:bg-[#1f132b] border border-gray-200 dark:border-white/10 rounded-lg text-xs font-bold hover:shadow-sm transition-all disabled:opacity-50">
              Previous
            </button>
            <button className="px-4 py-1.5 bg-white dark:bg-[#1f132b] border border-gray-200 dark:border-white/10 rounded-lg text-xs font-bold hover:shadow-sm transition-all">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Add CSS for Lucide Activity icon if missing in earlier imports
const Activity = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);
