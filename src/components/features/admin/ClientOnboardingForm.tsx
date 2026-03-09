// src/components/features/admin/ClientOnboardingForm.tsx
'use client';

import React, { useState } from 'react';
import { useAdmin } from '@/hooks/api/useAdmin';
import { Loader2, Copy, CheckCircle2, AlertTriangle, Building, Link as LinkIcon, AlertCircle } from 'lucide-react';

export function ClientOnboardingForm() {
  const { createClient, isLoading, error } = useAdmin();
  
  const [name, setName] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');
  
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
    
    try {
      const result = await createClient(name, webhookUrl || undefined);
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
    setSuccessData(null);
  };

  if (successData) {
    return (
      <div className="rounded-xl border border-green-200 bg-white shadow-sm overflow-hidden">
        <div className="bg-green-50 p-6 border-b border-green-100 flex items-start gap-4">
          <CheckCircle2 className="h-8 w-8 text-green-500 flex-shrink-0" />
          <div>
            <h3 className="text-xl font-bold text-green-900">Client Successfully Created!</h3>
            <p className="mt-1 text-sm text-green-700">
              The B2B client <strong>{successData.companyName}</strong> has been onboarded to the Continuous Engine.
            </p>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="rounded-md bg-yellow-50 p-4 border border-yellow-200 flex items-start gap-3">
            <AlertTriangle className="h-6 w-6 text-yellow-600 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-yellow-900">CRITICAL: Save these credentials now</h4>
              <p className="text-sm text-yellow-800 mt-1">
                The API Key and Webhook Secret are shown <strong>only once</strong>. If lost, they cannot be recovered and must be rotated.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Client ID</label>
              <div className="bg-gray-50 px-4 py-3 rounded-lg border border-gray-200 font-mono text-sm text-gray-800 break-all">
                {successData.id}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Raw API Key (x-api-key)</label>
              <div className="flex relative">
                <input 
                  readOnly 
                  value={successData.rawApiKey}
                  className="block w-full bg-gray-50 border border-gray-200 rounded-l-lg py-3 px-4 font-mono text-sm text-gray-900 focus:outline-none"
                />
                <button
                  onClick={() => copyToClipboard(successData.rawApiKey, 'api')}
                  className="relative -ml-px inline-flex items-center space-x-2 rounded-r-lg border border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  {copiedKey === 'api' ? (
                    <span className="text-green-600 flex items-center gap-1"><CheckCircle2 className="h-4 w-4"/> Copied</span>
                  ) : (
                    <span className="flex items-center gap-1"><Copy className="h-4 w-4 text-gray-400"/> Copy</span>
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Webhook Secret (HMAC-SHA256)</label>
              <div className="flex relative">
                <input 
                  readOnly 
                  value={successData.webhookSecret}
                  className="block w-full bg-gray-50 border border-gray-200 rounded-l-lg py-3 px-4 font-mono text-sm text-gray-900 focus:outline-none"
                />
                <button
                  onClick={() => copyToClipboard(successData.webhookSecret, 'webhook')}
                  className="relative -ml-px inline-flex items-center space-x-2 rounded-r-lg border border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                   {copiedKey === 'webhook' ? (
                    <span className="text-green-600 flex items-center gap-1"><CheckCircle2 className="h-4 w-4"/> Copied</span>
                  ) : (
                    <span className="flex items-center gap-1"><Copy className="h-4 w-4 text-gray-400"/> Copy</span>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <button
              onClick={resetForm}
              className="w-full sm:w-auto flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
        <div className="rounded-md bg-red-50 p-4 border border-red-200">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400 mr-3 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Onboarding Failed</h3>
              <div className="mt-1 text-sm text-red-700">{error}</div>
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
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={isLoading || !name}
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
