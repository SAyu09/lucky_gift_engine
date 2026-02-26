// src/app/(dashboard)/user/wallet/page.tsx
import { Wallet, ArrowDownRight, ArrowUpRight, History, Coins } from 'lucide-react';

export default function UserWalletPage() {
  // Mock data for the static UI representing the user's wallet and history
  const recentTransactions = [
    { id: 'tx-81a2b3c4', date: '2026-02-25 14:32', type: 'SPIN', amount: 50, multiplier: 2.5, winAmount: 125, status: 'SUCCESS' },
    { id: 'tx-29f8e7d6', date: '2026-02-25 14:30', type: 'SPIN', amount: 100, multiplier: 0, winAmount: 0, status: 'SUCCESS' },
    { id: 'tx-c5b4a392', date: '2026-02-25 14:15', type: 'SPIN', amount: 10, multiplier: 10, winAmount: 100, status: 'SUCCESS' },
    { id: 'tx-1d2e3f4g', date: '2026-02-25 10:05', type: 'DEPOSIT', amount: 5000, multiplier: null, winAmount: null, status: 'SUCCESS' },
    { id: 'tx-5h6j7k8l', date: '2026-02-24 18:22', type: 'SPIN', amount: 50, multiplier: 0.5, winAmount: 25, status: 'SUCCESS' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Wallet className="h-7 w-7 text-blue-600" />
          My Wallet
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Manage your virtual funds and view your complete transaction history on the platform.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Balance Card */}
        <div className="md:col-span-1 bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-6 shadow-xl text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Coins className="h-32 w-32" />
          </div>
          <div className="relative z-10">
            <h2 className="text-gray-400 font-medium text-sm tracking-wider uppercase">Current Balance</h2>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-4xl font-black">54,320</span>
              <span className="text-gray-400 font-medium">Coins</span>
            </div>
            
            <div className="mt-8 space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Total Wagered</span>
                <span className="font-medium text-gray-200">12,500</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Total Won</span>
                <span className="font-medium text-green-400">+17,820</span>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3">
              <button className="bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors">
                Deposit
              </button>
              <button className="bg-gray-700 hover:bg-gray-600 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors">
                Withdraw
              </button>
            </div>
          </div>
        </div>

        {/* Transaction History Table */}
        <div className="md:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <History className="h-5 w-5 text-gray-400" />
              Recent Transactions
            </h3>
            <span className="text-xs font-medium bg-blue-50 text-blue-600 px-3 py-1 rounded-full">Mock Data</span>
          </div>
          
          <div className="overflow-x-auto flex-grow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50/50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date / ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Result</th>
                  <th scope="col" className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {recentTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{tx.date}</div>
                      <div className="text-xs text-gray-500 font-mono mt-0.5">{tx.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        tx.type === 'SPIN' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {tx.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                      {tx.type === 'DEPOSIT' ? (
                        <span className="text-blue-600">+{tx.amount}</span>
                      ) : (
                        <span>-{tx.amount}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      {tx.type === 'SPIN' ? (
                        <>
                          <div className="text-xs font-medium text-gray-500">{tx.multiplier}x</div>
                          <div className={`text-sm font-bold flex items-center justify-end gap-1 mt-0.5 ${
                            (tx.winAmount || 0) > tx.amount ? 'text-green-600' : 
                            (tx.winAmount || 0) > 0 ? 'text-yellow-600' : 'text-gray-400'
                          }`}>
                            {(tx.winAmount || 0) > 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                            {tx.winAmount}
                          </div>
                        </>
                      ) : (
                        <span className="text-gray-400 text-sm">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                       <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-200/50">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                          {tx.status}
                        </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
