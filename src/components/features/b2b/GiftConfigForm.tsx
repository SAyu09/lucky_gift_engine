// src/components/features/b2b/GiftConfigForm.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, AlertCircle, Save } from 'lucide-react';

interface ProbabilityTier {
  multiplier: number;
  probability: number;
}

interface GiftConfigFormProps {
  onSubmit: (data: {
    giftId: number;
    name: string;
    entryPrice: number;
    targetRtpPercent: number;
    probabilityTable: ProbabilityTier[];
  }) => Promise<void>;
  isLoading: boolean;
  onCancel: () => void;
}

export function GiftConfigForm({ onSubmit, isLoading, onCancel }: GiftConfigFormProps) {
  const [giftId, setGiftId] = useState<number | ''>('');
  const [name, setName] = useState('');
  const [entryPrice, setEntryPrice] = useState<number | ''>('');
  const [targetRtpPercent, setTargetRtpPercent] = useState<number>(95.00);
  
  const [tiers, setTiers] = useState<ProbabilityTier[]>([
    { multiplier: 0, probability: 0.5 },
    { multiplier: 2, probability: 0.4 },
    { multiplier: 10, probability: 0.1 },
  ]);

  const [sumError, setSumError] = useState<string | null>(null);

  // Validate probability sum on changes
  useEffect(() => {
    const timer = setTimeout(() => {
      const sum = tiers.reduce((acc, curr) => acc + (curr.probability || 0), 0);
      // Use toFixed to avoid JS floating point math weirdness (e.g. 0.9999999999999999)
      if (sum.toFixed(4) !== '1.0000') {
        setSumError(`Total probability must equal exactly 1.0 (Current: ${sum.toFixed(4)})`);
      } else {
        setSumError(null);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [tiers]);

  const handleAddTier = () => {
    setTiers([...tiers, { multiplier: 0, probability: 0 }]);
  };

  const handleRemoveTier = (index: number) => {
    if (tiers.length <= 1) return; // Prevent removing the last tier
    const newTiers = [...tiers];
    newTiers.splice(index, 1);
    setTiers(newTiers);
  };

  const handleTierChange = (index: number, field: keyof ProbabilityTier, value: string) => {
    const newTiers = [...tiers];
    newTiers[index][field] = parseFloat(value) || 0;
    setTiers(newTiers);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sumError) return;
    if (giftId === '' || entryPrice === '' || !name) return;

    await onSubmit({
      giftId: Number(giftId),
      name,
      entryPrice: Number(entryPrice),
      targetRtpPercent,
      probabilityTable: tiers,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Core Settings */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Basic Details</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Gift ID (Numeric)</label>
            <input
              type="number"
              required
              min={1}
              value={giftId}
              onChange={(e) => setGiftId(e.target.value ? Number(e.target.value) : '')}
              className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border"
              placeholder="e.g. 101"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Configuration Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border"
              placeholder="e.g. Golden Chest Settings"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Entry Price (Coins)</label>
            <input
              type="number"
              required
              min={0}
              step="0.01"
              value={entryPrice}
              onChange={(e) => setEntryPrice(e.target.value ? Number(e.target.value) : '')}
              className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border"
              placeholder="10.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Target RTP (%)</label>
            <input
              type="number"
              required
              min={0}
              max={100}
              step="0.01"
              value={targetRtpPercent}
              onChange={(e) => setTargetRtpPercent(e.target.value ? Number(e.target.value) : 0)}
              className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border"
            />
            <p className="mt-1 text-xs text-gray-500">Platform default is 95.00%</p>
          </div>
        </div>

        {/* Probability Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <h3 className="text-lg font-medium text-gray-900">Probability Table</h3>
            <button
              type="button"
              onClick={handleAddTier}
              className="inline-flex items-center rounded-md border border-transparent bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 hover:bg-blue-200"
            >
              <Plus className="-ml-1 mr-1 h-4 w-4" />
              Add Tier
            </button>
          </div>

          {sumError && (
             <div className="rounded-md bg-red-50 p-3 flex items-start">
               <AlertCircle className="h-5 w-5 text-red-400 mr-2 flex-shrink-0 mt-0.5" />
               <p className="text-sm text-red-700 font-medium">{sumError}</p>
             </div>
          )}

          <div className="space-y-3">
            <div className="grid grid-cols-12 gap-2 px-1">
              <div className="col-span-5 text-sm font-medium text-gray-500">Multiplier</div>
              <div className="col-span-5 text-sm font-medium text-gray-500">Probability</div>
              <div className="col-span-2"></div>
            </div>
            
            {tiers.map((tier, index) => (
              <div key={index} className="grid grid-cols-12 gap-2 items-center">
                <div className="col-span-5">
                  <div className="relative rounded-md shadow-sm">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 sm:text-sm">x</span>
                    <input
                      type="number"
                      step="0.01"
                      min={0}
                      required
                      value={tier.multiplier}
                      onChange={(e) => handleTierChange(index, 'multiplier', e.target.value)}
                      className="block w-full rounded-md border-gray-300 pl-7 py-2 focus:border-blue-500 focus:ring-blue-500 sm:text-sm border"
                    />
                  </div>
                </div>
                
                <div className="col-span-5">
                  <input
                    type="number"
                    step="0.0001"
                    min={0}
                    max={1}
                    required
                    value={tier.probability}
                    onChange={(e) => handleTierChange(index, 'probability', e.target.value)}
                    className="block w-full rounded-md border-gray-300 py-2 pl-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border"
                  />
                </div>
                
                <div className="col-span-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleRemoveTier(index)}
                    disabled={tiers.length <= 1}
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-gray-50 p-3 rounded-md text-sm text-gray-700 space-y-1 mt-4">
            <p><strong>Example:</strong></p>
            <p>1000 Coins Entry with x2 Multiplier = 2000 Coins Reward</p>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!!sumError || isLoading}
          className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-400 disabled:cursor-not-allowed items-center gap-2"
        >
          <Save className="h-4 w-4" />
          {isLoading ? 'Saving...' : 'Save Configuration'}
        </button>
      </div>
    </form>
  );
}
