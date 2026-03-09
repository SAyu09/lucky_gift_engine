// src/app/(dashboard)/b2b/configurations/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useB2B } from '@/hooks/api/useB2B';
import { useAuthStore } from '@/store/useAuthStore';
import { PaymentStatus } from '@/types/auth.types';
import { GiftConfig } from '@/types/gift.types';
import { GiftConfigForm } from '@/components/features/b2b/GiftConfigForm';
import { Loader2, Plus, Trash2, Settings, AlertCircle, Key, Lock } from 'lucide-react';

export default function B2BConfigurationsPage() {
  const { getConfigs, createConfig, deleteConfig, isLoading, error } = useB2B();
  const { paymentStatus, user } = useAuthStore();
  
  const [configs, setConfigs] = useState<GiftConfig[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [fetchNeeded, setFetchNeeded] = useState(true);
  
  // 🟢 NEW: Environment Mode Toggle
  const [mode, setMode] = useState<'test' | 'live'>('test');

  const isPending = paymentStatus !== PaymentStatus.PAID;

  // 🟢 FIXED: Use backend credentials instead of local storage
  const hasApiKey = mode === 'test' 
    ? user?.clientCredentials?.hasTestApiKey 
    : user?.clientCredentials?.hasLiveApiKey;

  useEffect(() => {
    // Only fetch if paid and API key is available for the current mode
    if (fetchNeeded && hasApiKey && !isPending) {
      // In the future, if your backend supports environment-specific configs,
      // you would pass `mode` here: getConfigs(mode)
      getConfigs()
        .then((data) => {
          setConfigs(data || []);
          setFetchNeeded(false);
        })
        .catch(() => setFetchNeeded(false));
    }
  }, [fetchNeeded, getConfigs, hasApiKey, isPending, mode]);

  // When switching modes, trigger a re-fetch
  useEffect(() => {
    setFetchNeeded(true);
  }, [mode]);

  // ─── Preview Mode Banner (Unpaid) ──────────────────────────────────────
  if (isPending) {
    return (
      <div className="space-y-6">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Settings className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              Gift Configurations
            </h1>
            <p className="mt-2 text-sm text-gray-700 dark:text-gray-400">
              Manage your game economies, entry prices, and continuous engine probability tables here.
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-amber-200 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/10 px-5 py-4 flex items-center gap-4">
          <Lock className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
              Preview Mode — Configurations are read-only
            </p>
            <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
              Unlock API access to create and activate gift configurations on the live engine.
            </p>
          </div>
          <Link
            href="/b2b/api-keys"
            className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            Unlock Access
          </Link>
        </div>

        {/* Blurred Fake Table */}
        <div className="blur-sm opacity-40 pointer-events-none select-none">
          <div className="bg-white dark:bg-[#1a1025] shadow sm:rounded-lg border border-gray-200 dark:border-white/10 overflow-hidden p-12 text-center">
            <div className="h-4 w-3/4 bg-gray-200 dark:bg-white/20 mx-auto rounded mb-4" />
            <div className="h-4 w-1/2 bg-gray-200 dark:bg-white/20 mx-auto rounded mb-4" />
            <div className="h-4 w-5/6 bg-gray-200 dark:bg-white/20 mx-auto rounded" />
          </div>
        </div>
      </div>
    );
  }

  // ─── API Key not configured — show setup prompt ───────────────────────────
  if (!hasApiKey && !isLoading) {
    return (
      <div className="space-y-6">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Settings className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              Gift Configurations
            </h1>
          </div>
          
          <div className="flex bg-gray-100 dark:bg-purple-950/40 p-1.5 rounded-xl border border-gray-200 dark:border-purple-500/20">
            <button onClick={() => setMode('test')} className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${mode === 'test' ? 'bg-amber-500 text-white shadow-md' : 'text-gray-500'}`}>Test Mode</button>
            <button onClick={() => setMode('live')} className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${mode === 'live' ? 'bg-emerald-500 text-white shadow-md' : 'text-gray-500'}`}>Live Mode</button>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center py-20 gap-6 bg-white dark:bg-[#1a1025] rounded-xl border border-gray-200 dark:border-white/5">
          <div className="h-16 w-16 rounded-2xl bg-amber-500/10 flex items-center justify-center">
            <Key className="h-8 w-8 text-amber-500" />
          </div>
          <div className="text-center max-w-md">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              System Key Pending
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Your <strong>{mode}</strong> environment API Key hasn&apos;t been generated by the system yet. 
              The configuration engine requires an active key to operate.
            </p>
          </div>
          <Link
            href="/b2b/api-keys"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-semibold transition-colors"
          >
            <Key className="h-4 w-4" />
            Go to Developer Suite
          </Link>
        </div>
      </div>
    );
  }

  // ─── Actions & Submits ──────────────────────────────────────────────────
  const handleCreateSubmit = async (data: Omit<GiftConfig, 'id' | 'clientId' | 'createdAt' | 'updatedAt' | 'tier' | 'rewardName' | 'rewardValue' | 'inventory' | 'isActive'> & {
    giftId: number;
    name: string;
    entryPrice: number;
    targetRtpPercent: number;
    probabilityTable: Array<{ multiplier: number; probability: number }>;
  }) => {
    try {
      await createConfig(data);
      setIsFormOpen(false);
      setFetchNeeded(true); // Trigger refresh
    } catch (err) {
      console.error('Submit failed', err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this configuration?')) return;
    try {
      await deleteConfig(id);
      setFetchNeeded(true); // Trigger refresh
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* ─── Header ─── */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Settings className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            Gift Configurations
          </h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-400">
            Manage your game economies, entry prices, and continuous engine probability tables here.
          </p>
        </div>
        
        <div className="mt-4 sm:mt-0 flex items-center gap-4">
          <div className="flex bg-gray-100 dark:bg-purple-950/40 p-1.5 rounded-xl border border-gray-200 dark:border-purple-500/20">
            <button onClick={() => setMode('test')} className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${mode === 'test' ? 'bg-amber-500 text-white shadow-md' : 'text-gray-500'}`}>Test</button>
            <button onClick={() => setMode('live')} className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${mode === 'live' ? 'bg-emerald-500 text-white shadow-md' : 'text-gray-500'}`}>Live</button>
          </div>

          {!isFormOpen && (
            <button
              type="button"
              onClick={() => setIsFormOpen(true)}
              className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 flex items-center gap-2 transition-colors"
            >
              <Plus className="h-4 w-4" />
              New Config
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 dark:bg-red-500/10 p-4 border border-red-200 dark:border-red-500/20 shadow-sm flex items-center">
          <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mr-3 shrink-0" />
          <div className="text-sm text-red-800 dark:text-red-300 font-medium">{error}</div>
        </div>
      )}

      {/* ─── Form / Data Table ─── */}
      {isFormOpen ? (
        <div className="bg-white dark:bg-[#1a1025] shadow-sm rounded-2xl border border-gray-200 dark:border-white/10">
          <div className="p-6 border-b border-gray-200 dark:border-white/10">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Create New Configuration <span className="text-xs font-normal text-gray-500 ml-2 uppercase tracking-wider">({mode} environment)</span></h3>
          </div>
          <div className="p-6">
            <GiftConfigForm 
              onSubmit={handleCreateSubmit} 
              isLoading={isLoading} 
              onCancel={() => setIsFormOpen(false)} 
            />
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-[#1a1025] shadow-sm rounded-2xl border border-gray-200 dark:border-white/10 overflow-hidden">
          {isLoading && configs.length === 0 ? (
            <div className="p-16 flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
            </div>
          ) : configs.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="h-16 w-16 bg-gray-100 dark:bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Settings className="h-8 w-8 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">No configurations found</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">Get started by creating a new gift configuration for your {mode} environment.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-white/10">
                <thead className="bg-gray-50 dark:bg-black/20">
                  <tr>
                    <th scope="col" className="py-4 pl-6 pr-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Gift ID</th>
                    <th scope="col" className="px-3 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Name</th>
                    <th scope="col" className="px-3 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Entry Price</th>
                    <th scope="col" className="px-3 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Target RTP</th>
                    <th scope="col" className="px-3 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Tiers</th>
                    <th scope="col" className="relative py-4 pl-3 pr-6 text-right">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-white/5 bg-white dark:bg-transparent">
                  {configs.map((config) => (
                    <tr key={config.id || config.giftId} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                      <td className="whitespace-nowrap py-4 pl-6 pr-3 text-sm font-bold text-gray-900 dark:text-white">
                        #{config.giftId}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                        {config.name || `Config ${config.giftId}`}
                        {config.isActive === false && (
                          <span className="ml-2 inline-flex items-center rounded-md bg-red-50 dark:bg-red-500/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-red-700 dark:text-red-400">Inactive</span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                        ₹{config.entryPrice}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
                        {config.targetRtpPercent}%
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                        <span className="bg-gray-100 dark:bg-white/10 px-2 py-1 rounded-md text-xs font-mono">{config.probabilityTable?.length || 0}</span>
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-6 text-right text-sm font-medium">
                        <button
                          onClick={() => handleDelete(Number(config.giftId || config.id))}
                          className="text-red-500 hover:text-red-600 dark:hover:text-red-400 bg-red-50 dark:bg-red-500/10 p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors"
                          disabled={isLoading}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete {config.name}</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}