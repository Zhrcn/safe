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
  createUser
} from '@/store/slices/user/adminUsersSlice';
import Button from '@/components/ui/Button';
import { useSafeTranslation } from '@/hooks/useSafeTranslation';

export default function AdminUsersPage() {
  const { t } = useSafeTranslation();
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
  const [newUser, setNewUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'patient',
    age: '',
    gender: '',
    phoneNumber: '',
    address: '',
    specialty: '',
    licenseNumber: '',
    yearsOfExperience: '',
    pharmacyName: ''
  });
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

  const handleEditUser = (userId, data) => dispatch(editUser({ userId, data }));
  const handleDeactivateUser = (userId) => dispatch(deactivateUser(userId));
  const handleActivateUser = (userId) => dispatch(activateUser(userId));
  const handleBlockUser = (userId) => dispatch(blockUser(userId));
  const handleBanUser = (userId) => dispatch(banUser(userId));
  const handleDeleteUser = (userId) => dispatch(removeUser(userId));

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (creating) return; 
    setCreating(true);
    setCreateError(null);
    try {
      console.log('Creating user with data:', newUser);
      const result = await dispatch(createUser(newUser)).unwrap();
      console.log('User creation result:', result);
      setShowCreateModal(false);
      setNewUser({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: 'patient',
        age: '',
        gender: '',
        phoneNumber: '',
        address: '',
        specialty: '',
        licenseNumber: '',
        yearsOfExperience: '',
        pharmacyName: ''
      });
      dispatch(fetchUsers());
    } catch (err) {
      console.error('User creation error:', err);
      setCreateError(err.message || 'Failed to create user');
    } finally {
      setCreating(false);
    }
  };

  return (
    <AdminPageContainer
      title={t('admin.userManagement.title')}
      description={t('admin.userManagement.description')}
    >
      <AdminCard title={t('admin.users.list')}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-4 sm:space-y-0">
          <div className="w-full sm:w-auto flex gap-2 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" size={20} />
              <input
                type="text"
                placeholder={t('admin.users.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              />
            </div>
            <Button
              variant="primary"
              className="flex gap-2 items-center px-6 py-2 text-base font-semibold rounded-2xl shadow-md focus:outline-none focus:ring-2 focus:ring-primary"
              onClick={() => setShowCreateModal(true)}
            >
              <Plus className="w-5 h-5" /> {t('admin.users.createUser')}
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-muted-foreground">{t('loadingUsers', 'Loading users...')}</p>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-danger">{error}</p>
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
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-card rounded-lg shadow-lg p-6 w-full max-w-lg border border-border relative">
              <button
                type="button"
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 dark:hover:text-white text-2xl font-bold focus:outline-none"
                onClick={() => setShowCreateModal(false)}
                aria-label={t('admin.users.cancel')}
              >
                &times;
              </button>
              <h2 className="text-2xl font-bold mb-6 text-center">{t('admin.users.createUser')}</h2>
              <form onSubmit={handleCreateUser} className="space-y-5">
                <div className="border-b pb-4 mb-4">
                  <h3 className="text-lg font-semibold mb-2">{t('admin.users.commonFields', 'Basic Information')}</h3>
                  <div className="flex gap-2 mb-2">
                    <input
                      className="w-1/2 border border-border rounded-lg px-3 py-2"
                      placeholder={t('admin.users.firstName', 'First Name')}
                      value={newUser.firstName}
                      onChange={e => setNewUser({ ...newUser, firstName: e.target.value })}
                      required
                    />
                    <input
                      className="w-1/2 border border-border rounded-lg px-3 py-2"
                      placeholder={t('admin.users.lastName', 'Last Name')}
                      value={newUser.lastName}
                      onChange={e => setNewUser({ ...newUser, lastName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-2">
                    <input
                      className="w-full border border-border rounded-lg px-3 py-2"
                      placeholder={t('admin.users.email')}
                      value={newUser.email}
                      onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-2">
                    <input
                      type="password"
                      className="w-full border border-border rounded-lg px-3 py-2"
                      placeholder={t('admin.users.password', 'Password')}
                      value={newUser.password}
                      onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-2">
                    <select
                      className="w-full border border-border rounded-lg px-3 py-2"
                      value={newUser.role}
                      onChange={e => setNewUser({ ...newUser, role: e.target.value })}
                      required
                    >
                      <option key="admin" value="admin">{t('admin.users.role', 'Admin')}</option>
                      <option key="doctor" value="doctor">{t('admin.users.doctor', 'Doctor')}</option>
                      <option key="patient" value="patient">{t('admin.users.patient', 'Patient')}</option>
                      <option key="pharmacist" value="pharmacist">{t('admin.users.pharmacist', 'Pharmacist')}</option>
                    </select>
                  </div>
                  <div className="mb-2">
                    <input
                      className="w-full border border-border rounded-lg px-3 py-2"
                      placeholder={t('admin.users.phoneNumber')}
                      value={newUser.phoneNumber}
                      onChange={e => setNewUser({ ...newUser, phoneNumber: e.target.value })}
                    />
                  </div>
                  <div>
                    <input
                      className="w-full border border-border rounded-lg px-3 py-2"
                      placeholder={t('admin.users.address')}
                      value={newUser.address}
                      onChange={e => setNewUser({ ...newUser, address: e.target.value })}
                    />
                  </div>
                </div>
                {newUser.role === 'patient' && (
                  <div className="border-b pb-4 mb-4">
                    <h3 className="text-lg font-semibold mb-2">{t('admin.users.patientFields', 'Patient Details')}</h3>
                    <div className="mb-2">
                      <input
                        type="number"
                        className="w-full border border-border rounded-lg px-3 py-2"
                        placeholder={t('admin.users.age')}
                        value={newUser.age}
                        onChange={e => setNewUser({ ...newUser, age: e.target.value })}
                      />
                    </div>
                    <div>
                      <select
                        className="w-full border border-border rounded-lg px-3 py-2"
                        value={newUser.gender}
                        onChange={e => setNewUser({ ...newUser, gender: e.target.value })}
                      >
                        <option key="" value="">{t('admin.users.selectGender', 'Select Gender')}</option>
                        <option key="male" value="male">{t('admin.users.male', 'Male')}</option>
                        <option key="female" value="female">{t('admin.users.female', 'Female')}</option>
                        <option key="other" value="other">{t('admin.users.other', 'Other')}</option>
                      </select>
                    </div>
                  </div>
                )}
                {newUser.role === 'doctor' && (
                  <div className="border-b pb-4 mb-4">
                    <h3 className="text-lg font-semibold mb-2">{t('admin.users.doctorFields', 'Doctor Details')}</h3>
                    <div className="mb-2">
                      <input
                        className="w-full border border-border rounded-lg px-3 py-2"
                        placeholder={t('admin.users.specialty')}
                        value={newUser.specialty}
                        onChange={e => setNewUser({ ...newUser, specialty: e.target.value })}
                        required
                      />
                    </div>
                    <div className="mb-2">
                      <input
                        className="w-full border border-border rounded-lg px-3 py-2"
                        placeholder={t('admin.users.licenseNumber')}
                        value={newUser.licenseNumber}
                        onChange={e => setNewUser({ ...newUser, licenseNumber: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        className="w-full border border-border rounded-lg px-3 py-2"
                        placeholder={t('admin.users.yearsOfExperience')}
                        value={newUser.yearsOfExperience}
                        onChange={e => setNewUser({ ...newUser, yearsOfExperience: e.target.value })}
                      />
                    </div>
                  </div>
                )}
                {newUser.role === 'pharmacist' && (
                  <div className="border-b pb-4 mb-4">
                    <h3 className="text-lg font-semibold mb-2">{t('admin.users.pharmacistFields', 'Pharmacist Details')}</h3>
                    <div className="mb-2">
                      <input
                        className="w-full border border-border rounded-lg px-3 py-2"
                        placeholder={t('admin.users.licenseNumber')}
                        value={newUser.licenseNumber}
                        onChange={e => setNewUser({ ...newUser, licenseNumber: e.target.value })}
                        required
                      />
                    </div>
                    <div className="mb-2">
                      <input
                        className="w-full border border-border rounded-lg px-3 py-2"
                        placeholder={t('admin.users.pharmacyName')}
                        value={newUser.pharmacyName}
                        onChange={e => setNewUser({ ...newUser, pharmacyName: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        className="w-full border border-border rounded-lg px-3 py-2"
                        placeholder={t('admin.users.yearsOfExperience')}
                        value={newUser.yearsOfExperience}
                        onChange={e => setNewUser({ ...newUser, yearsOfExperience: e.target.value })}
                      />
                    </div>
                  </div>
                )}
                {createError && <div className="text-danger text-sm text-center">{createError}</div>}
                <div className="flex justify-end gap-2 mt-4">
                  <Button type="button" variant="outline" className="rounded-2xl" onClick={() => setShowCreateModal(false)}>{t('admin.users.cancel')}</Button>
                  <Button type="submit" variant="success" disabled={creating}>{creating ? t('admin.users.creating', 'Creating...') : t('admin.users.create', 'Create')}</Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </AdminCard>
    </AdminPageContainer>
  );
}