// src/app/page.tsx
import Link from 'next/link';
import { ArrowRight, Sparkles, Activity, ShieldCheck, Zap } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50 flex flex-col font-sans selection:bg-pink-500/30">
      
      {/* Navbar Minimal */}
      <nav className="w-full flex items-center justify-between px-6 py-6 max-w-7xl mx-auto backdrop-blur-sm z-50">
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-pink-500" />
          <span className="text-xl font-bold tracking-tight text-white">Lucky Engine</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/login" className="text-sm font-medium text-neutral-300 hover:text-white transition-colors">
            Sign In
          </Link>
          <Link href="/register" className="inline-flex items-center justify-center rounded-full bg-white px-5 py-2 text-sm font-semibold text-neutral-900 shadow-sm hover:bg-neutral-200 transition-colors">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 pt-20 pb-32 relative z-10">
        
        {/* Glow Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-gradient-to-tr from-pink-600/20 to-indigo-600/30 blur-[120px] rounded-[100%] pointer-events-none -z-10"></div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-sm font-medium text-pink-400 mb-8 animate-fade-in-up">
          <span className="flex h-2 w-2 rounded-full bg-pink-500"></span>
          Engine Core v2.0 is Live
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight max-w-4xl mx-auto leading-[1.1] animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          The Ultimate <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">Continuous RNG</span> Engine
        </h1>
        
        <p className="mt-8 text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          Empower your B2B platforms with mathematically provable outcomes, idempotent transaction safety, and sub-millisecond webhook dispatches.
        </p>

        <div className="mt-12 flex flex-col sm:flex-row gap-4 items-center justify-center animate-fade-in-up" style={{ animationDelay: '300ms' }}>
          <Link href="/register" className="group flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 px-8 py-4 text-base font-bold text-white shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 transition-all hover:scale-105 active:scale-95">
            Integrate Now
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link href="/login" className="flex items-center justify-center gap-2 rounded-full bg-neutral-900 border border-neutral-700 px-8 py-4 text-base font-bold text-white hover:bg-neutral-800 transition-colors">
            Access Dashboard
          </Link>
        </div>

        {/* Features Grid */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-6 animate-fade-in-up" style={{ animationDelay: '500ms' }}>
          <div className="bg-neutral-900/50 border border-neutral-800 p-8 rounded-3xl text-left backdrop-blur-md">
            <div className="bg-neutral-800 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
              <Zap className="h-6 w-6 text-pink-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Lightning Fast</h3>
            <p className="text-neutral-400">Zero latency spin resolutions backed by a horizontally scaled continuous engine architecture.</p>
          </div>
          <div className="bg-neutral-900/50 border border-neutral-800 p-8 rounded-3xl text-left backdrop-blur-md">
            <div className="bg-neutral-800 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
              <ShieldCheck className="h-6 w-6 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Idempotent Safe</h3>
            <p className="text-neutral-400">UUID v4 secured transactions ensure zero double-charges even under massive network stress.</p>
          </div>
          <div className="bg-neutral-900/50 border border-neutral-800 p-8 rounded-3xl text-left backdrop-blur-md">
            <div className="bg-neutral-800 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
              <Activity className="h-6 w-6 text-indigo-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Provable RTP</h3>
            <p className="text-neutral-400">Built-in RTP shields and global reserve tracking algorithms maintain mathematical fairness.</p>
          </div>
        </div>

      </main>

      <footer className="border-t border-neutral-900 py-8 text-center text-sm text-neutral-500">
        &copy; {new Date().getFullYear()} Lucky Engine Architecture. All rights reserved.
      </footer>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          opacity: 0;
          animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}} />
    </div>
  );
}
