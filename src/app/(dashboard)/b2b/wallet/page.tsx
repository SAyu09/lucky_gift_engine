// src/app/(dashboard)/b2b/wallet/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Wallet, Loader2, CheckCircle, XCircle, Key, Sparkles } from "lucide-react";
import { useToastStore } from "@/store/useToastStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useAuth } from "@/hooks/api/useAuth";
import { apiClient } from "@/lib/apiClient";
import { PaymentStatus } from "@/types/auth.types";

interface RechargeResponse {
  success: boolean;
  message?: string;
  data: {
    checkoutUrl: string;
    sessionId: string;
  };
}

interface ConfirmResponse {
  success: boolean;
  message: string;
  data: {
    unlocked: boolean;
    hasTestKey: boolean;
    hasLiveKey: boolean;
    walletBalance: number;
  };
}

export default function B2BWalletPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { addToast } = useToastStore();
  const { user } = useAuthStore();
  const { getMe } = useAuth();

  const [selectedAmount, setSelectedAmount] = useState<number | null>(10);
  const [customAmount, setCustomAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [confirmResult, setConfirmResult] = useState<ConfirmResponse["data"] | null>(null);
  const [paymentCanceled, setPaymentCanceled] = useState(false);

  const quickAmounts = [10, 25, 50, 100, 250];

  // ── Handle Stripe redirect back ──────────────────────────────────────────────
  const handleConfirm = useCallback(async (sessionId: string) => {
    setIsConfirming(true);
    try {
      const response = await apiClient.post<ConfirmResponse>("/payments/confirm", { sessionId });
      const result = response.data.data;
      setConfirmResult(result);

      if (result.unlocked) {
        // Refresh user state so the paywall lifts immediately without a manual refresh
        await getMe();
        addToast("🎉 API Suite unlocked! Your Test & Live keys are ready.", "success");
      } else {
        addToast("Payment verified. Contact support if access is not granted.", "warning");
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        "Failed to confirm payment. Please contact support.";
      addToast(msg, "error");
    } finally {
      setIsConfirming(false);
      // Clean up URL query params without a full page reload
      router.replace("/b2b/wallet");
    }
  }, [getMe, addToast, router]);

  useEffect(() => {
    const success = searchParams.get("success");
    const canceled = searchParams.get("canceled");
    const sessionId = searchParams.get("session_id");

    if (success === "true" && sessionId) {
      handleConfirm(sessionId);
    } else if (canceled === "true") {
      setPaymentCanceled(true);
      addToast("Payment was canceled. No charges were made.", "info");
      router.replace("/b2b/wallet");
    }
  }, [searchParams, handleConfirm, addToast, router]);

  // ── Initiate Stripe Checkout ────────────────────────────────────────────────
  const handlePayment = async () => {
    if (!selectedAmount) return;
    setIsProcessing(true);
    try {
      const response = await apiClient.post<RechargeResponse>("/payments/recharge", {
        amount: selectedAmount,
      });
      const { checkoutUrl } = response.data.data;
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        throw new Error("No checkout URL received from server.");
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to initiate payment. Please try again.";
      addToast(errorMessage, "error");
      setIsProcessing(false);
    }
  };

  const isAlreadyPaid = user?.paymentStatus === PaymentStatus.PAID;

  // ── Confirming state ────────────────────────────────────────────────────────
  if (isConfirming) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur-2xl opacity-40 scale-110" />
          <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 p-6 rounded-3xl shadow-2xl">
            <Loader2 className="h-12 w-12 text-white animate-spin" />
          </div>
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Confirming Payment...
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Verifying with Stripe and generating your API keys. Please wait.
          </p>
        </div>
      </div>
    );
  }

  // ── Already unlocked ────────────────────────────────────────────────────────
  if (isAlreadyPaid || confirmResult?.unlocked) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl blur-2xl opacity-40 scale-110" />
          <div className="relative bg-gradient-to-r from-emerald-500 to-teal-500 p-6 rounded-3xl shadow-2xl">
            <CheckCircle className="h-12 w-12 text-white" />
          </div>
        </div>
        <div className="text-center max-w-md">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm font-semibold mb-4">
            <Sparkles className="h-3.5 w-3.5" />
            API Suite Active
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Developer Suite Unlocked!
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Your Test & Live API keys have been generated. Head to the API &
            Developer section to view and use them.
          </p>
          <div className="mt-6 flex gap-3 justify-center">
            <button
              onClick={() => router.push("/b2b/api-keys")}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-500 hover:to-pink-500 transition-all shadow-lg shadow-purple-500/30"
            >
              <Key className="h-5 w-5" />
              View API Keys
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Payment form ────────────────────────────────────────────────────────────
  return (
    <div className="space-y-4 sm:space-y-6 pb-10">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          Unlock API Suite
        </h1>
        <p className="mt-1 sm:mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-400">
          One-time payment to unlock Test & Live API keys, webhook
          configuration, and full engine access.
        </p>
      </div>

      {paymentCanceled && (
        <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl">
          <XCircle className="h-5 w-5 text-red-500 shrink-0" />
          <p className="text-sm text-red-700 dark:text-red-400 font-medium">
            Payment was canceled. No charges were made. You can try again
            anytime.
          </p>
        </div>
      )}

      <div className="max-w-lg mx-auto">
        <div className="bg-white dark:bg-purple-950/20 border border-gray-200 dark:border-purple-500/10 rounded-xl p-6 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-6">
            <Wallet className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Choose Amount (USD)
            </h3>
          </div>

          {/* Custom amount input */}
          <div className="mb-5">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-gray-400">
                $
              </span>
              <input
                type="text"
                value={customAmount || selectedAmount || ""}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, "");
                  setCustomAmount(value);
                  setSelectedAmount(value ? parseInt(value) : null);
                }}
                placeholder="10"
                disabled={isProcessing}
                className="w-full bg-gray-50 dark:bg-purple-950/30 border border-gray-200 dark:border-purple-500/20 rounded-lg pl-12 pr-4 py-4 text-2xl font-semibold text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 transition-colors"
              />
            </div>
          </div>

          {/* Quick amounts */}
          <div className="flex flex-wrap gap-2 mb-6">
            {quickAmounts.map((amount) => (
              <button
                key={amount}
                type="button"
                disabled={isProcessing}
                onClick={() => {
                  setSelectedAmount(amount);
                  setCustomAmount("");
                }}
                className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                  selectedAmount === amount
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-500/30"
                    : "bg-gray-100 dark:bg-purple-950/30 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-purple-500/20"
                }`}
              >
                ${amount}
              </button>
            ))}
          </div>

          {/* Pay button */}
          <button
            type="button"
            disabled={!selectedAmount || selectedAmount < 10 || isProcessing}
            onClick={handlePayment}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-6 rounded-xl transition-all shadow-lg shadow-purple-500/30 disabled:shadow-none flex items-center justify-center gap-2 disabled:cursor-not-allowed text-lg"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-6 w-6 animate-spin" />
                Connecting to Stripe...
              </>
            ) : (
              <>
                <Key className="h-6 w-6" />
                Pay ${selectedAmount?.toLocaleString() || "0"} & Unlock API Suite
              </>
            )}
          </button>

          {selectedAmount && selectedAmount < 10 && (
            <p className="text-xs text-red-500 mt-2 text-center">
              Minimum amount is $10
            </p>
          )}

          <p className="text-xs text-center text-gray-400 dark:text-gray-500 mt-4">
            🔒 Payments are secured via Stripe. One-time unlock — no recurring charges.
          </p>
        </div>
      </div>
    </div>
  );
}
