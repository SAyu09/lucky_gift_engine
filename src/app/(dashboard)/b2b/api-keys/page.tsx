"use client";

import { useState } from "react";
import {
  Key,
  Copy,
  Eye,
  EyeOff,
  RefreshCw,
  Zap,
  CheckCircle,
  Code,
  ExternalLink,
  X,
  Lock,
  CreditCard,
} from "lucide-react";

type Environment = "test" | "live";

interface Credentials {
  clientId: string;
  secretKey: string;
  lastRotated: string;
}

export default function APIKeysPage() {
  const [environment, setEnvironment] = useState<Environment>("live");
  const [isLocked, setIsLocked] = useState(true);
  const [showSecret, setShowSecret] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState(
    "https://api.yourdomain.com/v1/lucky-callback",
  );
  const [selectedEvents, setSelectedEvents] = useState(4);
  const [retriesEnabled, setRetriesEnabled] = useState(true);
  const [payloadFormat, setPayloadFormat] = useState<"json" | "post">("json");

  const testCredentials: Credentials = {
    clientId: "client_test_XXXXXXXXXXXXXXXXXXXX",
    secretKey: "secret_test_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    lastRotated: "15 days ago",
  };

  const liveCredentials: Credentials = {
    clientId: "client_live_XXXXXXXXXXXXXXXXXXXX",
    secretKey: "secret_live_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    lastRotated: "12 days ago",
  };

  const currentCredentials =
    environment === "test" ? testCredentials : liveCredentials;

  const handleUnlockClick = () => {
    setShowPaymentModal(true);
  };

  const handleEnvironmentToggle = (env: Environment) => {
    setEnvironment(env);
    setShowSecret(false);
  };

  const handleCopy = (text: string) => {
    if (!isLocked) {
      navigator.clipboard.writeText(text);
      // Add toast notification here
    }
  };

  const payloadExample = {
    event: "spin.completed",
    timestamp: "2023-11-24T14:22:01.442Z",
    data: {
      request_id: "req_f723b9k...",
      player_id: "usr_9821",
      result: {
        slot_id: 12,
        reward_tier: "legendary",
        payout: 500.0,
        currency: "USD",
      },
    },
    rng_seed: "0x92f3...a21",
    signature: "sha256:89a8f...92",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            API & Developer Setup
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage your credentials, configure webhooks, and integrate our RNG
            Engine into your gaming platform in minutes.
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 rounded-full">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
            Live Connection
          </span>
        </div>
      </div>

      {/* API Credentials & Webhook Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* API Credentials */}
        <div className="bg-white dark:bg-purple-950/20 border border-gray-200 dark:border-purple-500/10 rounded-xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-purple-500/10 dark:bg-purple-500/20 flex items-center justify-center">
                <Key className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                API Credentials
              </h2>
            </div>

            {/* Environment Toggle */}
            <div className="flex items-center gap-2 p-1 bg-gray-100 dark:bg-purple-950/30 rounded-lg">
              <button
                type="button"
                onClick={() => handleEnvironmentToggle("test")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  environment === "test"
                    ? "bg-amber-500 text-white shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                }`}
              >
                Test
              </button>
              <button
                type="button"
                onClick={() => handleEnvironmentToggle("live")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  environment === "live"
                    ? "bg-emerald-500 text-white shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                }`}
              >
                Live
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {/* Client ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                CLIENT ID
              </label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={currentCredentials.clientId}
                    readOnly
                    className={`w-full px-4 py-2.5 bg-gray-50 dark:bg-purple-950/30 border border-gray-200 dark:border-purple-500/20 rounded-lg text-sm font-mono text-gray-900 dark:text-white transition-all duration-300 ${
                      isLocked ? "blur-md select-none" : ""
                    }`}
                  />
                  {isLocked && (
                    <div
                      onClick={handleUnlockClick}
                      className="absolute inset-0 flex items-center justify-center cursor-pointer animate-slide-up-fade"
                    >
                      <div className="flex items-center gap-2 bg-white/90 dark:bg-purple-950/90 px-4 py-2 rounded-lg backdrop-blur-sm border border-gray-200 dark:border-purple-500/20 shadow-lg">
                        <Lock className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                          Click to unlock
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(currentCredentials.clientId)}
                  disabled={isLocked}
                  className="p-2.5 border border-gray-200 dark:border-purple-500/20 rounded-lg hover:bg-gray-50 dark:hover:bg-purple-500/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Copy client ID"
                >
                  <Copy className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
            </div>

            {/* Secret Key */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                SECRET KEY
              </label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <input
                    type={showSecret ? "text" : "password"}
                    value={
                      showSecret
                        ? currentCredentials.secretKey
                        : "••••••••••••••••••••••••••••"
                    }
                    readOnly
                    className={`w-full px-4 py-2.5 bg-gray-50 dark:bg-purple-950/30 border border-gray-200 dark:border-purple-500/20 rounded-lg text-sm font-mono text-gray-900 dark:text-white transition-all duration-300 ${
                      isLocked ? "blur-md select-none" : ""
                    }`}
                  />
                  {isLocked && (
                    <div
                      onClick={handleUnlockClick}
                      className="absolute inset-0 flex items-center justify-center cursor-pointer animate-slide-up-fade"
                    >
                      <div className="flex items-center gap-2 bg-white/90 dark:bg-purple-950/90 px-4 py-2 rounded-lg backdrop-blur-sm border border-gray-200 dark:border-purple-500/20 shadow-lg">
                        <Lock className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                          Click to unlock
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => !isLocked && setShowSecret(!showSecret)}
                  disabled={isLocked}
                  className="p-2.5 border border-gray-200 dark:border-purple-500/20 rounded-lg hover:bg-gray-50 dark:hover:bg-purple-500/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title={showSecret ? "Hide secret key" : "Reveal secret key"}
                >
                  {showSecret ? (
                    <EyeOff className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => handleCopy(currentCredentials.secretKey)}
                  disabled={!showSecret || isLocked}
                  className="p-2.5 border border-gray-200 dark:border-purple-500/20 rounded-lg hover:bg-gray-50 dark:hover:bg-purple-500/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Copy secret key"
                >
                  <Copy className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Last rotated: {currentCredentials.lastRotated}
              </p>
            </div>

            <button
              type="button"
              className="flex items-center gap-2 text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
            >
              <RefreshCw className="h-4 w-4" />
              Regenerate Secret
            </button>
          </div>
        </div>

        {/* Webhook Configuration */}
        <div className="bg-white dark:bg-purple-950/20 border border-gray-200 dark:border-purple-500/10 rounded-xl p-6 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-lg bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center">
              <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Webhook Configuration
            </h2>
          </div>

          <div className="space-y-4">
            {/* Endpoint URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                ENDPOINT URL
              </label>
              <input
                type="text"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://api.yourdomain.com/v1/lucky-callback"
                aria-label="Webhook endpoint URL"
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-purple-950/30 border border-gray-200 dark:border-purple-500/20 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Events & Retries */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="events-count"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Events
                </label>
                <input
                  id="events-count"
                  type="text"
                  value={`${selectedEvents} Selected`}
                  readOnly
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-purple-950/30 border border-gray-200 dark:border-purple-500/20 rounded-lg text-sm font-semibold text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label
                  htmlFor="retries-status"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Retries
                </label>
                <input
                  id="retries-status"
                  type="text"
                  value="Enabled (5x)"
                  readOnly
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-purple-950/30 border border-gray-200 dark:border-purple-500/20 rounded-lg text-sm font-semibold text-gray-900 dark:text-white"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-purple-950/30 border border-gray-200 dark:border-purple-500/20 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-purple-500/10 transition-colors"
              >
                Save Config
              </button>
              <button
                type="button"
                className="flex-1 px-4 py-2.5 bg-linear-to-r from-purple-600 to-pink-600 rounded-lg text-sm font-medium text-white hover:from-purple-700 hover:to-pink-700 transition-colors flex items-center justify-center gap-2"
              >
                <Zap className="h-4 w-4" />
                Test Connection
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Payload Preview */}
      <div className="bg-white dark:bg-purple-950/20 border border-gray-200 dark:border-purple-500/10 rounded-xl p-6 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center">
              <Code className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Payload Preview
            </h2>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPayloadFormat("json")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                payloadFormat === "json"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 dark:bg-purple-950/30 text-gray-700 dark:text-gray-300"
              }`}
            >
              JSON
            </button>
            <button
              type="button"
              onClick={() => setPayloadFormat("post")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                payloadFormat === "post"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 dark:bg-purple-950/30 text-gray-700 dark:text-gray-300"
              }`}
            >
              POST
            </button>
          </div>
        </div>

        <div className="relative">
          <pre className="bg-gray-900 dark:bg-black/40 rounded-lg p-6 overflow-x-auto text-sm">
            <code className="text-gray-100 dark:text-gray-300 font-mono">
              {JSON.stringify(payloadExample, null, 2)}
            </code>
          </pre>
          <button
            type="button"
            onClick={() => handleCopy(JSON.stringify(payloadExample, null, 2))}
            className="absolute top-4 right-4 p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
            title="Copy payload example"
          >
            <Copy className="h-4 w-4 text-gray-300" />
          </button>
        </div>
      </div>

      {/* Integration Guide */}
      <div className="bg-white dark:bg-purple-950/20 border border-gray-200 dark:border-purple-500/10 rounded-xl p-6 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-6">
          <Code className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Integration Guide
          </h2>
        </div>

        <div className="space-y-6">
          {/* Webhook Verification */}
          <div className="border border-gray-200 dark:border-purple-500/10 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Webhook Payload Verification
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              When Lucky Engine dispatches a reward event, you must verify the{" "}
              <code className="px-2 py-0.5 bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 rounded text-xs font-mono">
                X-Webhook-Signature
              </code>{" "}
              header to ensure requests originate from our platform.
            </p>

            <div className="bg-gray-900 dark:bg-black/40 rounded-lg p-4 overflow-x-auto">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-gray-400">
                  NODE.JS EXAMPLE
                </span>
                <div className="flex gap-1">
                  <div className="h-3 w-3 rounded-full bg-red-500"></div>
                  <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                  <div className="h-3 w-3 rounded-full bg-emerald-500"></div>
                </div>
              </div>
              <pre className="text-xs text-gray-100 dark:text-gray-300 font-mono leading-relaxed">
                {`const crypto = require('crypto');
function verifyWebhook(payload, sig, secret) {
  // 1. Sign payload using HMAC SHA256
  const expected = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex');
  
  // 2. Secure constant-time comparison
  return crypto.timingSafeEqual(
    Buffer.from(sig),
    Buffer.from(expected)
  );
}`}
              </pre>
            </div>

            <a
              href="#"
              className="inline-flex items-center gap-2 mt-4 text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
            >
              View Complete Documentation
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>

          {/* Developer Support */}
          <div className="bg-linear-to-br from-purple-50 to-pink-50 dark:from-purple-500/10 dark:to-pink-500/10 border border-purple-200 dark:border-purple-500/20 rounded-lg p-6">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-xl bg-purple-600 flex items-center justify-center shrink-0">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Need Developer Support?
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Our engineering team is available 24/7 for integration
                  assistance.
                </p>
                <button
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
                  type="button"
                >
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-purple-950/95 border border-gray-200 dark:border-purple-500/20 rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div className="h-12 w-12 rounded-xl bg-purple-500/10 dark:bg-purple-500/20 flex items-center justify-center">
                <Lock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <button
                type="button"
                onClick={() => setShowPaymentModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                aria-label="Close modal"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Upgrade to View Secret Key
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              To access your API secret key and unlock full integration
              capabilities, please upgrade your subscription plan.
            </p>

            <div className="bg-linear-to-br from-purple-50 to-pink-50 dark:from-purple-500/10 dark:to-pink-500/10 border border-purple-200 dark:border-purple-500/20 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  Included in Professional Plan
                </span>
              </div>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-purple-500"></div>
                  Full API access with secret keys
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-purple-500"></div>
                  Unlimited webhook configurations
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-purple-500"></div>
                  Priority developer support
                </li>
              </ul>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowPaymentModal(false)}
                className="flex-1 px-4 py-3 border border-gray-200 dark:border-purple-500/20 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-purple-500/10 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => (window.location.href = "/b2b/pricing")}
                className="flex-1 px-4 py-3 bg-linear-to-r from-purple-600 to-pink-600 rounded-lg text-sm font-medium text-white hover:from-purple-700 hover:to-pink-700 transition-colors flex items-center justify-center gap-2"
              >
                <CreditCard className="h-4 w-4" />
                View Pricing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
