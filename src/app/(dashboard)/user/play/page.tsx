// src/app/(dashboard)/user/play/page.tsx
import { SpinControls } from '@/components/features/engine/SpinControls';
import { Gamepad2 } from 'lucide-react';

export default function UserPlayPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-2">
          <Gamepad2 className="h-8 w-8 text-blue-600" />
          Test the Engine
        </h1>
        <p className="mt-3 text-base text-gray-600">
          Welcome to the playground. Select a gift configuration and input your bet amount to interact directly with the Continuous Engine.
        </p>
      </div>

      <div className="pt-4 pb-12 w-full">
        <SpinControls />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-gray-200">
        <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100">
          <h3 className="font-semibold text-blue-900">Idempotency Secured</h3>
          <p className="text-sm text-blue-800 mt-2">Every spin generates a unique UUID `transactionId` ensuring zero risk of double charges even on network retries.</p>
        </div>
        <div className="bg-purple-50 p-5 rounded-2xl border border-purple-100">
          <h3 className="font-semibold text-purple-900">B2B Integration Ready</h3>
          <p className="text-sm text-purple-800 mt-2">This UI acts as a proxy, mimicking how a B2B platform would dispatch spin requests from their user clients.</p>
        </div>
        <div className="bg-green-50 p-5 rounded-2xl border border-green-100">
          <h3 className="font-semibold text-green-900">Instant Settlement</h3>
          <p className="text-sm text-green-800 mt-2">Win or lose, the Continuous Engine settles the outcome in milliseconds and dispatches the webhook.</p>
        </div>
      </div>
    </div>
  );
}
