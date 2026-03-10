// src/app/(dashboard)/admin/clients/page.tsx
"use client";

import { ClientOnboardingForm } from "@/components/features/admin/ClientOnboardingForm";
import { Users, ShieldCheck, Info } from "lucide-react";

export default function AdminClientsPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Users className="h-7 w-7 text-blue-600 dark:text-purple-400" />
          B2B Client Management
        </h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Onboard new partners to the Lucky Engine platform and automatically
          provision their secure API credentials and webhook secrets.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Onboarding Form - Takes 2/3 width */}
        <div className="lg:col-span-2">
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

        {/* Info Sidebar - Takes 1/3 width */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-xl p-5">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">
                  What happens next?
                </h3>
                <ul className="text-xs text-blue-800 dark:text-blue-400 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 dark:text-blue-400 font-bold">1.</span>
                    <span>
                      A unique <strong>API Key</strong> and{" "}
                      <strong>Webhook Secret</strong> are generated
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 dark:text-blue-400 font-bold">2.</span>
                    <span>
                      Credentials are <strong>hashed</strong> and stored securely
                      in the database
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 dark:text-blue-400 font-bold">3.</span>
                    <span>
                      Raw credentials are shown <strong>only once</strong> — save
                      them immediately
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 dark:text-blue-400 font-bold">4.</span>
                    <span>
                      Client can start integrating the Lucky Engine API into their
                      platform
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl p-5">
            <div className="flex items-start gap-3">
              <ShieldCheck className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-amber-900 dark:text-amber-300 mb-2">
                  Security Best Practices
                </h3>
                <ul className="text-xs text-amber-800 dark:text-amber-400 space-y-2">
                  <li>• API Keys are hashed using bcrypt (10 rounds)</li>
                  <li>• Webhook secrets use HMAC-SHA256 signatures</li>
                  <li>• Credentials cannot be recovered if lost</li>
                  <li>• Rotation requires admin intervention</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-white/10 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
              Quick Stats
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  Total Clients
                </span>
                <span className="text-sm font-bold text-gray-900 dark:text-white">
                  -
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  Active Today
                </span>
                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                  -
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600 dark:text-gray-400">
                  Pending Setup
                </span>
                <span className="text-sm font-bold text-amber-600 dark:text-amber-400">
                  -
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
