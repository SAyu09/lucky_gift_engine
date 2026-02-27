import { Database, Plus, Search, Filter } from 'lucide-react';

export default function RewardPoolPage() {
  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Database className="h-6 w-6 text-blue-600 dark:text-purple-400" />
            Reward Pool
          </h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-400">
            Manage your prize inventory, track availability, and set restock alerts.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            className="block rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Inventory
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1a1025] shadow-sm border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#1a1025] flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-96">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 text-gray-400 dark:text-gray-500" />
            </div>
            <input
              type="text"
              className="block w-full rounded-md border border-gray-300 dark:border-white/10 bg-white dark:bg-[#1f132b] py-2 pl-10 pr-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none"
              placeholder="Search inventory items..."
            />
          </div>
          <button className="inline-flex items-center gap-2 rounded-md border border-gray-300 dark:border-white/10 bg-white dark:bg-[#1f132b] px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm hover:bg-gray-50 dark:hover:bg-[#2a173d] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
             <Filter className="h-4 w-4 text-gray-400 dark:text-gray-500" />
             Filter
          </button>
        </div>
        
        <div className="p-12 text-center">
           <Database className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600" />
           <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No inventory items found</h3>
           <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by adding a new reward to your pool.</p>
        </div>
      </div>
    </div>
  );
}
