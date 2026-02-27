"use client";

import { CreditCard, Receipt, TrendingUp } from "lucide-react";

export default function BillingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Billing Controls
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Usage & Billing Reports
        </p>
      </div>

      <div className="bg-white dark:bg-purple-950/20 border border-gray-200 dark:border-purple-500/10 rounded-xl p-12 text-center backdrop-blur-sm">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-500/10 dark:bg-purple-500/20 mb-4">
          <CreditCard className="h-8 w-8 text-purple-600 dark:text-purple-400" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Billing & Usage Reports
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
          Track your usage and manage billing. Coming soon!
        </p>
      </div>
    </div>
  );
}
