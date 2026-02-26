// src/app/(auth)/register/page.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/api/useAuth";
import { useToastStore } from "@/store/useToastStore";
import {
  Loader2,
  User as UserIcon,
  Building2,
  CheckCircle2,
  Mail,
  Lock,
  ArrowRight,
} from "lucide-react";
import { Role } from "@/types/auth.types";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const { addToast } = useToastStore();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    role: Role.USER,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRoleChange = (role: Role) => {
    setFormData((prev) => ({ ...prev, role }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.email.includes("@")) {
      addToast("Please enter a valid email address.", "error");
      return;
    }
    if (formData.password.length < 6) {
      addToast("Password must be at least 6 characters long.", "error");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      addToast("Passwords do not match.", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      await register(formData.email, formData.password, formData.role);
      addToast("Welcome to Lucky Engine!", "success");

      if (formData.role === Role.B2B_CLIENT) {
        router.push("/b2b/configurations");
      } else {
        router.push("/user/play");
      }
    } catch (err: unknown) {
      const error = err as {
        response?: { data?: { error?: string } };
        message?: string;
      };
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Registration failed. Please try again.";
      addToast(errorMessage, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-screen w-screen flex overflow-hidden">
      {/* ══════════════════════════════════════════
          LEFT PANEL — dark purple (unchanged)
      ══════════════════════════════════════════ */}
      <div className="hidden lg:flex lg:w-[44%] xl:w-[42%] shrink-0 flex-col justify-center items-center p-10 xl:p-14 relative overflow-hidden bg-gradient-to-br from-[#1a0b2e] via-[#2d1b4e] to-[#1a0b2e]">
        {/* Blobs */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
        <div
          className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl pointer-events-none animate-pulse"
          style={{ animationDelay: "1s" }}
        />

        {/* Spinning Wheel BG */}
        <div className="absolute inset-0 flex items-center justify-center opacity-30">
          <div className="relative w-[500px] h-[500px]">
            <div className="absolute inset-0 animate-spin-slow">
              <div className="absolute inset-0 rounded-full border-4 border-cyan-400/60 shadow-[0_0_80px_rgba(34,211,238,0.6)]" />
              <div className="absolute inset-8 rounded-full border-4 border-purple-400/50 shadow-[0_0_60px_rgba(192,132,252,0.5)]" />
              <div className="absolute inset-16 rounded-full overflow-hidden bg-gradient-to-br from-purple-900/80 via-purple-700/80 to-pink-700/80 border-4 border-cyan-400/70 shadow-[0_0_100px_rgba(34,211,238,0.8)]">
                {[
                  { label: "$10", angle: 0 },
                  { label: "GIFT", angle: 30 },
                  { label: "$200", angle: 60 },
                  { label: "$5", angle: 90 },
                  { label: "$50", angle: 120 },
                  { label: "$100", angle: 150 },
                  { label: "$5", angle: 180 },
                  { label: "$800", angle: 210 },
                  { label: "$500", angle: 240 },
                  { label: "GIFT", angle: 270 },
                  { label: "$70", angle: 300 },
                  { label: "$3", angle: 330 },
                ].map((segment, i) => (
                  <div
                    key={i}
                    className="absolute inset-0 flex items-start justify-center"
                    style={{ transform: `rotate(${segment.angle}deg)` }}
                  >
                    <div className="mt-8 text-white font-bold text-sm tracking-wider drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                      {segment.label}
                    </div>
                    <div className="absolute top-0 left-1/2 w-0.5 h-full bg-cyan-400/40 -translate-x-1/2" />
                  </div>
                ))}
                <div className="absolute inset-[35%] rounded-full bg-gradient-to-br from-cyan-400/40 to-purple-500/40 backdrop-blur-sm border-4 border-white/50 shadow-[0_0_40px_rgba(34,211,238,0.8)]" />
              </div>
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                <div
                  key={i}
                  className="absolute w-5 h-5 bg-white rounded-full shadow-[0_0_25px_rgba(255,255,255,1)] animate-pulse"
                  style={{
                    top: "50%",
                    left: "50%",
                    transform: `rotate(${angle}deg) translateY(-245px) translateX(-50%)`,
                    animationDelay: `${i * 0.3}s`,
                  }}
                />
              ))}
            </div>
            {/* Pointer */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-4 z-20">
              <div className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-b-[30px] border-b-cyan-400 drop-shadow-[0_0_20px_rgba(34,211,238,1)]" />
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-8 bg-cyan-400/50 rounded-full blur-xl" />
            </div>
          </div>
        </div>

        {/* Left text content */}
        <div className="relative z-10 text-center space-y-8 max-w-md">
          <div className="space-y-4">
            <h1 className="text-4xl xl:text-5xl font-extrabold text-white leading-tight tracking-tight drop-shadow-lg">
              Create an
              <br />
              <span className="text-cyan-300">account</span>
            </h1>
            <p className="text-blue-100/90 text-base xl:text-lg leading-relaxed drop-shadow-md">
              Join thousands of players and businesses on the Lucky Engine
              platform.
            </p>
          </div>
          <div className="space-y-3 pt-3">
            {[
              {
                icon: "🎯",
                text: "Free to get started — no credit card needed",
              },
              { icon: "⚡", text: "Instant access after registration" },
              { icon: "🔒", text: "Secure & encrypted data" },
            ].map((feat, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 justify-center bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/20"
              >
                <span className="text-2xl">{feat.icon}</span>
                <span className="text-white/90 text-sm text-left flex-1 max-w-xs">
                  {feat.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 mt-8">
          <p className="text-blue-100/80 text-sm text-center">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-white font-bold hover:underline underline-offset-2"
            >
              Sign in
            </Link>
          </p>
        </div>

        <style jsx>{`
          @keyframes spin-slow {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
          .animate-spin-slow {
            animation: spin-slow 30s linear infinite;
          }
        `}</style>
      </div>

      {/* ══════════════════════════════════════════
          RIGHT PANEL — fully light / white theme
      ══════════════════════════════════════════ */}
      <div className="flex-1 h-full overflow-y-auto flex flex-col bg-gradient-to-br from-white via-slate-50 to-blue-50/40">
        {/* Subtle light decor blobs */}
        <div className="pointer-events-none fixed top-0 right-0 w-72 h-72 bg-blue-100/40 rounded-full blur-3xl" />
        <div className="pointer-events-none fixed bottom-0 right-1/3 w-56 h-56 bg-purple-100/30 rounded-full blur-3xl" />

        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-6 sm:px-8 sm:py-8">
          {/* ── Mobile heading (< lg) ── */}
          <div className="lg:hidden w-full max-w-sm sm:max-w-md mb-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Create an account
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>

          {/* ── Desktop heading (lg+) ── */}
          <div className="hidden lg:block w-full max-w-[420px] xl:max-w-[460px] mb-5">
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Create an account
            </h2>
            <p className="mt-1.5 text-sm text-gray-500">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>

          {/* ── Form Card ── */}
          <div className="w-full max-w-sm sm:max-w-md lg:max-w-[420px] xl:max-w-[460px] bg-white rounded-2xl sm:rounded-3xl shadow-xl shadow-gray-200/60 border border-gray-200 relative overflow-hidden">
            {/* Colourful top bar */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />

            <div className="px-5 py-5 sm:px-6 sm:py-6">
              <form onSubmit={handleSubmit} className="space-y-3.5">
                {/* ── Role selection ── */}
                <div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {/* Player */}

                    {/* B2B */}
                  </div>
                </div>

                {/* ── Full Name ── */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <UserIcon className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className="block w-full pl-9 pr-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:bg-white hover:border-gray-300 transition-all disabled:opacity-50"
                      placeholder="John Doe"
                    />
                  </div>
                </div>

                {/* ── Email ── */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className="block w-full pl-9 pr-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:bg-white hover:border-gray-300 transition-all disabled:opacity-50"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                {/* ── Password ── */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      name="password"
                      type="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className="block w-full pl-9 pr-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:bg-white hover:border-gray-300 transition-all disabled:opacity-50"
                      placeholder="Minimum 6 characters"
                    />
                  </div>
                </div>

                {/* ── Confirm Password ── */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      name="confirmPassword"
                      type="password"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className="block w-full pl-9 pr-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:bg-white hover:border-gray-300 transition-all disabled:opacity-50"
                      placeholder="Re-enter password"
                    />
                  </div>
                </div>

                {/* ── Submit ── */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>

                {/* ── Terms ── */}
                <p className="text-xs text-center text-gray-400">
                  By creating an account, you agree to our{" "}
                  <Link
                    href="#"
                    className="text-blue-500 hover:text-blue-600 font-medium"
                  >
                    Terms
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="#"
                    className="text-blue-500 hover:text-blue-600 font-medium"
                  >
                    Privacy Policy
                  </Link>
                </p>
              </form>
            </div>
          </div>

          <p className="mt-4 text-center text-xs text-gray-400">
            🔒 Your data is secure and encrypted
          </p>
        </div>
      </div>
    </div>
  );
}
