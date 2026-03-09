// src/components/layout/RoleGuard.tsx
'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { Role } from '@/types/auth.types';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/api/useAuth';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: Role[];
}

export function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const router = useRouter();
  const { role, isAuthenticated } = useAuthStore();
  const { getMe } = useAuth();
  
  const [isHydrated, setIsHydrated] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(true);
  const hasFetched = useRef(false);

  // Zustand persist hygiene: 
  // Wait until client has hydrated the store from localStorage before checking auth
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsHydrated(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // 🟢 Fetch fresh user data (including paymentStatus) on full page reload
  // This triggers specifically when Stripe redirects the user back to the application
  useEffect(() => {
    if (!isHydrated || hasFetched.current) return;

    if (isAuthenticated) {
      hasFetched.current = true;
      getMe()
        .catch(() => {
          // If token is expired or invalid, getMe automatically handles logout via the hook
        })
        .finally(() => {
          setIsRefreshing(false);
        });
    } else {
      setIsRefreshing(false);
    }
  }, [isHydrated, isAuthenticated, getMe]);

  // Route protection logic
  useEffect(() => {
    // Wait until hydration and background refresh are complete
    if (!isHydrated || isRefreshing) return;

    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }

    if (role && !allowedRoles.includes(role)) {
      // Fallback routing if user tries to access a route they don't have permission for
      switch (role) {
        case Role.ADMIN:
          router.replace('/admin/global-stats');
          break;
        case Role.B2B_CLIENT:
          router.replace('/b2b/configurations');
          break;
        case Role.USER:
        default:
          router.replace('/user/play');
          break;
      }
    }
  }, [isHydrated, isRefreshing, isAuthenticated, role, allowedRoles, router]);

  // Show a clean loading state while checking hydration and fetching fresh profile data
  if (!isHydrated || isRefreshing || !isAuthenticated || (role && !allowedRoles.includes(role))) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50 dark:bg-[#191022]">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    );
  }

  // If we made it here, they are authenticated, authorized, and their state is 100% synced with DB
  return <>{children}</>;
}