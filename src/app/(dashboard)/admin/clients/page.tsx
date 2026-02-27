// src/app/(dashboard)/admin/clients/page.tsx
import { ClientOnboardingForm } from '@/components/features/admin/ClientOnboardingForm';
import { Users, ShieldCheck } from 'lucide-react';

export default function AdminClientsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Users className="h-7 w-7 text-blue-600 dark:text-purple-400" />
          B2B Client Management
        </h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Onboard new partners to the Lucky Engine platform and automatically provision their secure API credentials and webhook secrets.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Onboarding Form Column (Takes 2/3 width on larger screens) */}
        <div className="md:col-span-2">
          <div className="bg-white dark:bg-[#1a1025] rounded-xl shadow-sm border border-gray-200 dark:border-white/10 overflow-hidden">
            <div className="border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#1a1025] px-6 py-4">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                New Client Onboarding
              </h2>
            </div>
            <div className="p-6">
              <ClientOnboardingForm />
            </div>
          </div>
        </div>

        {/* Info Column */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-blue-50 dark:bg-purple-500/10 rounded-xl p-5 border border-blue-100 dark:border-purple-500/20">
            <h3 className="text-sm font-bold text-blue-900 dark:text-purple-200 uppercase tracking-wider mb-2">How it works</h3>
            <ul className="text-sm text-blue-800 dark:text-purple-300 space-y-3 list-disc pl-4">
              <li>Enter the partner&apos;s Registered Company Name.</li>
              <li>Optionally provide their Webhook URL if already known.</li>
              <li>The system generates a cryptographically secure <strong className="text-blue-900 dark:text-purple-200">API Key</strong> and <strong className="text-blue-900 dark:text-purple-200">Webhook Secret</strong>.</li>
              <li>Distribute these credentials securely to the client over a trusted side-channel.</li>
            </ul>
          </div>

          <div className="bg-white dark:bg-[#1a1025] shadow-sm border border-gray-200 dark:border-white/10 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Active Clients Map</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              List of currently active B2B integrations across the engine network.
            </p>
            {/* Mock client list UI */}
            <div className="space-y-3">
              {[
                { name: 'Casino Royale Tech', id: 'crt-123' },
                { name: 'Global Spin Partners', id: 'gsp-456' }
              ].map((client) => (
                <div key={client.id} className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-white/5 last:border-0 pb-0">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{client.name}</span>
                  <span className="text-xs bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 px-2 py-1 rounded">Active</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
