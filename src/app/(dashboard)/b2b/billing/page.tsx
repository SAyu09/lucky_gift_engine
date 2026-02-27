import { Receipt, CreditCard, Download, TrendingUp } from 'lucide-react';

export default function BillingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Receipt className="h-6 w-6 text-blue-600 dark:text-purple-400" />
          Billing Controls
        </h1>
        <p className="mt-2 text-sm text-gray-700 dark:text-gray-400">
          Monitor usage, manage subscriptions, and download billing reports.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1a1025] p-6 shadow-sm">
           <dt className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400">
             <TrendingUp className="h-5 w-5 text-purple-500" />
             Current Monthly Usage
           </dt>
           <dd className="mt-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
             142,094 <span className="text-lg font-normal text-gray-500">spins</span>
           </dd>
        </div>
        <div className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1a1025] p-6 shadow-sm">
           <dt className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400">
             <CreditCard className="h-5 w-5 text-blue-500" />
             Estimated Bill
           </dt>
           <dd className="mt-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
             $142.09
           </dd>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1a1025] shadow-sm border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center border-b border-gray-200 dark:border-white/10">
          <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">Recent Invoices</h3>
          <button className="text-sm text-blue-600 dark:text-purple-400 hover:text-blue-500 font-medium">View All</button>
        </div>
        <div className="p-12 text-center">
           <Receipt className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600" />
           <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No invoices yet</h3>
           <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">You will be billed at the end of your billing cycle.</p>
        </div>
      </div>
    </div>
  );
}
