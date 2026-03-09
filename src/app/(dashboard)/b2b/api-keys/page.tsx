// src/app/(dashboard)/b2b/api-keys/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useB2B } from "@/hooks/api/useB2B";
import { useAuthStore } from "@/store/useAuthStore";
import { useToastStore } from "@/store/useToastStore";
import { PaymentStatus } from "@/types/auth.types";
import { useAuth } from "@/hooks/api/useAuth";
import {
  Key,
  Copy,
  Eye,
  EyeOff,
  Save,
  Check,
  Zap,
  Code,
  ExternalLink,
  Lock,
  Loader2,
  Shield,
  CreditCard,
  Sparkles,
  Webhook,
  Mail
} from "lucide-react";

// ─── Locked / Paywall State ────────────────────────────────────────────────────
function LockedPaywallUI() {
  const { initiatePayment, isLoading } = useB2B();
  const { addToast } = useToastStore();

  const handlePay = async () => {
    try {
      const result = await initiatePayment();
      if (result?.checkoutUrl) {
        window.location.href = result.checkoutUrl;
      } else {
        addToast("Could not retrieve payment URL. Please try again.", "error");
      }
    } catch (err) {
      const e = err as { message?: string };
      addToast(e.message ?? "Payment initiation failed.", "error");
    }
  };

  const features = [
    { icon: Key, label: "System-generated Test & Live API Keys", color: "text-purple-400" },
    { icon: Webhook, label: "Webhook endpoint configuration & Secrets", color: "text-blue-400" },
    { icon: Code, label: "Full API documentation & code samples", color: "text-emerald-400" },
    { icon: Shield, label: "Signature verification guides", color: "text-amber-400" },
    { icon: Zap, label: "Live engine spin execution", color: "text-pink-400" },
  ];

  return (
    <div className="relative min-h-[80vh] flex flex-col items-center justify-center py-10">
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl select-none">
        <div className="blur-sm opacity-30 space-y-4 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-purple-950/20 border border-gray-200 dark:border-purple-500/10 rounded-xl p-6 h-48" />
            <div className="bg-white dark:bg-purple-950/20 border border-gray-200 dark:border-purple-500/10 rounded-xl p-6 h-48" />
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/60 to-white/90 dark:from-[#0d0916]/40 dark:via-[#0d0916]/60 dark:to-[#0d0916]/90" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-8 max-w-lg w-full text-center">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur-2xl opacity-40 scale-110" />
          <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 p-6 rounded-3xl shadow-2xl">
            <Lock className="h-12 w-12 text-white" />
          </div>
        </div>

        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 dark:bg-purple-500/20 border border-purple-500/20 text-purple-600 dark:text-purple-300 text-sm font-semibold">
            <Sparkles className="h-3.5 w-3.5" />
            API Access Locked
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Unlock Your Developer Suite
          </h1>
          <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed">
            One-time activation unlocks your system-generated API keys, webhook configurations,
            and complete integration guides. Pay once, use forever.
          </p>
        </div>

        <div className="w-full bg-white dark:bg-purple-950/20 border border-gray-200 dark:border-purple-500/20 rounded-2xl p-5 space-y-3 text-left">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">
            What you unlock
          </p>
          {features.map(({ icon: Icon, label, color }) => (
            <div key={label} className="flex items-center gap-3">
              <div className="flex-shrink-0 h-7 w-7 rounded-lg bg-gray-100 dark:bg-white/10 flex items-center justify-center">
                <Icon className={`h-3.5 w-3.5 ${color}`} />
              </div>
              <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
            </div>
          ))}
        </div>

        <div className="w-full space-y-3">
          <button
            onClick={handlePay}
            disabled={isLoading}
            className="group relative w-full flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-xl text-base font-bold shadow-xl shadow-purple-500/30 hover:shadow-purple-500/50 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Redirecting to Stripe…
              </>
            ) : (
              <>
                <CreditCard className="h-5 w-5" />
                Pay with Stripe — Unlock Access
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Unlocked / Full Developer UI ─────────────────────────────────────────────
function UnlockedAPIUI() {
  const { updateWebhook, isLoading } = useB2B();
  const { addToast } = useToastStore();
  const { user } = useAuthStore();
  const { getMe } = useAuth(); // Refresh state to pull fresh decrypted keys and webhooks

  // ─── Environment State ───
  const [mode, setMode] = useState<'test' | 'live'>('test');

  // ─── Credentials from Backend (Completely independent of localStorage) ───
  const credentials = user?.clientCredentials;
  const hasApiKey = mode === 'test' ? credentials?.hasTestApiKey : credentials?.hasLiveApiKey;
  
  // Directly pull the AES decrypted key sent by the /me API
  const rawApiKeyValue = mode === 'test' ? credentials?.testApiKey : credentials?.liveApiKey;

  const activeWebhookUrl = mode === 'test' ? credentials?.testWebhookUrl : credentials?.liveWebhookUrl;
  const activeWebhookSecret = mode === 'test' ? credentials?.testWebhookSecret : credentials?.liveWebhookSecret;

  // ─── UI States ───
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKeyCopied, setApiKeyCopied] = useState(false);

  const [webhookUrl, setWebhookUrl] = useState("");
  const [showSecret, setShowSecret] = useState(false);
  const [secretCopied, setSecretCopied] = useState(false);

  // Sync inputs when switching Test/Live tabs
  useEffect(() => {
    setWebhookUrl(activeWebhookUrl || "");
    setShowSecret(false); 
    setShowApiKey(false);
  }, [mode, activeWebhookUrl]);

  const handleCopyApiKey = () => {
    if (!rawApiKeyValue) return;
    navigator.clipboard.writeText(rawApiKeyValue);
    setApiKeyCopied(true);
    setTimeout(() => setApiKeyCopied(false), 2000);
  };

  const handleSaveWebhook = async () => {
    if (!webhookUrl.startsWith("http")) {
      addToast("Webhook URL must start with http or https.", "error");
      return;
    }
    try {
      await updateWebhook(webhookUrl, mode);
      await getMe(); // Pull new webhookSecret from backend
      addToast(`${mode === 'test' ? 'Test' : 'Live'} Webhook saved! Secret generated.`, "success");
      setShowSecret(true); 
    } catch (err) {
      addToast("Failed to update webhook URL.", "error");
    }
  };

  const handleCopySecret = () => {
    if (!activeWebhookSecret) return;
    navigator.clipboard.writeText(activeWebhookSecret);
    setSecretCopied(true);
    setTimeout(() => setSecretCopied(false), 2000);
  };

  const payloadExample = {
    event: "spin.completed",
    environment: mode,
    timestamp: new Date().toISOString(),
    data: {
      transactionId: "txn_f723b9k...",
      giftId: 12,
      userId: 9821,
      betAmount: 100,
      winAmount: 500,
      multiplier: 5,
    },
  };

  return (
    <div className="space-y-8 pb-10">
      {/* ─── Header & Mode Toggle ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">API &amp; Webhooks</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            System-generated credentials and integration documentation.
          </p>
        </div>
        
        <div className="flex bg-gray-100 dark:bg-purple-950/40 p-1.5 rounded-xl border border-gray-200 dark:border-purple-500/20">
          <button 
            onClick={() => setMode('test')}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${mode === 'test' ? 'bg-amber-500 text-white shadow-md' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'}`}
          >
            Test Mode
          </button>
          <button 
            onClick={() => setMode('live')}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${mode === 'live' ? 'bg-emerald-500 text-white shadow-md' : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'}`}
          >
            Live Mode
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* ─── API Key Card (Securely Decrypted by Backend) ─── */}
        <div className={`border rounded-2xl p-6 transition-colors ${mode === 'test' ? 'bg-amber-50/30 border-amber-200' : 'bg-emerald-50/30 border-emerald-200'} dark:bg-[#1a1025] flex flex-col justify-between`}>
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${mode === 'test' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>
                <Key className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{mode === 'test' ? 'Test' : 'Live'} API Key</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="relative flex h-2.5 w-2.5">
                    {hasApiKey && <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${mode === 'test' ? 'bg-amber-400' : 'bg-emerald-400'}`}></span>}
                    <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${hasApiKey ? (mode === 'test' ? 'bg-amber-500' : 'bg-emerald-500') : 'bg-gray-400'}`}></span>
                  </span>
                  <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    {hasApiKey ? 'Active & Verified' : 'Pending Generation'}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="px-3 py-2 bg-white dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl flex items-center gap-3">
                <Lock className="h-5 w-5 text-gray-400 flex-shrink-0 ml-1" />
                
                {/* Secure rendering of the raw key */}
                <div className="flex-1 text-sm font-mono text-gray-600 dark:text-gray-300 truncate">
                  {hasApiKey && rawApiKeyValue
                    ? (showApiKey ? rawApiKeyValue : '••••••••••••••••••••••••••••••••••••••••••••') 
                    : 'Awaiting system generation...'}
                </div>
                
                {hasApiKey && rawApiKeyValue && (
                  <div className="flex items-center gap-1 border-l border-gray-200 dark:border-white/10 pl-2">
                    <button onClick={() => setShowApiKey(!showApiKey)} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors" title={showApiKey ? "Hide Key" : "Reveal Key"}>
                      {showApiKey ? <EyeOff className="h-4 w-4 text-gray-500 dark:text-gray-400" /> : <Eye className="h-4 w-4 text-gray-500 dark:text-gray-400" />}
                    </button>
                    <button onClick={handleCopyApiKey} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors" title="Copy Key">
                      {apiKeyCopied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4 text-gray-500 dark:text-gray-400" />}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-gray-200 dark:border-white/10">
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${mode === 'test' ? 'bg-amber-100/50' : 'bg-emerald-100/50'} dark:bg-white/5`}>
                <Mail className={`h-4 w-4 ${mode === 'test' ? 'text-amber-600' : 'text-emerald-600'} dark:text-white/60`} />
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                Your system-generated API key has been securely linked to your account. Include it in the <code className="bg-gray-100 dark:bg-black/40 px-1 rounded font-mono">x-api-key</code> header for all server-side requests.
              </p>
            </div>
          </div>
        </div>

        {/* ─── Webhook Configuration Card ─── */}
        <div className={`border rounded-2xl p-6 transition-colors ${mode === 'test' ? 'bg-amber-50/30 border-amber-200' : 'bg-emerald-50/30 border-emerald-200'} dark:bg-[#1a1025]`}>
          <div className="flex items-center gap-3 mb-6">
            <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${mode === 'test' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>
              <Webhook className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{mode === 'test' ? 'Test' : 'Live'} Webhook</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Receive real-time spin results</p>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-2">Endpoint URL</label>
              <input
                type="url"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://api.yourdomain.com/lucky-callback"
                className="w-full px-4 py-3 bg-white dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white shadow-sm"
              />
            </div>

            <button
              onClick={handleSaveWebhook}
              disabled={isLoading || !webhookUrl.startsWith("http")}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition-all shadow-md active:scale-[0.98]"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {isLoading ? "Saving..." : "Save Webhook Endpoint"}
            </button>

            {/* 🟢 SYSTEM GENERATED SECRET (With Show/Copy) */}
            {activeWebhookSecret && (
              <div className="pt-5 mt-5 border-t border-gray-200 dark:border-white/10 animate-in fade-in slide-in-from-top-4">
                <label className="block text-xs font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-2">
                  System Generated Secret <span className="text-gray-500 dark:text-gray-500 lowercase normal-case ml-1">— Copy to verify signatures</span>
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 px-4 py-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-500/30 rounded-xl text-sm font-mono text-purple-900 dark:text-purple-200 truncate shadow-sm">
                    {showSecret ? activeWebhookSecret : `whsec_${"•".repeat(32)}`}
                  </div>
                  <button onClick={() => setShowSecret(!showSecret)} className="p-3 border border-purple-200 dark:border-purple-500/30 rounded-xl hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors bg-white dark:bg-transparent shadow-sm">
                    {showSecret ? <EyeOff className="h-4 w-4 text-purple-600 dark:text-purple-400" /> : <Eye className="h-4 w-4 text-purple-600 dark:text-purple-400" />}
                  </button>
                  <button onClick={handleCopySecret} className="p-3 border border-purple-200 dark:border-purple-500/30 rounded-xl hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors bg-white dark:bg-transparent shadow-sm">
                    {secretCopied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4 text-purple-600 dark:text-purple-400" />}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

{/* ─── Integration Documentation Section ─── */}
      <div className="pt-10 border-t border-gray-200 dark:border-white/10 mt-10">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Code className="h-6 w-6 text-blue-500" />
            Integration Guide
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Follow these three simple steps to integrate the Continuous Engine into your platform.
          </p>
        </div>

        <div className="space-y-6">
          
          {/* Step 1: The Request */}
          <div className="bg-white dark:bg-[#1a1025] border border-gray-200 dark:border-white/5 rounded-2xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-black/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 font-bold text-sm">1</div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Execute a Spin (The Request)</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Send a POST request from your backend to our engine.</p>
                </div>
              </div>
              <span className="text-xs font-mono bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 px-2.5 py-1 rounded-md border border-blue-200 dark:border-blue-500/30">
                POST /api/client/spin
              </span>
            </div>
            <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  Initiate a game round by sending the user's bet amount and the selected gift tier. You <strong className="text-gray-900 dark:text-white">must</strong> include your API Key in the headers.
                </p>
                <div className="bg-blue-50 dark:bg-blue-500/5 border border-blue-100 dark:border-blue-500/10 p-4 rounded-xl space-y-3">
                  <p className="text-sm font-semibold text-blue-900 dark:text-blue-300">Required Parameters:</p>
                  <ul className="text-sm space-y-2 text-blue-800 dark:text-blue-200/70">
                    <li><code className="bg-white dark:bg-black/40 px-1.5 py-0.5 rounded font-mono text-xs border border-blue-100 dark:border-white/10 shadow-sm">x-api-key</code> (Header): Your active {mode} API Key.</li>
                    <li><code className="bg-white dark:bg-black/40 px-1.5 py-0.5 rounded font-mono text-xs border border-blue-100 dark:border-white/10 shadow-sm">transactionId</code> (Body): A unique UUIDv4 to prevent double-charging your users if a network retry happens.</li>
                  </ul>
                </div>
              </div>
              <div className="bg-gray-900 dark:bg-black/40 rounded-xl overflow-hidden shadow-inner flex flex-col">
                  <div className="px-4 py-2.5 bg-gray-800 dark:bg-white/5 border-b border-gray-700 dark:border-white/5 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">cURL Request</span>
                  </div>
                  <pre className="p-4 text-xs text-blue-300 font-mono leading-relaxed overflow-x-auto flex-1">
{`curl -X POST https://api.luckyengine.com/api/client/spin \\
-H "Content-Type: application/json" \\
-H "x-api-key: YOUR_API_KEY" \\
-d '{
  "giftId": 101,
  "userId": 9821,
  "amount": 100,
  "transactionId": "550e8400-e29b-41d4-a716-446655440000"
}'`}
                  </pre>
              </div>
            </div>
          </div>

          {/* Step 2: The Webhook */}
          <div className="bg-white dark:bg-[#1a1025] border border-gray-200 dark:border-white/5 rounded-2xl overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-black/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 font-bold text-sm">2</div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Receive Results (The Webhook)</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Listen for the engine's real-time resolution.</p>
                </div>
              </div>
            </div>
            <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  Once the engine resolves the spin, we immediately push a <code className="bg-gray-100 dark:bg-white/10 px-1.5 py-0.5 rounded font-mono text-xs">POST</code> request containing the outcome to your configured webhook URL.
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  Use the returned <code className="bg-gray-100 dark:bg-white/10 px-1.5 py-0.5 rounded font-mono text-xs">transactionId</code> to match the result with the original bet, and credit the <code className="bg-gray-100 dark:bg-white/10 px-1.5 py-0.5 rounded font-mono text-xs">winAmount</code> to the user's wallet on your platform.
                </p>
              </div>
              <div className="bg-gray-900 dark:bg-black/40 rounded-xl overflow-hidden shadow-inner flex flex-col">
                  <div className="px-4 py-2.5 bg-gray-800 dark:bg-white/5 border-b border-gray-700 dark:border-white/5">
                    <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">JSON Payload Example</span>
                  </div>
                  <pre className="p-4 text-xs text-emerald-300 font-mono leading-relaxed overflow-x-auto flex-1">
{JSON.stringify(payloadExample, null, 2)}
                  </pre>
              </div>
            </div>
          </div>

          {/* Step 3: Security */}
          <div className="bg-white dark:bg-[#1a1025] border border-gray-200 dark:border-white/5 rounded-2xl overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-black/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-sm">3</div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Verify Authenticity (Security)</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Ensure the webhook actually came from Lucky Engine.</p>
                </div>
              </div>
              <a href="#" className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline">
                Read Security Docs <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  To prevent malicious actors from sending fake win payloads to your server, you must verify the <code className="bg-gray-100 dark:bg-white/10 px-1.5 py-0.5 rounded font-mono text-xs">X-Webhook-Signature</code> header attached to every webhook.
                </p>
                <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                  <Shield className="h-5 w-5 text-gray-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                    Generate an HMAC SHA-256 hash using your <strong className="text-gray-900 dark:text-white">Webhook Secret</strong> and the <strong className="text-gray-900 dark:text-white">raw request body bytes</strong>. If it matches our signature, the request is safe to process.
                  </p>
                </div>
              </div>
              <div className="bg-gray-900 dark:bg-black/40 rounded-xl overflow-hidden shadow-inner flex flex-col">
                  <div className="px-4 py-2.5 bg-gray-800 dark:bg-white/5 border-b border-gray-700 dark:border-white/5 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Node.js Example</span>
                    <div className="flex gap-1.5">
                      <div className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                      <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
                      <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
                    </div>
                  </div>
                  <pre className="p-4 text-xs text-purple-300 font-mono leading-relaxed overflow-x-auto flex-1">
{`const crypto = require('crypto');

function verifyWebhook(rawBody, signature, whSecret) {
  const expected = crypto
    .createHmac('sha256', whSecret)
    .update(rawBody) // Use raw buffer, not parsed JSON
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expected)
  );
}`}
                  </pre>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
// ─── Page Root ─────────────────────────────────────────────────────────────────
export default function APIKeysPage() {
  const { paymentStatus } = useAuthStore();

  if (paymentStatus === null) {
    return (
      <div className="flex justify-center items-center py-32">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    );
  }

  return paymentStatus === PaymentStatus.PAID ? <UnlockedAPIUI /> : <LockedPaywallUI />;
}