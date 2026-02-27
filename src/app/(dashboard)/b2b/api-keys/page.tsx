// src/app/(dashboard)/b2b/api-keys/page.tsx
import { Key, ShieldAlert, Code } from 'lucide-react';

export default function B2BApiKeysPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Key className="h-6 w-6 text-blue-600 dark:text-purple-400" />
          API & Webhook Security
        </h1>
        <p className="mt-2 text-sm text-gray-700 dark:text-gray-400">
          Manage your platform integrations and secure your endpoint communications.
        </p>
      </div>

      <div className="rounded-xl border border-yellow-200 dark:border-yellow-500/20 bg-yellow-50 dark:bg-yellow-500/10 p-6 shadow-sm">
        <div className="flex gap-4">
          <div className="flex-shrink-0">
            <ShieldAlert className="h-6 w-6 text-yellow-600 dark:text-yellow-500" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-yellow-800 dark:text-yellow-200">API Key Security</h3>
            <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300 space-y-2">
              <p>
                Your primary <strong>x-api-key</strong> was provided to you securely during the initial admin onboarding process. 
                For security reasons, we do not store the plain text API key on our servers, and it cannot be displayed here.
              </p>
              <p>
                If you have lost your API key, please contact your Platform Administrator to rotate your credentials.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1a1025] shadow sm:rounded-lg border border-gray-200 dark:border-white/10 overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-base font-semibold leading-6 text-gray-900 dark:text-white flex items-center gap-2">
            <Code className="h-5 w-5 text-gray-400 dark:text-gray-500" />
            Webhook Integration Guide
          </h3>
          <div className="mt-3 text-sm text-gray-500 dark:text-gray-400 space-y-4">
            <p>
              When a user completes a spin that results in a deduction or win, the Continuous Engine will dispatch a webhook event to your configured endpoint. 
              You must verify these payloads to ensure they originated from the Lucky Engine platform.
            </p>
            
            <div className="bg-gray-50 dark:bg-[#150d1d] p-4 rounded-md border border-gray-200 dark:border-white/10">
              <h4 className="font-medium text-gray-900 dark:text-gray-200 mb-2">Signature Verification (Node.js Example)</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                The payload signature is sent in the <code>X-Webhook-Signature</code> header.
              </p>
              <pre className="bg-gray-900 dark:bg-black text-gray-100 p-4 rounded-md overflow-x-auto text-xs font-mono">
{`const crypto = require('crypto');

function verifyWebhook(payload, signatureHeader, webhookSecret) {
  // 1. Stringify the exact raw body received
  const payloadString = JSON.stringify(payload);
  
  // 2. Generate HMAC SHA256 signature
  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(payloadString)
    .digest('hex');
    
  // 3. Compare with a constant-time check to prevent timing attacks
  return crypto.timingSafeEqual(
    Buffer.from(expectedSignature),
    Buffer.from(signatureHeader)
  );
}`}
              </pre>
            </div>

            <p className="text-xs text-gray-400 mt-4">
              To update your Webhook URL or Webhook Secret, please utilize the platform administration API or contact support.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
