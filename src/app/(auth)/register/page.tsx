// src/app/(auth)/register/page.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/api/useAuth';
import { useToastStore } from '@/store/useToastStore';
import { Loader2, Sparkles, User as UserIcon, Building2, CheckCircle2, Mail, Lock } from 'lucide-react';
import { Role } from '@/types/auth.types';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const { addToast } = useToastStore();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    role: Role.USER,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRoleChange = (role: Role) => {
    setFormData((prev) => ({ ...prev, role }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Front-end Validation
    if (!formData.email.includes('@')) {
      addToast('Please enter a valid email address.', 'error');
      return;
    }
    if (formData.password.length < 6) {
      addToast('Password must be at least 6 characters long.', 'error');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      addToast('Passwords do not match.', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      await register(formData.email, formData.password, formData.role);
      addToast('Welcome to Lucky Engine!', 'success');
      
      // Route based on newly created role
      if (formData.role === Role.B2B_CLIENT) {
        router.push('/b2b/configurations');
      } else {
        router.push('/user/play');
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } }, message?: string };
      const errorMessage = error.response?.data?.error || error.message || 'Registration failed. Please try again.';
      addToast(errorMessage, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 bg-blue-500 rounded-full blur-[100px] opacity-20 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 bg-purple-500 rounded-full blur-[100px] opacity-20 pointer-events-none"></div>

      <div className="w-full sm:mx-auto sm:max-w-md relative z-10 px-4 sm:px-0">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
            <div className="bg-gradient-to-tr from-blue-600 to-purple-600 text-white p-2 rounded-xl shadow-lg group-hover:shadow-blue-500/30 transition-shadow">
              <Sparkles className="h-6 w-6" />
            </div>
            <span className="text-2xl font-black tracking-tight text-gray-900 group-hover:text-blue-700 transition-colors">
              Lucky Engine
            </span>
          </Link>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Create an account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{' '}
            <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
              sign in to your existing account
            </Link>
          </p>
        </div>

        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-3xl sm:px-10 border border-gray-100 backdrop-blur-sm relative overflow-hidden">
           
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            
            {/* Role Selection Grid */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">I am joining as a:</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => handleRoleChange(Role.USER)}
                  className={`relative flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 ${
                    formData.role === Role.USER 
                      ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm' 
                      : 'border-gray-200 hover:border-blue-200 text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <UserIcon className="h-6 w-6 mb-2" />
                  <span className="font-semibold text-sm">Player</span>
                  {formData.role === Role.USER && (
                    <CheckCircle2 className="absolute top-2 right-2 h-4 w-4 text-blue-600" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleChange(Role.B2B_CLIENT)}
                  className={`relative flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 ${
                    formData.role === Role.B2B_CLIENT 
                      ? 'border-purple-600 bg-purple-50 text-purple-700 shadow-sm' 
                      : 'border-gray-200 hover:border-purple-200 text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Building2 className="h-6 w-6 mb-2" />
                  <span className="font-semibold text-sm">B2B Platform</span>
                  {formData.role === Role.B2B_CLIENT && (
                    <CheckCircle2 className="absolute top-2 right-2 h-4 w-4 text-purple-600" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="block w-full pl-10 sm:text-sm text-gray-900 placeholder-gray-400 border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 py-3 transition-colors bg-gray-50 hover:bg-white"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email Address</label>
              <div className="mt-1 relative rounded-md shadow-sm">
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
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="block w-full pl-10 sm:text-sm text-gray-900 placeholder-gray-400 border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 py-3 transition-colors bg-gray-50 hover:bg-white"
                  placeholder="Minimum 6 characters"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="block w-full pl-10 sm:text-sm text-gray-900 placeholder-gray-400 border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 py-3 transition-colors bg-gray-50 hover:bg-white"
                  placeholder="Re-enter password"
                />
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
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
