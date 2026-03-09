"use client";

import { useState } from "react";
import {
  Target,
  Percent,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  RefreshCw,
  Save,
  RotateCcw,
  Shield,
  Activity,
  Zap,
} from "lucide-react";

export default function GlobalRulesPage() {
  // RTP Target
  const [rtpPercentage, setRtpPercentage] = useState(95);

  // Probability Rules
  const [probabilities, setProbabilities] = useState({
    common: 70,
    rare: 20,
    epic: 8,
    legendary: 2,
  });

  // Global Limits
  const [limits, setLimits] = useState({
    maxWinMultiplier: 5000,
    maxPayoutPerSpin: 25000,
    dailyGlobalPayoutLimit: 1000000,
    clientRiskThreshold: 15,
  });

  // System Controls
  const [systemControls, setSystemControls] = useState({
    autoPoolRebalance: true,
    fraudDetection: true,
    rtpStabilization: true,
    riskMonitoring: false,
  });

  const totalProbability = Object.values(probabilities).reduce(
    (a, b) => a + b,
    0,
  );
  const isProbabilityValid = totalProbability === 100;

  const handleProbabilityChange = (
    key: keyof typeof probabilities,
    value: number,
  ) => {
    setProbabilities((prev) => ({ ...prev, [key]: value }));
  };

  const handleLimitChange = (key: keyof typeof limits, value: number) => {
    setLimits((prev) => ({ ...prev, [key]: value }));
  };

  const handleSystemToggle = (key: keyof typeof systemControls) => {
    setSystemControls((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleResetToDefault = () => {
    setRtpPercentage(95);
    setProbabilities({ common: 70, rare: 20, epic: 8, legendary: 2 });
    setLimits({
      maxWinMultiplier: 5000,
      maxPayoutPerSpin: 25000,
      dailyGlobalPayoutLimit: 1000000,
      clientRiskThreshold: 15,
    });
  };

  const handleSaveChanges = () => {
    // API call to save changes
    console.log("Saving changes...", {
      rtpPercentage,
      probabilities,
      limits,
      systemControls,
    });
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Global Engine Rules
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Configure platform-wide probability settings, RTP targets, and
            reserve pool management.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleResetToDefault}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center gap-2 text-sm font-medium"
          >
            <RotateCcw className="h-4 w-4" />
            Reset to Default
          </button>
          <button
            onClick={handleSaveChanges}
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all flex items-center gap-2 text-sm font-bold shadow-lg"
          >
            <Save className="h-4 w-4" />
            Save Global Rules
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Global RTP Target */}
        <div className="bg-white dark:bg-purple-950/20 border border-gray-200 dark:border-purple-500/10 rounded-xl p-6 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-lg bg-purple-500/10 dark:bg-purple-500/20 flex items-center justify-center">
              <Target className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Global RTP Target
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Controls the average payout percentage across all spin events.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  RTP Percentage
                </label>
                <div className="flex items-center gap-2 bg-purple-500/10 dark:bg-purple-500/20 px-3 py-1 rounded-lg">
                  <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {rtpPercentage}
                  </span>
                  <Percent className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <input
                type="range"
                min="80"
                max="99"
                value={rtpPercentage}
                onChange={(e) => setRtpPercentage(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />
            </div>

            <div className="bg-gray-50 dark:bg-purple-950/30 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  PLAYER WIN %
                </span>
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  PLATFORM RESERVE %
                </span>
              </div>
              <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="absolute left-0 top-0 h-full bg-gradient-to-r from-purple-500 to-pink-500"
                  style={{ width: `${rtpPercentage}%` }}
                />
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
                  {rtpPercentage}.0%
                </span>
                <span className="text-sm font-bold text-gray-600 dark:text-gray-400">
                  {100 - rtpPercentage}.0%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Global Probability Rules */}
        <div className="bg-white dark:bg-purple-950/20 border border-gray-200 dark:border-purple-500/10 rounded-xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-pink-500/10 dark:bg-pink-500/20 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-pink-600 dark:text-pink-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Global Probability Rules
                </h3>
              </div>
            </div>
            <div
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                isProbabilityValid
                  ? "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400"
                  : "bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400"
              }`}
            >
              Total: {totalProbability}%{" "}
              {isProbabilityValid ? "Valid" : "Invalid"}
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2 block">
                  Common
                </label>
                <input
                  type="number"
                  value={probabilities.common}
                  onChange={(e) =>
                    handleProbabilityChange("common", Number(e.target.value))
                  }
                  className="w-full bg-gray-50 dark:bg-purple-950/30 border border-gray-200 dark:border-purple-500/20 rounded-lg px-4 py-2.5 text-gray-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2 block">
                  Rare
                </label>
                <input
                  type="number"
                  value={probabilities.rare}
                  onChange={(e) =>
                    handleProbabilityChange("rare", Number(e.target.value))
                  }
                  className="w-full bg-gray-50 dark:bg-purple-950/30 border border-gray-200 dark:border-purple-500/20 rounded-lg px-4 py-2.5 text-gray-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2 block">
                  Epic
                </label>
                <input
                  type="number"
                  value={probabilities.epic}
                  onChange={(e) =>
                    handleProbabilityChange("epic", Number(e.target.value))
                  }
                  className="w-full bg-gray-50 dark:bg-purple-950/30 border border-gray-200 dark:border-purple-500/20 rounded-lg px-4 py-2.5 text-gray-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2 block">
                  Legendary
                </label>
                <input
                  type="number"
                  value={probabilities.legendary}
                  onChange={(e) =>
                    handleProbabilityChange("legendary", Number(e.target.value))
                  }
                  className="w-full bg-gray-50 dark:bg-purple-950/30 border border-gray-200 dark:border-purple-500/20 rounded-lg px-4 py-2.5 text-gray-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 via-purple-500 via-pink-500 to-amber-500" />
            </div>
          </div>
        </div>

        {/* Reserve Pool Controls */}
        <div className="bg-white dark:bg-purple-950/20 border border-gray-200 dark:border-purple-500/10 rounded-xl p-6 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Reserve Pool Controls
              </h3>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 rounded-xl p-6 mb-6 border border-emerald-200 dark:border-emerald-500/20">
            <p className="text-xs text-emerald-600 dark:text-emerald-400 uppercase tracking-wide font-semibold mb-2">
              Total Pool Balance
            </p>
            <p className="text-4xl font-bold text-emerald-900 dark:text-emerald-300">
              $4,285,150
              <span className="text-2xl text-emerald-600 dark:text-emerald-400">
                .00
              </span>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm font-medium">
              <RefreshCw className="h-4 w-4" />
              Rebalance Pool
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm font-medium">
              <RotateCcw className="h-4 w-4" />
              Reset Allocation
            </button>
          </div>

          <button className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-3 bg-red-500/10 dark:bg-red-500/20 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-500/20 dark:hover:bg-red-500/30 transition-colors text-sm font-bold border border-red-200 dark:border-red-500/30">
            <AlertTriangle className="h-4 w-4" />
            EMERGENCY STOP REWARDS
          </button>
        </div>

        {/* Global Limits */}
        <div className="bg-white dark:bg-purple-950/20 border border-gray-200 dark:border-purple-500/10 rounded-xl p-6 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-lg bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center">
              <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Global Limits
              </h3>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2 block">
                  Max Win Multiplier
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    ×
                  </span>
                  <input
                    type="number"
                    value={limits.maxWinMultiplier}
                    onChange={(e) =>
                      handleLimitChange(
                        "maxWinMultiplier",
                        Number(e.target.value),
                      )
                    }
                    className="w-full bg-gray-50 dark:bg-purple-950/30 border border-gray-200 dark:border-purple-500/20 rounded-lg pl-8 pr-4 py-2.5 text-gray-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2 block">
                  Max Payout Per Spin
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    $
                  </span>
                  <input
                    type="number"
                    value={limits.maxPayoutPerSpin}
                    onChange={(e) =>
                      handleLimitChange(
                        "maxPayoutPerSpin",
                        Number(e.target.value),
                      )
                    }
                    className="w-full bg-gray-50 dark:bg-purple-950/30 border border-gray-200 dark:border-purple-500/20 rounded-lg pl-8 pr-4 py-2.5 text-gray-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2 block">
                  Daily Global Payout Limit
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    $
                  </span>
                  <input
                    type="number"
                    value={limits.dailyGlobalPayoutLimit}
                    onChange={(e) =>
                      handleLimitChange(
                        "dailyGlobalPayoutLimit",
                        Number(e.target.value),
                      )
                    }
                    className="w-full bg-gray-50 dark:bg-purple-950/30 border border-gray-200 dark:border-purple-500/20 rounded-lg pl-8 pr-4 py-2.5 text-gray-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2 block">
                  Client Risk Threshold %
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={limits.clientRiskThreshold}
                    onChange={(e) =>
                      handleLimitChange(
                        "clientRiskThreshold",
                        Number(e.target.value),
                      )
                    }
                    className="w-full bg-gray-50 dark:bg-purple-950/30 border border-gray-200 dark:border-purple-500/20 rounded-lg px-4 py-2.5 text-gray-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    %
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* System Controls */}
      <div className="bg-white dark:bg-purple-950/20 border border-gray-200 dark:border-purple-500/10 rounded-xl p-6 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-lg bg-indigo-500/10 dark:bg-indigo-500/20 flex items-center justify-center">
            <Zap className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              System Controls
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              key: "autoPoolRebalance",
              label: "Auto Pool Rebalance",
              desc: "Dynamically adjust based on volume",
              icon: RefreshCw,
            },
            {
              key: "fraudDetection",
              label: "Fraud Detection",
              desc: "AI-driven pattern recognition",
              icon: Shield,
            },
            {
              key: "rtpStabilization",
              label: "RTP Stabilization",
              desc: "Smoothen payout variance",
              icon: Activity,
            },
            {
              key: "riskMonitoring",
              label: "Risk Monitoring",
              desc: "Real-time exposure alerts",
              icon: AlertTriangle,
            },
          ].map((control) => {
            const Icon = control.icon;
            const isEnabled =
              systemControls[control.key as keyof typeof systemControls];

            return (
              <div
                key={control.key}
                className="bg-gray-50 dark:bg-purple-950/30 rounded-xl p-4 border border-gray-200 dark:border-purple-500/10"
              >
                <div className="flex items-start justify-between mb-3">
                  <Icon
                    className={`h-5 w-5 ${isEnabled ? "text-purple-600 dark:text-purple-400" : "text-gray-400"}`}
                  />
                  <button
                    onClick={() =>
                      handleSystemToggle(
                        control.key as keyof typeof systemControls,
                      )
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      isEnabled
                        ? "bg-purple-600"
                        : "bg-gray-300 dark:bg-gray-600"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        isEnabled ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-1">
                  {control.label}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {control.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="bg-white dark:bg-purple-950/20 border border-gray-200 dark:border-purple-500/10 rounded-xl p-4 backdrop-blur-sm flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <Activity className="h-4 w-4" />
          <span>Last updated: Oct 24, 2023 - 14:32 PM by System</span>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm font-medium">
            Reset Changes
          </button>
          <button className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all text-sm font-bold shadow-lg">
            Confirm & Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
