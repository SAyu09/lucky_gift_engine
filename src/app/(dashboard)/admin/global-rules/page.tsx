"use client";

import { Settings, Sliders, Shield } from "lucide-react";

export default function GlobalRulesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Set Global Rules
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Probability Setter & Global Configuration
        </p>
      </div>

      <div className="bg-white dark:bg-purple-950/20 border border-gray-200 dark:border-purple-500/10 rounded-xl p-12 text-center backdrop-blur-sm">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-500/10 dark:bg-purple-500/20 mb-4">
          <Sliders className="h-8 w-8 text-purple-600 dark:text-purple-400" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Global Probability Rules
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
          Configure system-wide probability rules and constraints. Coming soon!
        </p>
      </div>
    </div>
  );
}
