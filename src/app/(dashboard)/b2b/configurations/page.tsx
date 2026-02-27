// src/app/(dashboard)/b2b/configurations/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useB2B } from '@/hooks/api/useB2B';
import { GiftConfig } from '@/types/gift.types';
import { GiftConfigForm } from '@/components/features/b2b/GiftConfigForm';
import { Loader2, Plus, Trash2, Settings, AlertCircle } from 'lucide-react';

export default function B2BConfigurationsPage() {
  const { getConfigs, createConfig, deleteConfig, isLoading, error } = useB2B();
  const [configs, setConfigs] = useState<GiftConfig[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [fetchNeeded, setFetchNeeded] = useState(true);

  useEffect(() => {
    if (fetchNeeded) {
      getConfigs()
        .then((data) => {
          setConfigs(data || []);
          setFetchNeeded(false);
        })
        .catch(() => setFetchNeeded(false));
    }
  }, [fetchNeeded, getConfigs]);

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
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Settings className="h-6 w-6 text-blue-600 dark:text-purple-400" />
            Gift Configurations
          </h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-400">
            Manage your game economies, entry prices, and continuous engine probability tables here.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          {!isFormOpen && (
            <button
              type="button"
              onClick={() => setIsFormOpen(true)}
              className="block rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              New Configuration
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-white p-4 border border-red-200 shadow-sm">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <div className="text-sm text-red-500 font-medium">{error}</div>
          </div>
        </div>
      )}

      {isFormOpen ? (
        <div className="bg-white dark:bg-[#1a1025] shadow sm:rounded-lg border border-gray-200 dark:border-white/10">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-base font-semibold leading-6 text-gray-900 dark:text-white mb-5">Create New Configuration</h3>
            <GiftConfigForm 
              onSubmit={handleCreateSubmit} 
              isLoading={isLoading} 
              onCancel={() => setIsFormOpen(false)} 
            />
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-[#1a1025] shadow sm:rounded-lg border border-gray-200 dark:border-white/10 overflow-hidden">
          {isLoading && configs.length === 0 ? (
            <div className="p-12 flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          ) : configs.length === 0 ? (
            <div className="text-center py-12 px-4 sm:px-6 lg:px-8">
              <Settings className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">No configurations</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by creating a new gift configuration.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-300 dark:divide-white/10">
                <thead className="bg-gray-50 dark:bg-[#1f132b]">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-200 sm:pl-6">Gift ID</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-200">Name</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-200">Entry Price</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-200">Target RTP</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-200">Tiers</th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-white/10 bg-white dark:bg-[#1a1025]">
                  {configs.map((config) => (
                    <tr key={config.id || config.giftId} className="hover:bg-gray-50 dark:hover:bg-[#1f132b] transition-colors">
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-gray-100 sm:pl-6">
                        #{config.giftId}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {config.name || `Config ${config.giftId}`}
                        {config.isActive === false && (
                          <span className="ml-2 inline-flex items-center rounded-md bg-red-50 dark:bg-red-500/10 px-2 py-1 text-xs font-medium text-red-700 dark:text-red-400 ring-1 ring-inset ring-red-600/10 dark:ring-red-500/20">Inactive</span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {config.entryPrice}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {config.targetRtpPercent}%
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {config.probabilityTable?.length || 0} tiers
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <button
                          onClick={() => handleDelete(Number(config.giftId || config.id))}
                          className="text-red-600 hover:text-red-900 bg-red-50 p-2 rounded-md hover:bg-red-100 transition-colors"
                          disabled={isLoading}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete, {config.name}</span>
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
