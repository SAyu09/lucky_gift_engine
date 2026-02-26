// src/app/(dashboard)/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { Role } from '@/types/auth.types';
import { Loader2 } from 'lucide-react';

/**
 * Root Dashboard Router
 * This page serves purely as a traffic controller to direct authenticated
 * users to their specific domain based on their Role.
 */
export default function DashboardRootPage() {
  const router = useRouter();
  const { role, isAuthenticated } = useAuthStore();

  useEffect(() => {
    // If we land here but somehow aren't authenticated (which shouldn't 
    // happen due to RoleGuard, but as a safety net), go to login.
    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }

    // Role-based routing to their respective home pages
    switch (role) {
      case Role.ADMIN:
        router.replace('/admin/users');
        break;
      case Role.B2B_CLIENT:
        router.replace('/b2b/configurations');
        break;
      case Role.USER:
        router.replace('/user/play');
        break;
      default:
        // Safest fallback if role is unrecognized
        router.replace('/login');
        break;
    }
  }, [role, isAuthenticated, router]);

  // While processing the redirect, show a generic full-screen loader 
  // consistent with the platform feel.
  return (
    <div className="flex h-[80vh] w-full flex-col items-center justify-center space-y-4">
      <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      <p className="text-sm font-medium text-gray-500 animate-pulse">
        Loading your dashboard...
      </p>
    </div>
  );
}
