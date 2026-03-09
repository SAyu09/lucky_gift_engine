// src/components/features/engine/SpinControls.tsx
'use client';

import React, { useState } from 'react';
import { useEngine } from '@/hooks/api/useEngine';
import { Loader2, Coins, Gift, AlertCircle, Trophy, Sparkles } from 'lucide-react';

interface SpinResultData {
  multiplier: number;
  winAmount: number;
}

export function SpinControls() {
  const { executeSpin, isLoading, error } = useEngine();
  
  const [giftId, setGiftId] = useState<number>(101);
  const [amount, setAmount] = useState<number>(10);
  const [result, setResult] = useState<SpinResultData | null>(null);
  
  const [isSpinning, setIsSpinning] = useState(false); // Used for UI animation delay

  const handleSpin = async (e: React.FormEvent) => {
    e.preventDefault();
    setResult(null);
    setIsSpinning(true);
    
    try {
      // Intentionally adding a small artificial delay for dramatic effect if the API is too fast
      const [spinRes] = await Promise.all([
        executeSpin(giftId, amount),
        new Promise(resolve => setTimeout(resolve, 800))
      ]);
      setResult(spinRes as unknown as SpinResultData);
    } catch (err) {
      console.error('Spin failed', err);
    } finally {
      setIsSpinning(false);
    }
  };

  return (
    <div className="max-w-md mx-auto relative">
      
      {/* Engine Container */}
      <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-950 rounded-3xl p-8 shadow-2xl border border-indigo-500/30 overflow-hidden relative">
        
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-purple-500 rounded-full blur-3xl opacity-20 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-indigo-500 rounded-full blur-3xl opacity-20 pointer-events-none"></div>

        <div className="text-center mb-8 relative z-10">
          <h2 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
            <Sparkles className="h-6 w-6 text-yellow-400" />
            Lucky Engine
            <Sparkles className="h-6 w-6 text-yellow-400" />
          </h2>
          <p className="text-indigo-200 text-sm mt-1">Send a gift to trigger the continuous engine.</p>
        </div>

        <form onSubmit={handleSpin} className="space-y-6 relative z-10">
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-200">{error}</p>
            </div>
          )}

          <div className="bg-white/5 p-5 rounded-2xl border border-white/10 space-y-4 backdrop-blur-sm">
            <div>
              <label className="block text-sm font-medium text-indigo-100 mb-2 flex items-center gap-2">
                <Gift className="h-4 w-4 text-pink-400" />
                Select Gift Tier
              </label>
              <select
                value={giftId}
                onChange={(e) => setGiftId(Number(e.target.value))}
                disabled={isLoading || isSpinning}
                className="block w-full rounded-xl border-indigo-500/30 bg-indigo-950/50 text-white py-3 pl-3 pr-10 focus:border-pink-500 focus:ring-pink-500 sm:text-sm outline-none transition-colors disabled:opacity-50"
              >
                <option value={101}>Common Chest (ID: 101)</option>
                <option value={102}>Rare Treasure (ID: 102)</option>
                <option value={103}>Epic Vault (ID: 103)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-indigo-100 mb-2 flex items-center gap-2">
                <Coins className="h-4 w-4 text-yellow-400" />
                Bet Amount
              </label>
              <div className="relative rounded-md shadow-sm">
                <input
                  type="number"
                  min="1"
                  step="1"
                  required
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  disabled={isLoading || isSpinning}
                  className="block w-full rounded-xl border-indigo-500/30 bg-indigo-950/50 text-white py-3 px-4 focus:border-pink-500 focus:ring-pink-500 sm:text-sm outline-none transition-colors disabled:opacity-50"
                  placeholder="Enter bet amount"
                />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                  <span className="text-indigo-300 sm:text-sm">Coins</span>
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || isSpinning || amount <= 0}
            className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-lg font-bold rounded-2xl text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:from-indigo-800 disabled:to-indigo-800 disabled:text-indigo-400 disabled:cursor-not-allowed shadow-lg shadow-pink-500/25 transition-all active:scale-[0.98] overflow-hidden"
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]"></div>
            
            {(isLoading || isSpinning) ? (
              <span className="flex items-center gap-2 relative z-10">
                <Loader2 className="h-6 w-6 animate-spin text-white" />
                Processing Spin...
              </span>
            ) : (
              <span className="relative z-10 tracking-wider">EXECUTE SPIN</span>
            )}
          </button>
        </form>
      </div>

      {/* Result Area */}
      {result && !isSpinning && (
        <div className="mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {result.winAmount > 0 ? (
            <div className="bg-gradient-to-br from-green-500 to-emerald-700 rounded-3xl p-6 shadow-xl border border-green-400/50 text-center relative overflow-hidden">
               <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-yellow-400 rounded-full blur-2xl opacity-20"></div>
               <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-32 h-32 bg-white rounded-full blur-2xl opacity-10"></div>
               
               <Trophy className="h-12 w-12 text-yellow-300 mx-auto mb-2 animate-[bounce_2s_infinite]" />
               <h3 className="text-white text-lg font-medium opacity-90 uppercase tracking-widest text-shadow">You Won!</h3>
               <div className="text-5xl font-black text-white my-2 drop-shadow-md">
                 {result.multiplier}x
               </div>
               <div className="bg-black/20 rounded-full py-2 px-6 inline-flex items-center gap-2 mt-2 border border-white/10">
                 <Coins className="h-5 w-5 text-yellow-300" />
                 <span className="text-xl font-bold text-white">+{result.winAmount.toLocaleString()} Coins</span>
               </div>
            </div>
          ) : (
            <div className="bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-700 text-center">
               <div className="text-gray-400 mb-2">Multiplier</div>
               <div className="text-4xl font-bold text-gray-500 mb-3">{result.multiplier}x</div>
               <div className="text-gray-400 font-medium">Better luck next time!</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
