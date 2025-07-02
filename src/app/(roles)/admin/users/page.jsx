'use client';
import { Users, Search, Edit, UserX } from 'lucide-react';
import { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import { AdminPageContainer, AdminCard } from '@/components/admin/AdminComponents';
import { getUsers } from '@/services/adminService';
import { UserTable } from '@/components/admin/UserTable';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (error) {
        setUsers([]);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditUser = (userId) => {
    console.log('Edit User clicked for ID:', userId);
  };
  const handleToggleUserStatus = (userId, currentStatus) => {
    console.log(`Toggle status for User ID: ${userId}, current status: ${currentStatus}`);
  };

  return (
    <AdminPageContainer
      title="User Management"
      description="Manage users in the system (Doctors, Patients, Pharmacists, Admins)."
    >
      <AdminCard title="Users List">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-4 sm:space-y-0">
          <div className="w-full sm:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search Users"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              />
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-muted-foreground">Loading users...</p>
            </div>
          ) : (
            <UserTable users={filteredUsers} />
          )}
        </div>
      </AdminCard>
    </AdminPageContainer>
  );
}