// src/components/features/admin/ClientOnboardingForm.tsx
'use client';

import React, { useState } from 'react';
import { useAdmin } from '@/hooks/api/useAdmin';
import { Loader2, Copy, CheckCircle2, AlertTriangle, Building, Link as LinkIcon, AlertCircle, Percent, PieChart } from 'lucide-react';

export function ClientOnboardingForm() {
  const { createClient, isLoading, error } = useAdmin();
  
  const [name, setName] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');
  
  // 🟢 NEW: Escrow Revenue Split Configuration
  const [clientProfitPercent, setClientProfitPercent] = useState<number>(80);
  const [platformCutPercent, setPlatformCutPercent] = useState<number>(20);
  
  const [successData, setSuccessData] = useState<{
    id: string;
    companyName: string;
    rawApiKey: string;
    webhookSecret: string;
  } | null>(null);
  
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    
    // Quick validation to ensure it equals 100%
    if (clientProfitPercent + platformCutPercent !== 100) {
      alert("Revenue split must equal 100%");
      return;
    }

    try {
      // Assuming useAdmin hook is updated to accept the new configuration parameters
      const result = await (createClient as any)(
        name, 
        webhookUrl || undefined, 
        clientProfitPercent, 
        platformCutPercent
      );
      
      setSuccessData({
        id: String(result.data.clientId),
        companyName: result.data.name,
        rawApiKey: result.data.rawApiKey,
        webhookSecret: result.data.webhookSecret,
      });
    } catch (err) {
      console.error('Client creation failed', err);
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(type);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const resetForm = () => {
    setName('');
    setWebhookUrl('');
    setClientProfitPercent(80);
    setPlatformCutPercent(20);
    setSuccessData(null);
  };

  if (successData) {
    return (
      <div className="rounded-xl border border-green-200 bg-white dark:bg-[#1a1025] dark:border-green-500/20 shadow-sm overflow-hidden">
        <div className="bg-green-50 dark:bg-green-500/10 p-6 border-b border-green-100 dark:border-green-500/20 flex items-start gap-4">
          <CheckCircle2 className="h-8 w-8 text-green-500 flex-shrink-0" />
          <div>
            <h3 className="text-xl font-bold text-green-900 dark:text-green-400">Client Successfully Created!</h3>
            <p className="mt-1 text-sm text-green-700 dark:text-green-500/80">
              The B2B client <strong>{successData.companyName}</strong> has been onboarded to the Continuous Engine.
            </p>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="rounded-md bg-yellow-50 dark:bg-yellow-500/10 p-4 border border-yellow-200 dark:border-yellow-500/20 flex items-start gap-3">
            <AlertTriangle className="h-6 w-6 text-yellow-600 dark:text-yellow-500 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-yellow-900 dark:text-yellow-400">CRITICAL: Save these credentials now</h4>
              <p className="text-sm text-yellow-800 dark:text-yellow-500/80 mt-1">
                The API Key and Webhook Secret are shown <strong>only once</strong>. If lost, they cannot be recovered and must be rotated.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Client ID</label>
              <div className="bg-gray-50 dark:bg-black/40 px-4 py-3 rounded-lg border border-gray-200 dark:border-white/10 font-mono text-sm text-gray-800 dark:text-gray-200 break-all">
                {successData.id}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Raw API Key (x-api-key)</label>
              <div className="flex relative">
                <input 
                  readOnly 
                  value={successData.rawApiKey}
                  className="block w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-l-lg py-3 px-4 font-mono text-sm text-gray-900 dark:text-gray-200 focus:outline-none"
                />
                <button
                  onClick={() => copyToClipboard(successData.rawApiKey, 'api')}
                  className="relative -ml-px inline-flex items-center space-x-2 rounded-r-lg border border-gray-300 dark:border-white/10 bg-gray-50 dark:bg-[#1f132b] px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                >
                  {copiedKey === 'api' ? (
                    <span className="text-green-600 dark:text-green-400 flex items-center gap-1"><CheckCircle2 className="h-4 w-4"/> Copied</span>
                  ) : (
                    <span className="flex items-center gap-1"><Copy className="h-4 w-4 text-gray-400"/> Copy</span>
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Webhook Secret (HMAC-SHA256)</label>
              <div className="flex relative">
                <input 
                  readOnly 
                  value={successData.webhookSecret}
                  className="block w-full bg-gray-50 dark:bg-black/40 border border-gray-200 dark:border-white/10 rounded-l-lg py-3 px-4 font-mono text-sm text-gray-900 dark:text-gray-200 focus:outline-none"
                />
                <button
                  onClick={() => copyToClipboard(successData.webhookSecret, 'webhook')}
                  className="relative -ml-px inline-flex items-center space-x-2 rounded-r-lg border border-gray-300 dark:border-white/10 bg-gray-50 dark:bg-[#1f132b] px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                >
                   {copiedKey === 'webhook' ? (
                    <span className="text-green-600 dark:text-green-400 flex items-center gap-1"><CheckCircle2 className="h-4 w-4"/> Copied</span>
                  ) : (
                    <span className="flex items-center gap-1"><Copy className="h-4 w-4 text-gray-400"/> Copy</span>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 dark:border-white/10">
            <button
              onClick={resetForm}
              className="w-full sm:w-auto flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Onboard another client
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 dark:bg-red-500/10 p-4 border border-red-200 dark:border-red-500/20">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400 mr-3 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-red-800 dark:text-red-400">Onboarding Failed</h3>
              <div className="mt-1 text-sm text-red-700 dark:text-red-500/80">{error}</div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="company-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Company Name <span className="text-red-500">*</span>
          </label>
          <div className="relative mt-1 rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Building className="h-5 w-5 text-gray-400 dark:text-gray-500" />
            </div>
            <input
              type="text"
              id="company-name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="block w-full rounded-lg border-gray-300 dark:border-white/10 dark:bg-[#1f132b] dark:text-gray-100 pl-10 focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-3 border outline-none transition-colors dark:placeholder-gray-500"
              placeholder="e.g. Acme Corp Gaming"
              disabled={isLoading}
            />
          </div>
        </div>

        <div>
          <label htmlFor="webhook-url" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Webhook URL <span className="text-gray-400 font-normal">(Optional)</span>
          </label>
          <div className="relative mt-1 rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <LinkIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
            </div>
            <input
              type="url"
              id="webhook-url"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              className="block w-full rounded-lg border-gray-300 dark:border-white/10 dark:bg-[#1f132b] dark:text-gray-100 pl-10 focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-3 border outline-none transition-colors dark:placeholder-gray-500"
              placeholder="https://api.acmecorp.com/webhooks/lucky-engine"
              disabled={isLoading}
            />
          </div>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            The endpoint where Continuous Engine spin results will be dispatched.
          </p>
        </div>

        {/* 🟢 NEW: Revenue Split UI */}
        <div className="pt-4 border-t border-gray-200 dark:border-white/10">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
            <PieChart className="h-4 w-4 text-purple-500" />
            Monthly Settlement Config (Revenue Split)
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Client Profit % */}
            <div>
              <label htmlFor="client-profit" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Client Revenue Share <span className="text-red-500">*</span>
              </label>
              <div className="relative mt-1 rounded-md shadow-sm">
                <input
                  type="number"
                  id="client-profit"
                  required
                  min="0"
                  max="100"
                  value={clientProfitPercent}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setClientProfitPercent(val);
                    setPlatformCutPercent(100 - val); // Auto-calculate the remaining %
                  }}
                  className="block w-full rounded-lg border-gray-300 dark:border-white/10 dark:bg-[#1f132b] dark:text-gray-100 pl-4 pr-10 focus:border-purple-500 focus:ring-purple-500 sm:text-sm py-3 border outline-none transition-colors"
                  disabled={isLoading}
                />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <Percent className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                </div>
              </div>
            </div>

            {/* Platform Cut % */}
            <div>
              <label htmlFor="platform-cut" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Platform Fee Cut <span className="text-red-500">*</span>
              </label>
              <div className="relative mt-1 rounded-md shadow-sm">
                <input
                  type="number"
                  id="platform-cut"
                  required
                  min="0"
                  max="100"
                  value={platformCutPercent}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setPlatformCutPercent(val);
                    setClientProfitPercent(100 - val); // Auto-calculate the remaining %
                  }}
                  className="block w-full rounded-lg border-gray-300 dark:border-white/10 dark:bg-[#1f132b] dark:text-gray-100 pl-4 pr-10 focus:border-purple-500 focus:ring-purple-500 sm:text-sm py-3 border outline-none transition-colors"
                  disabled={isLoading}
                />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <Percent className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                </div>
              </div>
            </div>
          </div>
          
          <p className="mt-3 text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
            This defines the exact profit split applied to the client's Net Profit (Escrow) when the automated Settlement Engine runs on the 1st of every month.
          </p>
        </div>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={isLoading || !name || clientProfitPercent + platformCutPercent !== 100}
          className="flex w-full justify-center rounded-lg border border-transparent bg-blue-600 py-3 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-400 disabled:cursor-not-allowed items-center transition-colors"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Generating Credentials...
            </>
          ) : (
            'Generate Client Credentials'
          )}
        </button>
      </div>
    </form>
  );
}