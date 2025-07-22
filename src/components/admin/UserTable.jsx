import React, { useState } from 'react';
import { UserRoleBadge, UserStatusBadge } from './AdminComponents';
import { Edit, Trash2, Ban, ShieldOff, UserCheck, UserX, Lock } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableRow, TableHeader } from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import { useSafeTranslation } from '@/hooks/useSafeTranslation';

export function UserTable({ users = [], onEdit, onDeactivate, onActivate, onBlock, onBan, onDelete }) {
  const { t } = useSafeTranslation();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [editUser, setEditUser] = useState(null);
  const [confirmAction, setConfirmAction] = useState({ type: null, user: null });
  const [editData, setEditData] = useState({});

  const roleFields = {
    doctor: [
      { name: 'specialty', label: t('admin.users.specialty'), type: 'text' },
      { name: 'licenseNumber', label: t('admin.users.licenseNumber'), type: 'text' },
      { name: 'yearsOfExperience', label: t('admin.users.yearsOfExperience'), type: 'number' },
    ],
    pharmacist: [
      { name: 'licenseNumber', label: t('admin.users.licenseNumber'), type: 'text' },
      { name: 'pharmacyName', label: t('admin.users.pharmacyName'), type: 'text' },
    ],
    patient: [
      { name: 'age', label: t('admin.users.age'), type: 'number' },
      { name: 'gender', label: t('admin.users.gender'), type: 'select', options: ['male', 'female', 'other'] },
      { name: 'address', label: t('admin.users.address'), type: 'text' },
      { name: 'phoneNumber', label: t('admin.users.phoneNumber'), type: 'text' },
    ],
  };

  const filteredUsers = users.filter(user => {
    let name = user.name || ((user.firstName || '') + (user.lastName ? ' ' + user.lastName : '')) || '';
    if (typeof name !== 'string') name = String(name);
    const matchesSearch =
      name.toLowerCase().includes(search.toLowerCase()) ||
      (user.email?.toLowerCase() || '').includes(search.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const roles = Array.from(new Set(users.map(u => u.role)));

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (editUser && onEdit) {
      onEdit(editUser.id, editData);
      setEditUser(null);
      setEditData({});
    }
  };

  const handleConfirm = () => {
    if (!confirmAction.user) return;
    const { type, user } = confirmAction;
    if (type === 'deactivate') onDeactivate(user.id);
    if (type === 'activate') onActivate(user.id);
    if (type === 'block') onBlock(user.id);
    if (type === 'ban') onBan(user.id);
    if (type === 'delete') onDelete(user.id);
    setConfirmAction({ type: null, user: null });
  };

  return (
    <Card className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder={t('admin.users.searchPlaceholder')}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border border-border rounded-2xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <select
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
            className="border border-border rounded-2xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option key="all" value="all">{t('admin.users.allRoles')}</option>
            <option key="admin" value="admin">Admin</option>
            <option key="doctor" value="doctor">Doctor</option>
            <option key="patient" value="patient">Patient</option>
            <option key="pharmacist" value="pharmacist">Pharmacist</option>
          </select>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('admin.users.name')}</TableHead>
            <TableHead>{t('admin.users.email')}</TableHead>
            <TableHead>{t('admin.users.role')}</TableHead>
            <TableHead>{t('admin.users.status')}</TableHead>
            <TableHead>{t('admin.users.lastActive')}</TableHead>
            <TableHead align="right">{t('admin.users.actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground">{t('admin.users.noUsers')}</TableCell>
            </TableRow>
          ) : (
            filteredUsers.map(user => {
              const name = user.name || ((user.firstName || '') + (user.lastName ? ' ' + user.lastName : '')) || '';
              const safeName = typeof name === 'string' ? name : String(name);
              return (
                <TableRow key={user.id}>
                  <TableCell>{safeName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell><UserRoleBadge role={user.role} /></TableCell>
                  <TableCell><UserStatusBadge status={user.status} /></TableCell>
                  <TableCell>{user.lastLogin ? new Date(user.lastLogin).toLocaleString() : '-'}</TableCell>
                  <TableCell align="right">
                    <div className="flex gap-1 flex-wrap justify-end">
                      <Button variant="info" size="sm" onClick={() => { setEditUser(user); setEditData({ name: safeName, email: user.email, role: user.role }); }}><Edit className="w-4 h-4" /></Button>
                      {user.status === 'active' ? (
                        <Button variant="warning" size="sm" onClick={() => setConfirmAction({ type: 'deactivate', user })}><UserX className="w-4 h-4" /></Button>
                      ) : (
                        <Button variant="success" size="sm" onClick={() => setConfirmAction({ type: 'activate', user })}><UserCheck className="w-4 h-4" /></Button>
                      )}
                      <Button variant="secondary" size="sm" onClick={() => setConfirmAction({ type: 'block', user })}><Lock className="w-4 h-4" /></Button>
                      <Button variant="warning" size="sm" onClick={() => setConfirmAction({ type: 'ban', user })}><Ban className="w-4 h-4" /></Button>
                      <Button variant="danger" size="sm" onClick={() => setConfirmAction({ type: 'delete', user })}><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>

      {editUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-card rounded-lg shadow-lg p-6 w-full max-w-md border border-border">
            <h2 className="text-lg font-semibold mb-4">{t('admin.users.editUser')}</h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block mb-1">{t('admin.users.name')}</label>
                <input
                  className="w-full border border-border rounded-lg px-3 py-2"
                  value={editData.name}
                  onChange={e => setEditData({ ...editData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block mb-1">{t('admin.users.email')}</label>
                <input
                  className="w-full border border-border rounded-lg px-3 py-2"
                  value={editData.email}
                  onChange={e => setEditData({ ...editData, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block mb-1">{t('admin.users.role')}</label>
                <select
                  className="w-full border border-border rounded-lg px-3 py-2"
                  value={editData.role}
                  onChange={e => setEditData({ ...editData, role: e.target.value })}
                  required
                >
                  <option key="admin" value="admin">Admin</option>
                  <option key="doctor" value="doctor">Doctor</option>
                  <option key="patient" value="patient">Patient</option>
                  <option key="pharmacist" value="pharmacist">Pharmacist</option>
                </select>
              </div>
              {roleFields[editData.role]?.map(field => (
                <div key={field.name}>
                  <label className="block mb-1">{field.label}</label>
                  {field.type === 'select' ? (
                    <select
                      className="w-full border border-border rounded-lg px-3 py-2"
                      value={editData[field.name] || ''}
                      onChange={e => setEditData({ ...editData, [field.name]: e.target.value })}
                    >
                      <option key="" value="">{t('admin.users.select' + field.label.replace(/\s/g, ''))}</option>
                      {field.options.map(opt => (
                        <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type}
                      className="w-full border border-border rounded-lg px-3 py-2"
                      value={editData[field.name] || ''}
                      onChange={e => setEditData({ ...editData, [field.name]: e.target.value })}
                    />
                  )}
                </div>
              ))}
              <div className="flex justify-end gap-2 mt-4">
                <Button type="button" variant="outline" onClick={() => setEditUser(null)}>{t('admin.users.cancel')}</Button>
                <Button type="submit" variant="success">{t('admin.users.save')}</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {confirmAction.user && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-card rounded-lg shadow-lg p-6 w-full max-w-sm border border-border">
            <h2 className="text-lg font-semibold mb-4">{t('admin.users.confirmAction', { action: t('admin.users.' + confirmAction.type) })}</h2>
            <p className="mb-4">{t('admin.users.confirmMessage', { action: t('admin.users.' + confirmAction.type), name: confirmAction.user.name })}</p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setConfirmAction({ type: null, user: null })}>{t('admin.users.cancel')}</Button>
              <Button variant={confirmAction.type === 'delete' ? 'danger' : 'primary'} onClick={handleConfirm}>{t('admin.users.confirm')}</Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
} 