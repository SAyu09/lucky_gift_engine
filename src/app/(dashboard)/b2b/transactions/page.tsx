// src/app/(dashboard)/b2b/transactions/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useB2B } from '@/hooks/api/useB2B';
import { History, Search, Filter, ShieldAlert } from 'lucide-react';

// Mock type for the UI since the backend GET /transactions might not be fully modeled yet
interface TransactionAudit {
  id: string; // The transactionId
  date: string;
  userId: string;
  giftName: string;
  betAmount: number;
  winAmount: number;
  multiplier: number;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
  isDowngraded?: boolean; // Flag to indicate if RTP Shield intervened
}

export default function B2BTransactionsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [transactions, setTransactions] = useState<any[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  
  const { getTransactions } = useB2B();

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const queryParams: any = {
        page: currentPage,
        limit: 10,
      };

      if (searchTerm) {
        if (searchTerm.startsWith('tx-') || searchTerm.length > 20) {
           queryParams.transactionId = searchTerm;
        } else {
           queryParams.userId = searchTerm;
        }
      }

      const response = await getTransactions(queryParams);
      if (response && response.data) {
        setTransactions(response.data);
        setTotalItems(response.meta?.total || 0); // response has meta instead of pagination
      }
    } catch (err) {
      console.error('Failed to fetch transactions', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchTransactions();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, currentPage]);

  const handleNextPage = () => {
    if (currentPage * 10 < totalItems) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <History className="h-6 w-6 text-blue-600 dark:text-purple-400" />
            Transaction Audit Logs
          </h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-400">
            Immutable ledger of all spin executions processed by the Continuous Engine for your platform.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1a1025] shadow-sm border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#1a1025] flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-96">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full rounded-md border border-gray-300 dark:border-white/10 bg-white dark:bg-[#1f132b] py-2 pl-10 pr-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
              placeholder="Search by Transaction ID or User ID..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset page on search
              }}
            />
          </div>
          <button className="inline-flex items-center gap-2 rounded-md border border-gray-300 dark:border-white/10 bg-white dark:bg-[#1f132b] px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm hover:bg-gray-50 dark:hover:bg-[#2a173d] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
             <Filter className="h-4 w-4 text-gray-400 dark:text-gray-500" />
             Filter Results
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-white/10">
            <thead className="bg-gray-50 dark:bg-[#1f132b]">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date & Time</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Transaction ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">User ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Gift</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Bet</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Win (Mult)</th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-[#1a1025] divide-y divide-gray-200 dark:divide-white/10">
              {transactions.map((tx: any) => (
                <tr key={tx.transactionId} className="hover:bg-gray-50 dark:hover:bg-[#1f132b] transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {new Date(tx.createdAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-mono text-gray-900 dark:text-gray-200 bg-gray-100 dark:bg-white/10 px-2 py-1 rounded">{tx.transactionId}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600 dark:text-purple-400">
                    {tx.endUserId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {tx.giftId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 text-right font-medium">
                    --
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      {tx.isDowngraded && (
                        <div title="RTP Shield Intervened (Downgrade)">
                           <ShieldAlert className="h-4 w-4 text-yellow-500" />
                        </div>
                      )}
                      <div className="flex flex-col items-end">
                        <span className={`text-sm font-bold ${tx.payoutStatus === 'SUCCESS' ? 'text-green-600' : 'text-gray-400'}`}>
                          {/* We don't have winAmount in standard output but maybe from other props, just placeholder */}
                          {tx.payoutStatus === 'SUCCESS' ? '+' : ''}--
                        </span>
                        <span className="text-xs text-gray-400">--x</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                      tx.payoutStatus === 'SUCCESS' ? 'bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-500/20' : 
                      tx.payoutStatus === 'FAILED' ? 'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/20' : 
                      'bg-yellow-50 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-500/20'
                    }`}>
                      {tx.payoutStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {transactions.length === 0 && !isLoading && (
             <div className="text-center py-12">
               <History className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600" />
               <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No transactions found</h3>
               <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Try adjusting your search query.</p>
             </div>
          )}

          {isLoading && (
            <div className="text-center py-12">
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Loading...</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="border-t border-gray-200 dark:border-white/10 bg-white dark:bg-[#1a1025] px-4 py-3 flex items-center justify-between sm:px-6">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Showing <span className="font-medium">{(currentPage - 1) * 10 + (transactions.length > 0 ? 1 : 0)}</span> to <span className="font-medium">{(currentPage - 1) * 10 + transactions.length}</span> of <span className="font-medium">{totalItems}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button disabled={currentPage === 1} onClick={handlePrevPage} className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-white/10 bg-white dark:bg-[#1f132b] text-sm font-medium text-gray-700 dark:text-gray-300 disabled:text-gray-300 dark:disabled:text-gray-600 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-[#2a173d]">
                  Previous
                </button>
                <div className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-white/10 bg-white dark:bg-[#1f132b] text-sm font-medium text-gray-700 dark:text-gray-300">
                   Page {currentPage} of {Math.ceil(totalItems / 10) || 1}
                </div>
                <button disabled={currentPage * 10 >= totalItems} onClick={handleNextPage} className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-white/10 bg-white dark:bg-[#1f132b] text-sm font-medium text-gray-700 dark:text-gray-300 disabled:text-gray-300 dark:disabled:text-gray-600 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-[#2a173d]">
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
