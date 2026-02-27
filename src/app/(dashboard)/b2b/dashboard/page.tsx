"use client";

import Link from "next/link";
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
} from "lucide-react";

export default function B2BDashboardPage() {
  // Mock data - replace with actual API calls
  const stats = {
    totalSpins: "1,284,092",
    activeConfigs: 3,
    apiCalls24h: "45,320",
    successRate: "99.8%",
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
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Client Dashboard
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Welcome back! Manage your gamification engine and monitor performance.
        </p>
      </div>

      {/* API Key Warning */}
      <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl p-4 flex items-start gap-3">
        <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-red-900 dark:text-red-300">
            Missing or invalid B2B API Key
          </h3>
          <p className="text-sm text-red-700 dark:text-red-400 mt-1">
            Please configure it in Local Storage or contact Admin.
          </p>
        </div>
        <Link
          href="/b2b/api-keys"
          className="text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 whitespace-nowrap"
        >
          Configure Now →
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-purple-950/20 border border-gray-200 dark:border-purple-500/10 rounded-xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Spins (24h)
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                {stats.totalSpins}
              </p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-purple-500/10 dark:bg-purple-500/20 flex items-center justify-center">
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

        <div className="bg-white dark:bg-purple-950/20 border border-gray-200 dark:border-purple-500/10 rounded-xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Active Configurations
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                {stats.activeConfigs}
              </p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center">
              <Settings className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              2 pending review
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-purple-950/20 border border-gray-200 dark:border-purple-500/10 rounded-xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                API Calls (24h)
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                {stats.apiCalls24h}
              </p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center">
              <Key className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Avg latency: 42ms
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-purple-950/20 border border-gray-200 dark:border-purple-500/10 rounded-xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Success Rate
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                {stats.successRate}
              </p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-orange-500/10 dark:bg-orange-500/20 flex items-center justify-center">
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

      {/* Quick Actions */}
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
                className="group bg-white dark:bg-purple-950/20 border border-gray-200 dark:border-purple-500/10 rounded-xl p-6 hover:shadow-lg hover:scale-[1.02] transition-all duration-200 backdrop-blur-sm"
              >
                <div className="flex items-start justify-between">
                  <div
                    className={`h-12 w-12 rounded-lg ${action.iconBg} flex items-center justify-center`}
                  >
                    <Icon className={`h-6 w-6 ${action.iconColor}`} />
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 dark:text-gray-500 group-hover:text-purple-500 dark:group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-4">
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

      {/* Recent Activity */}
      <div className="bg-white dark:bg-purple-950/20 border border-gray-200 dark:border-purple-500/10 rounded-xl p-6 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Recent Activity
          </h2>
          <Link
            href="/b2b/transactions"
            className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
          >
            View All →
          </Link>
        </div>
        <div className="space-y-4">
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
              className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-purple-500/10 last:border-0"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-purple-500/10 dark:bg-purple-500/20 flex items-center justify-center">
                  <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {activity.user}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Won: {activity.reward}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-400">
                  {activity.status}
                </span>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
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
