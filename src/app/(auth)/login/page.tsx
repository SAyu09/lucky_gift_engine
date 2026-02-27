// src/app/(auth)/login/page.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/hooks/api/useAuth";
import { useAuthStore } from "@/store/useAuthStore";
import { useToastStore } from "@/store/useToastStore";
import { Loader2, Mail, Lock } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { user } = useAuthStore();
  const { addToast } = useToastStore();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await login(formData.email, formData.password);
      addToast("Successfully authenticated", "success");

      // Grab updated user from Zustand instantly to route
      // Wait a tick for Zustand propagation if necessary, though login should mutate it immediately
      const currentUserRole = useAuthStore.getState().user?.role;

      switch (currentUserRole) {
        case "ADMIN":
          router.push("/admin/dashboard");
          break;
        case "B2B_CLIENT":
          router.push("/b2b/dashboard");
          break;
        case "USER":
          router.push("/user/play");
          break;
        default:
          router.push("/");
      }
    } catch (err: unknown) {
      const error = err as {
        response?: { data?: { error?: string } };
        message?: string;
      };
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Login failed. Invalid credentials.";
      addToast(errorMessage, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // If already logged in implicitly, perhaps redirect or let layout handle
  if (user) {
    // A more advanced flow might detect this and auto push
  }

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 -ml-20 -mt-20 w-72 h-72 bg-blue-500 rounded-full blur-[100px] opacity-20 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 -mr-20 -mb-20 w-72 h-72 bg-purple-500 rounded-full blur-[100px] opacity-20 pointer-events-none"></div>

      <div className="w-full sm:mx-auto sm:max-w-md relative z-10 px-4 sm:px-0">
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center justify-center mb-6 group"
          ></Link>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
            >
              Create an account
            </Link>
          </p>
        </div>

        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-3xl sm:px-10 border border-gray-100 backdrop-blur-sm relative overflow-hidden">
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="block w-full pl-10 sm:text-sm text-gray-900 placeholder-gray-400 border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 py-3 transition-colors bg-gray-50 hover:bg-white"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="block w-full pl-10 sm:text-sm text-gray-900 placeholder-gray-400 border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 py-3 transition-colors bg-gray-50 hover:bg-white"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-900 cursor-pointer"
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a
                  href="#"
                  className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                >
                  Forgot your password?
                </a>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-0.5"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Authenticating...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
