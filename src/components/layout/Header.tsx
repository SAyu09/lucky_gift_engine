// src/components/layout/Header.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { useUIStore } from '@/store/useUIStore';
import { useAuth } from '@/hooks/api/useAuth';
import { Menu, LogOut, User as UserIcon, Loader2, Coins, Plus } from 'lucide-react';

export function Header() {
  const { user } = useAuthStore();
  const { toggleSidebar } = useUIStore();
  const { logout } = useAuth();
  const router = useRouter();
  
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      router.push('/login');
    } catch {
      // Fallback in case of network error during logout
      router.push('/login');
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Determine if this user role should see the Billing/Wallet UI module
  const showBilling = user?.role === 'B2B_CLIENT' || user?.role === 'USER';

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-gray-200 bg-white/80 backdrop-blur-md px-4 sm:px-6 shadow-sm transition-all duration-200">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 lg:hidden focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          aria-label="Toggle Sidebar"
        >
          <Menu className="h-6 w-6" />
        </button>
        
        {/* Breadcrumb / Title area */}
        <h2 className="text-lg font-semibold text-gray-800 hidden sm:flex items-center gap-2">
          Dashboard
          <span className="px-2 py-0.5 rounded-full bg-gray-100 text-xs text-gray-500 font-medium">Verified</span>
        </h2>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        
        {/* Payment / Billing Preparation */}
        {showBilling && (
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200/50 rounded-full cursor-pointer hover:shadow-sm hover:-translate-y-0.5 transition-all group mr-2">
            <Coins className="h-4 w-4 text-yellow-500 group-hover:animate-pulse" />
            <span className="text-sm font-bold text-yellow-700">54,320</span>
            <div className="w-px h-4 bg-yellow-200/60 mx-1"></div>
            <Plus className="h-4 w-4 text-yellow-600 hover:text-yellow-800" />
          </div>
        )}

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-sm font-medium text-gray-900 leading-tight">
              {user?.name || user?.email?.split('@')[0] || 'User'}
            </span>
            <span className="text-[11px] font-semibold tracking-wide text-gray-400 uppercase">
              {user?.role?.replace('_', ' ') || 'Guest'}
            </span>
          </div>
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center text-blue-600 border border-blue-200 shadow-inner">
            <UserIcon className="h-5 w-5" />
          </div>
        </div>
        
        <div className="h-6 w-px bg-gray-200 mx-1 sm:mx-2 hidden sm:block" />

        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-500 transition-colors disabled:opacity-50"
        >
          {isLoggingOut ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <LogOut className="h-4 w-4" />
          )}
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}
