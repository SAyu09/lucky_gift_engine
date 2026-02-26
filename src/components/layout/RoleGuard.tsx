// src/components/layout/RoleGuard.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { Role } from '@/types/auth.types';
import { Loader2 } from 'lucide-react';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: Role[];
}

export function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const router = useRouter();
  const { role, isAuthenticated } = useAuthStore();
  const [isHydrated, setIsHydrated] = useState(false);

  // Zustand persist hygiene: 
  // Wait until client has hydrated the store from localStorage before checking auth
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsHydrated(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

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
  }, [isHydrated, isAuthenticated, role, allowedRoles, router]);

  // Show a clean loading state while checking hydration and permissions
  if (!isHydrated || !isAuthenticated || (role && !allowedRoles.includes(role))) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  // If we made it here, they are authenticated and authorized
  return <>{children}</>;
}
