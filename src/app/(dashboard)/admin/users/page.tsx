// src/app/(dashboard)/admin/users/page.tsx
'use client';

import React, { useState } from 'react';
import { Users, Search, MoreVertical, Mail } from 'lucide-react';

interface PlatformUser {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'B2B_CLIENT' | 'USER';
  joinDate: string;
  status: 'ACTIVE' | 'SUSPENDED';
}

export default function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState('');

  // Robust mock data array representing platform users
  const mockUsers: PlatformUser[] = [
    { id: 'usr-admin-01', name: 'System Administrator', email: 'admin@luckyengine.com', role: 'ADMIN', joinDate: '2026-01-01', status: 'ACTIVE' },
    { id: 'usr-b2b-01', name: 'Casino Royale Tech', email: 'api@casinoroyale.com', role: 'B2B_CLIENT', joinDate: '2026-01-15', status: 'ACTIVE' },
    { id: 'usr-b2b-02', name: 'Global Spin Partners', email: 'dev@globalspin.io', role: 'B2B_CLIENT', joinDate: '2026-02-10', status: 'ACTIVE' },
    { id: 'usr-892', name: 'Alex Player', email: 'alex@example.com', role: 'USER', joinDate: '2026-02-20', status: 'ACTIVE' },
    { id: 'usr-114', name: 'Sam Tester', email: 'sam@example.com', role: 'USER', joinDate: '2026-02-21', status: 'ACTIVE' },
    { id: 'usr-552', name: 'Suspicious Account', email: 'bot1234@temp.com', role: 'USER', joinDate: '2026-02-24', status: 'SUSPENDED' },
  ];

  const filteredUsers = mockUsers.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Users className="h-6 w-6 text-blue-600 dark:text-purple-400" />
            Platform Users Management
          </h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-400">
            View and manage all registered accounts across the entire Lucky Engine ecosystem.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1a1025] shadow-sm border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden">
        
        {/* Search Bar */}
        <div className="p-4 border-b border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-[#1a1025]">
          <div className="relative w-full sm:max-w-md">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 text-gray-400 dark:text-gray-500" />
            </div>
            <input
              type="text"
              className="block w-full rounded-md border border-gray-300 dark:border-white/10 bg-white dark:bg-[#1f132b] py-2 pl-10 pr-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
              placeholder="Search users by name, email, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* User Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-white/10">
            <thead className="bg-gray-50 dark:bg-[#1f132b]">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">User</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Role</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Joined Date</th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-[#1a1025] divide-y divide-gray-200 dark:divide-white/10">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-[#1f132b] transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-purple-500/20 dark:to-indigo-500/20 flex items-center justify-center border border-blue-200 dark:border-purple-500/30">
                         <span className="text-blue-700 dark:text-purple-300 font-bold text-sm">
                           {user.name.charAt(0).toUpperCase()}
                         </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-200">{user.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-mono text-gray-600 dark:text-gray-400">{user.id}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.role === 'ADMIN' ? 'bg-purple-100 dark:bg-purple-500/10 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-500/20' :
                      user.role === 'B2B_CLIENT' ? 'bg-blue-100 dark:bg-blue-500/10 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-500/20' :
                      'bg-gray-100 dark:bg-gray-500/10 text-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-500/20'
                    }`}>
                      {user.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                      user.status === 'ACTIVE' ? 'bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 dark:border-green-500/20' : 'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/20'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {user.joinDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                      <MoreVertical className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredUsers.length === 0 && (
             <div className="text-center py-12">
               <Users className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600" />
               <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-200">No users found</h3>
               <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">No users match your current search.</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
