"use client";

import { useState } from "react";
import {
  DollarSign,
  CreditCard,
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  Download,
  MoreVertical,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
} from "lucide-react";

export default function PaymentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Mock data
  const stats = {
    totalRevenue: "$45,320",
    monthlyGrowth: "+18%",
    activeSubscriptions: 21,
    pendingPayments: 3,
    averageRevenue: "$2,158",
  };

  const subscriptionPlans = [
    { name: "Starter", price: "$99", clients: 8, color: "blue" },
    { name: "Professional", price: "$299", clients: 10, color: "purple" },
    { name: "Enterprise", price: "$999", clients: 3, color: "orange" },
  ];

  const recentTransactions = [
    {
      id: "INV-2024-001",
      client: "Casino Royale Tech",
      plan: "Enterprise",
      amount: "$999",
      status: "paid",
      date: "2026-02-25",
      method: "Credit Card",
    },
    {
      id: "INV-2024-002",
      client: "Global Spin Partners",
      plan: "Professional",
      amount: "$299",
      status: "paid",
      date: "2026-02-24",
      method: "Bank Transfer",
    },
    {
      id: "INV-2024-003",
      client: "Lucky Games Inc",
      plan: "Professional",
      amount: "$299",
      status: "pending",
      date: "2026-02-23",
      method: "Credit Card",
    },
    {
      id: "INV-2024-004",
      client: "Mega Rewards Co",
      plan: "Starter",
      amount: "$99",
      status: "paid",
      date: "2026-02-22",
      method: "PayPal",
    },
    {
      id: "INV-2024-005",
      client: "Spin Master Ltd",
      plan: "Enterprise",
      amount: "$999",
      status: "failed",
      date: "2026-02-21",
      method: "Credit Card",
    },
    {
      id: "INV-2024-006",
      client: "Prize Pool Inc",
      plan: "Starter",
      amount: "$99",
      status: "paid",
      date: "2026-02-20",
      method: "Credit Card",
    },
  ];

  const getStatusBadge = (status: string) => {
    const styles = {
      paid: "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-400",
      pending:
        "bg-yellow-100 dark:bg-yellow-500/10 text-yellow-800 dark:text-yellow-400",
      failed: "bg-red-100 dark:bg-red-500/10 text-red-800 dark:text-red-400",
      overdue:
        "bg-orange-100 dark:bg-orange-500/10 text-orange-800 dark:text-orange-400",
    };

    const icons = {
      paid: CheckCircle,
      pending: Clock,
      failed: XCircle,
      overdue: AlertCircle,
    };

    const Icon = icons[status as keyof typeof icons];

    return (
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}
      >
        <Icon className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Payment Controls
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Subscription & Billing Management
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors">
          <Download className="h-4 w-4" />
          Export Report
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white dark:bg-purple-950/20 border border-gray-200 dark:border-purple-500/10 rounded-xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total Revenue (MRR)
            </p>
            <DollarSign className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {stats.totalRevenue}
          </p>
          <div className="mt-2 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-emerald-500 mr-1" />
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">
              {stats.monthlyGrowth}
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-purple-950/20 border border-gray-200 dark:border-purple-500/10 rounded-xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Active Subscriptions
            </p>
            <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {stats.activeSubscriptions}
          </p>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Across all plans
          </p>
        </div>

        <div className="bg-white dark:bg-purple-950/20 border border-gray-200 dark:border-purple-500/10 rounded-xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Pending Payments
            </p>
            <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {stats.pendingPayments}
          </p>
          <p className="mt-2 text-sm text-yellow-600 dark:text-yellow-400 font-medium">
            Requires attention
          </p>
        </div>

        <div className="bg-white dark:bg-purple-950/20 border border-gray-200 dark:border-purple-500/10 rounded-xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Avg Revenue/Client
            </p>
            <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {stats.averageRevenue}
          </p>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Per month
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium opacity-90">Projected Revenue</p>
            <TrendingUp className="h-5 w-5" />
          </div>
          <p className="text-2xl font-bold">$53,500</p>
          <p className="mt-2 text-sm opacity-90">Next month</p>
        </div>
      </div>

      {/* Subscription Plans Overview */}
      <div className="bg-white dark:bg-purple-950/20 border border-gray-200 dark:border-purple-500/10 rounded-xl p-6 backdrop-blur-sm">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          Subscription Plans Distribution
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {subscriptionPlans.map((plan) => (
            <div
              key={plan.name}
              className="border border-gray-200 dark:border-purple-500/10 rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {plan.name}
                </h3>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-bold bg-${plan.color}-100 dark:bg-${plan.color}-500/10 text-${plan.color}-700 dark:text-${plan.color}-400`}
                >
                  {plan.price}/mo
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Active Clients
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {plan.clients}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Monthly Revenue
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    $
                    {parseInt(plan.price.replace("$", "").replace(",", "")) *
                      plan.clients}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white dark:bg-purple-950/20 border border-gray-200 dark:border-purple-500/10 rounded-xl backdrop-blur-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-purple-500/10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Recent Transactions
            </h2>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-gray-50 dark:bg-purple-950/30 border border-gray-200 dark:border-purple-500/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 dark:text-white"
                />
              </div>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-purple-500/20 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-purple-500/10 transition-colors">
                <Filter className="h-4 w-4" />
                Filter
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-purple-950/30 border-b border-gray-200 dark:border-purple-500/10">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Invoice ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Plan
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Method
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-purple-500/10">
              {recentTransactions.map((transaction) => (
                <tr
                  key={transaction.id}
                  className="hover:bg-gray-50 dark:hover:bg-purple-500/5 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-mono font-medium text-gray-900 dark:text-white">
                      {transaction.id}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-purple-500/10 dark:bg-purple-500/20 flex items-center justify-center">
                        <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">
                          {transaction.client.charAt(0)}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {transaction.client}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {transaction.plan}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {transaction.amount}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(transaction.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {transaction.date}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {transaction.method}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                      <MoreVertical className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-purple-950/30 border-t border-gray-200 dark:border-purple-500/10 flex items-center justify-between">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Showing 6 of 156 transactions
          </p>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-gray-200 dark:border-purple-500/20 rounded-lg text-sm hover:bg-white dark:hover:bg-purple-500/10 disabled:opacity-50 text-gray-700 dark:text-gray-300">
              Previous
            </button>
            <button className="px-3 py-1 border border-gray-200 dark:border-purple-500/20 rounded-lg text-sm hover:bg-white dark:hover:bg-purple-500/10 text-gray-700 dark:text-gray-300">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
