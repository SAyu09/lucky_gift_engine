// src/components/features/landing/RegisterPromptModal.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, Sparkles, ArrowRight, Gift, Zap } from "lucide-react";

export default function RegisterPromptModal() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    // Check if user has already seen the modal in this session
    const hasSeenModal = sessionStorage.getItem("hasSeenRegisterModal");
    if (hasSeenModal) {
      return;
    }

    let scrollTriggered = false;
    let timeTriggered = false;

    // Show after 10 seconds
    const timer = setTimeout(() => {
      if (!hasShown && !scrollTriggered) {
        timeTriggered = true;
        setIsVisible(true);
        setHasShown(true);
        sessionStorage.setItem("hasSeenRegisterModal", "true");
      }
    }, 10000);

    // Show after scrolling 50% of page
    const handleScroll = () => {
      if (scrollTriggered || timeTriggered || hasShown) return;

      const scrollPercentage =
        (window.scrollY /
          (document.documentElement.scrollHeight - window.innerHeight)) *
        100;

      if (scrollPercentage > 50) {
        scrollTriggered = true;
        setIsVisible(true);
        setHasShown(true);
        sessionStorage.setItem("hasSeenRegisterModal", "true");
        clearTimeout(timer);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [hasShown]);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fade-in"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="relative bg-gradient-to-br from-neutral-900 via-neutral-950 to-black border border-neutral-800 rounded-3xl shadow-2xl max-w-md w-full p-6 sm:p-8 pointer-events-auto animate-slide-up overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Background Effects */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />

          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-neutral-800/50 hover:bg-neutral-700 transition-colors z-10"
            aria-label="Close"
          >
            <X className="h-5 w-5 text-neutral-400" />
          </button>

          {/* Content */}
          <div className="relative space-y-6">
            {/* Icon */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl blur-xl opacity-50" />
                <div className="relative bg-gradient-to-r from-pink-500 to-purple-600 p-4 rounded-2xl">
                  <Gift className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>

            {/* Logo */}
            <div className="flex justify-center">
              <Image
                src="/Lucky-logo.png"
                alt="Lucky Engine"
                width={120}
                height={40}
                className="object-contain w-28 h-auto"
              />
            </div>

            {/* Heading */}
            <div className="text-center space-y-2">
              <h3 className="text-2xl sm:text-3xl font-bold text-white">
                Ready to Get Started?
              </h3>
              <p className="text-neutral-400 text-sm sm:text-base">
                Join thousands of businesses using Lucky Engine to power their
                gamification platforms
              </p>
            </div>

            {/* Features */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-neutral-300">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-pink-500/20 flex items-center justify-center">
                  <Zap className="h-3 w-3 text-pink-400" />
                </div>
                <span>Lightning-fast integration in minutes</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-neutral-300">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <Sparkles className="h-3 w-3 text-purple-400" />
                </div>
                <span>Enterprise-grade security & compliance</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-neutral-300">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center">
                  <Gift className="h-3 w-3 text-indigo-400" />
                </div>
                <span>Free trial with no credit card required</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-3 pt-2">
              <Link
                href="/register"
                className="group flex items-center justify-center gap-2 w-full py-3 px-6 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-semibold shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 transition-all hover:scale-105 active:scale-95"
                onClick={handleClose}
              >
                Create Free Account
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <button
                onClick={handleClose}
                className="w-full py-3 px-6 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-xl font-medium transition-colors"
              >
                Maybe Later
              </button>
            </div>

            {/* Trust Badge */}
            <p className="text-center text-xs text-neutral-500">
              Trusted by 500+ enterprise clients worldwide
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-slide-up {
          animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </>
  );
}
