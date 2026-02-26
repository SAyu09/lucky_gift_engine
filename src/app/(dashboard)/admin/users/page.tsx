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
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="h-6 w-6 text-blue-600" />
            Platform Users Management
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            View and manage all registered accounts across the entire Lucky Engine ecosystem.
          </p>
        </div>
      </div>

      <div className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden">
        
        {/* Search Bar */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="relative w-full sm:max-w-md">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm transition-colors"
              placeholder="Search users by name, email, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* User Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined Date</th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center border border-blue-200">
                         <span className="text-blue-700 font-bold text-sm">
                           {user.name.charAt(0).toUpperCase()}
                         </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-mono text-gray-600">{user.id}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800 border border-purple-200' :
                      user.role === 'B2B_CLIENT' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                      'bg-gray-100 text-gray-800 border border-gray-200'
                    }`}>
                      {user.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                      user.status === 'ACTIVE' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.joinDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors">
                      <MoreVertical className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredUsers.length === 0 && (
             <div className="text-center py-12">
               <Users className="mx-auto h-12 w-12 text-gray-300" />
               <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
               <p className="mt-1 text-sm text-gray-500">No users match your current search.</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
