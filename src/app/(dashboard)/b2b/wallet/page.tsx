"use client";

import { useState } from "react";
import { Wallet, TrendingUp, Loader2 } from "lucide-react";
import { useToastStore } from "@/store/useToastStore";
import { apiClient } from "@/lib/apiClient";

export default function B2BWalletPage() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(10000);
  const [customAmount, setCustomAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const { addToast } = useToastStore();

  const quickAmounts = [1000, 5000, 10000, 25000, 50000];

  const handlePayment = async () => {
    if (!selectedAmount) return;

    setIsProcessing(true);
    try {
      // Send the selected amount to the API
      const response = await apiClient.post<{
        checkoutUrl: string;
        sessionId: string;
      }>("/payments/initiate", { amount: selectedAmount });

      const { checkoutUrl } = response.data;

      // Redirect to Stripe checkout
      window.location.href = checkoutUrl;
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Failed to initiate payment. Please try again.";
      const errorCode = error?.response?.data?.code;

      console.error("Payment error:", {
        status: error?.response?.status,
        data: error?.response?.data,
        message: errorMessage,
        code: errorCode,
      });

      addToast(
        errorCode === "INTERNAL_SERVER_ERROR"
          ? "Payment service error. Please contact support or try again later."
          : errorMessage,
        "error",
      );
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          Add Funds to Wallet
        </h1>
        <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-400">
          Top up your wallet balance
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
        {/* Available Balance Card */}
        <div className="bg-gradient-to-br from-purple-900/40 to-purple-950/60 dark:from-purple-900/30 dark:to-purple-950/40 border border-purple-500/20 rounded-xl p-4 sm:p-6 backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
            <div className="flex-1 w-full">
              <p className="text-xs sm:text-sm text-gray-400 dark:text-purple-300 uppercase tracking-wide mb-2">
                Available Balance
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                ₹54,320
              </h2>
              <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
                <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-400" />
                <span className="text-green-400 font-medium">+12.5%</span>
                <span className="text-gray-400 text-xs sm:text-sm">
                  Last update: 2 mins ago
                </span>
              </div>
            </div>
            <div className="bg-purple-500/10 p-3 sm:p-4 rounded-lg self-start">
              <Wallet className="h-6 w-6 sm:h-8 sm:w-8 text-purple-400" />
            </div>
          </div>
        </div>

        {/* Enter Amount Section */}
        <div className="bg-white dark:bg-purple-950/20 border border-gray-200 dark:border-purple-500/10 rounded-xl p-4 sm:p-6 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-4">
            <Wallet className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 dark:text-purple-400" />
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
              Enter Amount
            </h3>
          </div>

          <div className="mb-4 sm:mb-6">
            <div className="relative">
              <span className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-xl sm:text-2xl text-gray-400">
                ₹
              </span>
              <input
                type="text"
                value={customAmount || selectedAmount || ""}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, "");
                  setCustomAmount(value);
                  setSelectedAmount(value ? parseInt(value) : null);
                }}
                placeholder="0.00"
                className="w-full bg-gray-50 dark:bg-purple-950/30 border border-gray-200 dark:border-purple-500/20 rounded-lg pl-10 sm:pl-12 pr-4 py-3 sm:py-4 text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 sm:gap-3 mb-6">
            {quickAmounts.map((amount) => (
              <button
                key={amount}
                type="button"
                onClick={() => {
                  setSelectedAmount(amount);
                  setCustomAmount("");
                }}
                className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg text-sm sm:text-base font-medium transition-all ${
                  selectedAmount === amount
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-500/30"
                    : "bg-gray-100 dark:bg-purple-950/30 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-purple-500/20"
                }`}
              >
                ₹{amount.toLocaleString()}
              </button>
            ))}
          </div>

          {/* Pay Button */}
          <button
            type="button"
            disabled={!selectedAmount || isProcessing}
            onClick={handlePayment}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3.5 sm:py-4 px-6 rounded-lg transition-all shadow-lg shadow-purple-500/30 disabled:shadow-none flex items-center justify-center gap-2 disabled:cursor-not-allowed text-base sm:text-lg"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-5 w-5 sm:h-6 sm:w-6 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Wallet className="h-5 w-5 sm:h-6 sm:w-6" />
                Pay ₹{selectedAmount?.toLocaleString() || "0"}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="max-w-4xl mx-auto bg-white dark:bg-purple-950/20 border border-gray-200 dark:border-purple-500/10 rounded-xl p-4 sm:p-6 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 mb-4">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
            Recent Wallet Transactions
          </h3>
          <button
            type="button"
            className="text-xs sm:text-sm text-purple-600 dark:text-purple-400 hover:underline font-medium self-start sm:self-auto"
          >
            View All History
          </button>
        </div>
        <div className="text-center py-6 sm:py-8 text-sm sm:text-base text-gray-500 dark:text-gray-400">
          No recent transactions
        </div>
      </div>
    </div>
  );
}
