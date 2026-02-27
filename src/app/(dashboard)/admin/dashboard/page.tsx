"use client";

import Link from "next/link";
import {
  Users,
  Building2,
  DollarSign,
  Settings,
  TrendingUp,
  TrendingDown,
  Activity,
  Shield,
  Zap,
  ArrowRight,
  AlertTriangle,
  Database,
} from "lucide-react";

export default function AdminDashboardPage() {
  // Mock data - replace with actual API calls
  const stats = {
    totalClients: 24,
    activeUsers: "12,847",
    totalRevenue: "$45,320",
    systemUptime: "99.9%",
  };

  const quickActions = [
    {
      title: "Manage Clients",
      description: "Client Management & Onboarding",
      icon: Building2,
      href: "/admin/clients",
      color: "from-purple-500 to-pink-500",
      iconBg: "bg-purple-500/10",
      iconColor: "text-purple-400",
    },
    {
      title: "Platform Users",
      description: "View & Manage All Users",
      icon: Users,
      href: "/admin/users",
      color: "from-blue-500 to-cyan-500",
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-400",
    },
    {
      title: "Payment Controls",
      description: "Subscription & Billing",
      icon: DollarSign,
      href: "/admin/payments",
      color: "from-emerald-500 to-teal-500",
      iconBg: "bg-emerald-500/10",
      iconColor: "text-emerald-400",
    },
    {
      title: "Set Global Rules",
      description: "Probability Setter & Config",
      icon: Settings,
      href: "/admin/global-rules",
      color: "from-violet-500 to-purple-500",
      iconBg: "bg-violet-500/10",
      iconColor: "text-violet-400",
    },
    {
      title: "Security & Logs",
      description: "Audit Trails & Monitoring",
      icon: Shield,
      href: "/admin/security",
      color: "from-red-500 to-pink-500",
      iconBg: "bg-red-500/10",
      iconColor: "text-red-400",
    },
  ];

  const recentClients = [
    {
      name: "Casino Royale Tech",
      email: "api@casinoroyale.com",
      status: "active",
      date: "2026-01-15",
    },
    {
      name: "Global Spin Partners",
      email: "dev@globalspin.io",
      status: "active",
      date: "2026-02-10",
    },
    {
      name: "Lucky Games Inc",
      email: "tech@luckygames.com",
      status: "pending",
      date: "2026-02-20",
    },
    {
      name: "Mega Rewards Co",
      email: "api@megarewards.com",
      status: "active",
      date: "2026-02-25",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Admin Dashboard
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Platform control center - Manage clients, users, and global
          configurations.
        </p>
      </div>

      {/* System Alert */}
      <div className="bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-500/20 rounded-xl p-4 flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-yellow-900 dark:text-yellow-300">
            System Maintenance Scheduled
          </h3>
          <p className="text-sm text-yellow-700 dark:text-yellow-400 mt-1">
            Scheduled maintenance on March 1st, 2026 at 2:00 AM UTC. Expected
            downtime: 30 minutes.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-purple-950/20 border border-gray-200 dark:border-purple-500/10 rounded-xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total B2B Clients
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                {stats.totalClients}
              </p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-purple-500/10 dark:bg-purple-500/20 flex items-center justify-center">
              <Building2 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-emerald-500 mr-1" />
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">
              3 new this month
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-purple-950/20 border border-gray-200 dark:border-purple-500/10 rounded-xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Active Users
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                {stats.activeUsers}
              </p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Across all clients
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-purple-950/20 border border-gray-200 dark:border-purple-500/10 rounded-xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Revenue (MRR)
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                {stats.totalRevenue}
              </p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-emerald-500 mr-1" />
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">
              18% growth
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-purple-950/20 border border-gray-200 dark:border-purple-500/10 rounded-xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                System Uptime
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                {stats.systemUptime}
              </p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-orange-500/10 dark:bg-orange-500/20 flex items-center justify-center">
              <Zap className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
              All systems operational
            </span>
          </div>
        </div>
      </div>

      {/* Additional Platform Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-purple-600 to-purple-800 dark:from-purple-500/20 dark:to-purple-900/40 border border-purple-500/20 rounded-xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="h-12 w-12 rounded-lg bg-white/10 flex items-center justify-center">
              <Database className="h-6 w-6 text-white dark:text-purple-300" />
            </div>
            <div className="flex items-center gap-1 text-emerald-400">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm font-medium">+4%</span>
            </div>
          </div>
          <p className="text-sm font-medium text-purple-200 dark:text-purple-300 mb-1">
            Global Platform Reserve
          </p>
          <p className="text-3xl font-bold text-white dark:text-purple-100">
            $4,285,150.00
          </p>
        </div>

        <div className="bg-gradient-to-br from-blue-600 to-blue-800 dark:from-blue-500/20 dark:to-blue-900/40 border border-blue-500/20 rounded-xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="h-12 w-12 rounded-lg bg-white/10 flex items-center justify-center">
              <Activity className="h-6 w-6 text-white dark:text-blue-300" />
            </div>
            <div className="flex items-center gap-1 text-red-400">
              <TrendingDown className="h-4 w-4" />
              <span className="text-sm font-medium">-2.1%</span>
            </div>
          </div>
          <p className="text-sm font-medium text-blue-200 dark:text-blue-300 mb-1">
            Total Spins (24h)
          </p>
          <p className="text-3xl font-bold text-white dark:text-blue-100">
            1.2M
          </p>
        </div>

        <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 dark:from-emerald-500/20 dark:to-emerald-900/40 border border-emerald-500/20 rounded-xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="h-12 w-12 rounded-lg bg-white/10 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-white dark:text-emerald-300" />
            </div>
            <span className="text-xs text-emerald-200 dark:text-emerald-300 font-medium">
              Target: 95.0%
            </span>
          </div>
          <p className="text-sm font-medium text-emerald-200 dark:text-emerald-300 mb-1">
            Average Network RTP
          </p>
          <p className="text-3xl font-bold text-white dark:text-emerald-100">
            94.82%
          </p>
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

      {/* Recent Clients */}
      <div className="bg-white dark:bg-purple-950/20 border border-gray-200 dark:border-purple-500/10 rounded-xl p-6 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Recent B2B Clients
          </h2>
          <Link
            href="/admin/clients"
            className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
          >
            View All →
          </Link>
        </div>
        <div className="space-y-4">
          {recentClients.map((client, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-purple-500/10 last:border-0"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-purple-500/10 dark:bg-purple-500/20 flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {client.name}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {client.email}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    client.status === "active"
                      ? "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-400"
                      : "bg-yellow-100 dark:bg-yellow-500/10 text-yellow-800 dark:text-yellow-400"
                  }`}
                >
                  {client.status}
                </span>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {client.date}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
