'use client';
import { Search, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AdminPageContainer, AdminCard } from '@/components/admin/AdminComponents';
import { UserTable } from '@/components/admin/UserTable';
import {
  fetchUsers,
  editUser,
  deactivateUser,
  activateUser,
  blockUser,
  banUser,
  removeUser,
} from '@/store/slices/user/adminUsersSlice';
import Button from '@/components/ui/Button';

export default function AdminUsersPage() {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector(state => state.adminUsers);
  const currentUser = useSelector(state => state.user?.user);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const roleFields = {
    doctor: [
      { name: 'specialty', label: 'Specialty', type: 'text' },
      { name: 'licenseNumber', label: 'License Number', type: 'text' },
      { name: 'yearsOfExperience', label: 'Years of Experience', type: 'number' },
    ],
    pharmacist: [
      { name: 'licenseNumber', label: 'License Number', type: 'text' },
      { name: 'pharmacyName', label: 'Pharmacy Name', type: 'text' },
    ],
    patient: [
      { name: 'age', label: 'Age', type: 'number' },
      { name: 'gender', label: 'Gender', type: 'select', options: ['male', 'female', 'other'] },
      { name: 'address', label: 'Address', type: 'text' },
      { name: 'phoneNumber', label: 'Phone Number', type: 'text' },
    ],
  };
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'patient' });
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState(null);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const filteredUsers = Array.isArray(users) ? users.filter(user =>
    user.id !== currentUser?.id &&
    ((user.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
     (user.role?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
     (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()))
  ) : [];

  // Action handlers for UserTable
  const handleEditUser = (userId, data) => dispatch(editUser({ userId, data }));
  const handleDeactivateUser = (userId) => dispatch(deactivateUser(userId));
  const handleActivateUser = (userId) => dispatch(activateUser(userId));
  const handleBlockUser = (userId) => dispatch(blockUser(userId));
  const handleBanUser = (userId) => dispatch(banUser(userId));
  const handleDeleteUser = (userId) => dispatch(removeUser(userId));

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setCreating(true);
    setCreateError(null);
    try {
      await dispatch(createUser(newUser)).unwrap();
      setShowCreateModal(false);
      setNewUser({ name: '', email: '', password: '', role: 'patient' });
      dispatch(fetchUsers());
    } catch (err) {
      setCreateError(err.message || 'Failed to create user');
    } finally {
      setCreating(false);
    }
  };

  return (
    <AdminPageContainer
      title="User Management"
      description="Manage users in the system (Doctors, Patients, Pharmacists, Admins)."
    >
      <AdminCard title="Users List">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-4 sm:space-y-0">
          <div className="w-full sm:w-auto flex gap-2 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search Users"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              />
            </div>
            <Button variant="primary" className="flex gap-2 items-center" onClick={() => setShowCreateModal(true)}>
              <Plus className="w-4 h-4" /> Create User
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-muted-foreground">Loading users...</p>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-destructive">{error}</p>
            </div>
          ) : (
            <UserTable
              users={filteredUsers}
              onEdit={handleEditUser}
              onDeactivate={handleDeactivateUser}
              onActivate={handleActivateUser}
              onBlock={handleBlockUser}
              onBan={handleBanUser}
              onDelete={handleDeleteUser}
            />
          )}
        </div>
        {/* Create User Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-card rounded-lg shadow-lg p-6 w-full max-w-md border border-border">
              <h2 className="text-lg font-semibold mb-4">Create User</h2>
              <form onSubmit={handleCreateUser} className="space-y-4">
                <div>
                  <label className="block mb-1">Name</label>
                  <input
                    className="w-full border border-border rounded-lg px-3 py-2"
                    value={newUser.name}
                    onChange={e => setNewUser({ ...newUser, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1">Email</label>
                  <input
                    className="w-full border border-border rounded-lg px-3 py-2"
                    value={newUser.email}
                    onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1">Password</label>
                  <input
                    type="password"
                    className="w-full border border-border rounded-lg px-3 py-2"
                    value={newUser.password}
                    onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1">Role</label>
                  <select
                    className="w-full border border-border rounded-lg px-3 py-2"
                    value={newUser.role}
                    onChange={e => setNewUser({ ...newUser, role: e.target.value })}
                    required
                  >
                    <option value="admin">Admin</option>
                    <option value="doctor">Doctor</option>
                    <option value="patient">Patient</option>
                    <option value="pharmacist">Pharmacist</option>
                  </select>
                </div>
                {/* Render extra fields based on role */}
                {roleFields[newUser.role]?.map(field => (
                  <div key={field.name}>
                    <label className="block mb-1">{field.label}</label>
                    {field.type === 'select' ? (
                      <select
                        className="w-full border border-border rounded-lg px-3 py-2"
                        value={newUser[field.name] || ''}
                        onChange={e => setNewUser({ ...newUser, [field.name]: e.target.value })}
                      >
                        <option value="">Select {field.label}</option>
                        {field.options.map(opt => (
                          <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={field.type}
                        className="w-full border border-border rounded-lg px-3 py-2"
                        value={newUser[field.name] || ''}
                        onChange={e => setNewUser({ ...newUser, [field.name]: e.target.value })}
                      />
                    )}
                  </div>
                ))}
                {createError && <div className="text-destructive text-sm">{createError}</div>}
                <div className="flex justify-end gap-2 mt-4">
                  <Button type="button" variant="secondary" onClick={() => setShowCreateModal(false)}>Cancel</Button>
                  <Button type="submit" variant="primary" disabled={creating}>{creating ? 'Creating...' : 'Create'}</Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </AdminCard>
    </AdminPageContainer>
  );
}