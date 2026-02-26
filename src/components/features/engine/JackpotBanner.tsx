// src/components/features/engine/JackpotBanner.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { Trophy, X, Flame } from 'lucide-react';

interface JackpotBannerProps {
  winAmount: number;
  multiplier: number;
  onClose: () => void;
}

export function JackpotBanner({ winAmount, multiplier, onClose }: JackpotBannerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [particles, setParticles] = useState<Array<{left: number, top: number, duration: number, delay: number, color: string, tx: number, ty: number, rot: number}>>([]);

  useEffect(() => {
    // Generate particles purely on client and delay visibility to bypass hydration & synchronous state lints
    const initTimer = setTimeout(() => {
      setParticles([...Array(20)].map(() => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
        duration: 1 + Math.random(),
        delay: Math.random() * 0.5,
        color: ['#FBBF24', '#F87171', '#60A5FA', '#34D399'][Math.floor(Math.random() * 4)],
        tx: Math.random() * 200 - 100,
        ty: -(Math.random() * 200 + 100),
        rot: Math.random() * 360
      })));
      setIsVisible(true);
    }, 0);

    // Auto-dismiss after 6 seconds
    const dismissTimer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for fade-out transition before unmounting
    }, 6000);

    return () => {
      clearTimeout(initTimer);
      clearTimeout(dismissTimer);
    };
  }, [onClose]);

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center pointer-events-none transition-all duration-500 ${
        isVisible ? 'opacity-100' : 'opacity-0 scale-95'
      }`}
    >
      {/* Dimmed background overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto" onClick={() => setIsVisible(false)}></div>

      {/* Main Banner Container */}
      <div 
        className="relative z-10 pointer-events-auto bg-gradient-to-b from-yellow-300 via-yellow-400 to-yellow-600 border-[6px] border-yellow-200 rounded-3xl p-8 max-w-lg w-full text-center shadow-[0_0_100px_rgba(250,204,21,0.6)] transform transition-transform animate-bounce-short"
        style={{
          animation: 'bounceIn 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards'
        }}
      >
        <button 
          onClick={() => { setIsVisible(false); setTimeout(onClose, 300); }}
          className="absolute top-4 right-4 text-yellow-900 hover:text-white bg-yellow-100/30 hover:bg-black/20 rounded-full p-1 transition-colors"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="flex justify-center mb-4 relative">
          <Trophy className="h-24 w-24 text-yellow-100 drop-shadow-xl animate-pulse" />
          <Flame className="h-12 w-12 text-red-500 absolute -right-4 -bottom-2 animate-bounce" />
          <Flame className="h-12 w-12 text-orange-500 absolute -left-4 -bottom-2 animate-bounce" style={{ animationDelay: '200ms'}} />
        </div>

        <h2 className="text-4xl md:text-5xl font-black text-white tracking-widest uppercase text-shadow-lg mb-2 drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]">
          MEGA WIN!
        </h2>
        
        <div className="bg-black/20 rounded-2xl py-4 px-6 mt-6 border border-white/20 shadow-inner">
          <div className="text-yellow-100 font-bold uppercase tracking-wider text-sm mb-1">
            Incredible {multiplier}x Multiplier
          </div>
          <div className="text-5xl font-black text-white drop-shadow-md">
            +{winAmount.toLocaleString()}
          </div>
          <div className="text-yellow-200 font-medium text-sm mt-1">Coins Added to Wallet</div>
        </div>

        {/* CSS for custom bounce animation */}
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes bounceIn {
            0% { transform: scale(0.3); opacity: 0; }
            50% { transform: scale(1.05); opacity: 1; }
            70% { transform: scale(0.9); opacity: 1; }
            100% { transform: scale(1); opacity: 1; }
          }
          .text-shadow-lg { text-shadow: 2px 2px 0 #b45309, 4px 4px 0 #78350f; }
        `}} />
      </div>

      {/* Confetti particles (CSS simulated) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {particles.map((p, i) => (
          <div 
            key={i} 
            className="absolute w-3 h-3 rounded-full opacity-0 particle-fly"
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              backgroundColor: p.color,
              animation: `particleFly-${i} ${p.duration}s ease-out forwards ${p.delay}s`
            }}
          />
        ))}
        <style dangerouslySetInnerHTML={{__html: `
          ${particles.map((p, i) => `
            @keyframes particleFly-${i} {
              0% { transform: translate(0, 0) scale(1) rotate(0deg); opacity: 1; }
              100% { transform: translate(${p.tx}px, ${p.ty}px) scale(0) rotate(${p.rot}deg); opacity: 0; }
            }
          `).join('')}
        `}} />
      </div>
    </div>
  );
}
