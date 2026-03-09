"use client";

import { useState } from "react";
import {
  CreditCard,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Download,
  Activity,
  Zap,
  CheckCircle,
  ArrowUpRight,
  ShieldCheck,
  Clock,
} from "lucide-react";

export default function BillingPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<
    "week" | "month" | "year"
  >("month");

  // Mock data
  const billingStats = {
    currentBalance: 54320,
    monthlySpend: 12450,
    totalApiCalls: 1284092,
    nextBillingDate: "01 Apr",
    nextBillingYear: "2026",
  };

  const usageData = [
    { month: "Jan", amount: 8500, calls: 875000 },
    { month: "Feb", amount: 9200, calls: 948000 },
    { month: "Mar", amount: 10100, calls: 1041000 },
    { month: "Apr", amount: 11300, calls: 1165000 },
    { month: "May", amount: 12450, calls: 1284000 },
  ];

  const recentInvoices = [
    {
      id: "INV-2024-001",
      date: "2024-05-01",
      amount: 12450,
      status: "paid",
      period: "May 2024",
    },
    {
      id: "INV-2024-002",
      date: "2024-04-01",
      amount: 11300,
      status: "paid",
      period: "Apr 2024",
    },
    {
      id: "INV-2024-003",
      date: "2024-03-01",
      amount: 10100,
      status: "paid",
      period: "Mar 2024",
    },
    {
      id: "INV-2024-004",
      date: "2024-02-01",
      amount: 9200,
      status: "paid",
      period: "Feb 2024",
    },
  ];

  const monthlySummary = [
    { label: "Base Plan (Premium)", amount: 5000 },
    { label: "API Usage (Overages)", amount: 3200 },
    { label: "Spin Engine Usage", amount: 4300 },
  ];

  const totalDue = monthlySummary.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Billing Controls
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Usage & Billing Reports
          </p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center gap-2 text-sm font-medium">
            <Download className="h-4 w-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-purple-950/20 border border-gray-200 dark:border-purple-500/10 rounded-xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-sm font-medium">
              <TrendingUp className="h-4 w-4" />
              <span>+12%</span>
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            Current Balance
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            ${billingStats.currentBalance.toLocaleString()}
          </p>
        </div>

        <div className="bg-white dark:bg-purple-950/20 border border-gray-200 dark:border-purple-500/10 rounded-xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 rounded-xl bg-purple-500/10 dark:bg-purple-500/20 flex items-center justify-center">
              <CreditCard className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="flex items-center gap-1 text-red-600 dark:text-red-400 text-sm font-medium">
              <TrendingDown className="h-4 w-4" />
              <span>-${billingStats.monthlySpend.toLocaleString()}</span>
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            Monthly Spend
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            ${billingStats.monthlySpend.toLocaleString()}
          </p>
        </div>

        <div className="bg-white dark:bg-purple-950/20 border border-gray-200 dark:border-purple-500/10 rounded-xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center">
              <Zap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400 text-sm font-medium">
              <ArrowUpRight className="h-4 w-4" />
              <span>+8%</span>
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            Total API Calls
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {billingStats.totalApiCalls.toLocaleString()}
          </p>
        </div>

        {/* NEXT BILLING - Changed from Cost Per Call */}
        <div className="bg-white dark:bg-purple-950/20 border border-gray-200 dark:border-purple-500/10 rounded-xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 flex items-center justify-center">
              <Calendar className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400 text-sm font-medium">
              <span>Avg</span>
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
            Next Billing
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {billingStats.nextBillingDate}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Usage Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-purple-950/20 border border-gray-200 dark:border-purple-500/10 rounded-xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Usage & Spending Trends
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Monthly breakdown of API usage and costs
              </p>
            </div>
            <div className="flex gap-2">
              {(["week", "month", "year"] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedPeriod(period)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    selectedPeriod === period
                      ? "bg-purple-600 text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Simple Bar Chart */}
          <div className="space-y-4">
            {usageData.map((data, index) => {
              const maxAmount = Math.max(...usageData.map((d) => d.amount));
              const percentage = (data.amount / maxAmount) * 100;

              return (
                <div key={data.month}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {data.month}
                    </span>
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {data.calls.toLocaleString()} calls
                      </span>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                        ${data.amount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="relative h-8 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                    <div
                      className="absolute left-0 top-0 h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* MONTHLY SUMMARY */}
        <div className="bg-white dark:bg-purple-950/20 border border-gray-200 dark:border-purple-500/10 rounded-xl p-6 backdrop-blur-sm">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
            Monthly Summary
          </h3>
          <div className="space-y-4">
            {monthlySummary.map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {item.label}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                      ${item.amount.toLocaleString()}.00
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-purple-500/10">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                TOTAL DUE
              </span>
              <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                ${totalDue.toLocaleString()}.00
              </span>
            </div>
            <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-lg transition-all shadow-lg flex items-center justify-center gap-2">
              <CreditCard className="h-5 w-5" />
              PAY NOW
            </button>

            {/* ── FILLS THE EMPTY SPACE BELOW PAY NOW ── */}
            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 dark:bg-purple-950/30 border border-gray-200 dark:border-purple-500/10">
                <Clock className="h-4 w-4 text-amber-500 flex-shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                    Next billing date
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {billingStats.nextBillingDate},{" "}
                    {billingStats.nextBillingYear}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 dark:bg-purple-950/30 border border-gray-200 dark:border-purple-500/10">
                <ShieldCheck className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Payments are encrypted &amp; secured via SSL
                </p>
              </div>
            </div>
            {/* ── END FILL ── */}
          </div>
        </div>
      </div>

      {/* Recent Invoices */}
      <div className="bg-white dark:bg-purple-950/20 border border-gray-200 dark:border-purple-500/10 rounded-xl p-6 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Recent Invoices
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              View and download your billing history
            </p>
          </div>
          <button className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors">
            View All →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-purple-500/10">
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Invoice ID
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Period
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {recentInvoices.map((invoice) => (
                <tr
                  key={invoice.id}
                  className="border-b border-gray-100 dark:border-purple-500/5 hover:bg-gray-50 dark:hover:bg-purple-500/5 transition-colors"
                >
                  <td className="py-4 px-4">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {invoice.id}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {invoice.period}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Calendar className="h-4 w-4" />
                      {invoice.date}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                      ${invoice.amount.toLocaleString()}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400">
                      <CheckCircle className="h-3 w-3" />
                      {invoice.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-500/10 rounded-lg transition-colors">
                      <Download className="h-4 w-4" />
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-white dark:bg-purple-950/20 border border-gray-200 dark:border-purple-500/10 rounded-xl p-6 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Payment Method
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Manage your billing information
            </p>
          </div>
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium">
            Update Payment Method
          </button>
        </div>

        <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-purple-950/30 rounded-lg border border-gray-200 dark:border-purple-500/10">
          <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
            <CreditCard className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              Visa ending in 4242
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Expires 12/2025
            </p>
          </div>
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
            <CheckCircle className="h-5 w-5" />
            <span className="text-sm font-medium">Active</span>
          </div>
        </div>
      </div>
    </div>
  );
}
