// src/components/layout/Sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { useUIStore } from '@/store/useUIStore';
import { Role } from '@/types/auth.types';
import { 
  Users, 
  BarChart2, 
  Settings, 
  Key, 
  List, 
  Wallet, 
  PlayCircle,
  X 
} from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();
  const { role } = useAuthStore();
  const { isSidebarOpen, setSidebarOpen } = useUIStore();

  // Define navigation based on roles
  const getNavLinks = () => {
    switch (role) {
      case Role.ADMIN:
        return [
          { name: 'Global Stats', href: '/admin/global-stats', icon: BarChart2 },
          { name: 'Clients (B2B)', href: '/admin/clients', icon: Settings },
          { name: 'Users', href: '/admin/users', icon: Users },
        ];
      case Role.B2B_CLIENT:
        return [
          { name: 'Configurations', href: '/b2b/configurations', icon: Settings },
          { name: 'API Keys', href: '/b2b/api-keys', icon: Key },
          { name: 'Transactions', href: '/b2b/transactions', icon: List },
        ];
      case Role.USER:
        return [
          { name: 'Play', href: '/user/play', icon: PlayCircle },
          { name: 'Wallet', href: '/user/wallet', icon: Wallet },
        ];
      default:
        return [];
    }
  };

  const navLinks = getNavLinks();

  return (
    <>
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-900/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-white border-r border-gray-200 transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between px-6 border-b border-gray-200">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-blue-600">
            {/* Simple logo placeholder */}
            <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <span className="text-white text-sm">LE</span>
            </div>
            Lucky Engine
          </Link>
          <button 
            className="lg:hidden text-gray-500 hover:text-gray-700"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex flex-col gap-1 px-4 py-4">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">
            {role?.replace('_', ' ')} MENU
          </div>
          
          <nav className="space-y-1">
            {navLinks.map((item) => {
              const isActive = pathname.startsWith(item.href);
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-blue-50 text-blue-700' 
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                  onClick={() => {
                    // Auto-close on mobile after clicking a link
                    if (window.innerWidth < 1024) {
                      setSidebarOpen(false);
                    }
                  }}
                >
                  <Icon className={`h-5 w-5 ${isActive ? 'text-blue-700' : 'text-gray-400'}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}
