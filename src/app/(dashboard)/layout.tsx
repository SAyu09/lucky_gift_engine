// src/app/(dashboard)/layout.tsx
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { RoleGuard } from '@/components/layout/RoleGuard';
import { Role } from '@/types/auth.types';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Top level RoleGuard ensures *no one* can see the dashboard shell without auth at all
    // We allow all roles here; specific routes (e.g., /admin/...) will need additional deeper RoleGuards or Server Side checks
    <RoleGuard allowedRoles={[Role.ADMIN, Role.B2B_CLIENT, Role.USER]}>
      <div className="flex h-screen bg-gray-50 font-sans text-gray-900 antialiased overflow-hidden">
        {/* Sidebar Component */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Header Component */}
          <Header />

          {/* Scrollable Page Content */}
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl">
              {children}
            </div>
          </main>
        </div>
      </div>
    </RoleGuard>
  );
}
