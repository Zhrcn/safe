'use client';
import { useState, useEffect } from 'react';
import { Users, Activity, Bell, Server } from 'lucide-react';
import { getUsers, getSystemStats, getActivityLogs, getNotifications } from '@/services/adminService';
import { StatCard } from '@/components/admin/AdminComponents';
import { ActivityLogTable } from '@/components/admin/ActivityLogTable';
import { NotificationList } from '@/components/admin/NotificationList';
import { SystemStatsCard } from '@/components/admin/SystemStatsCard';
import { useTranslation } from 'react-i18next';

export default function AdminDashboard() {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [systemStats, setSystemStats] = useState(null);
  const [activityLogs, setActivityLogs] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        const [usersData, statsData, logsData, notificationsData] = await Promise.all([
          getUsers({ status: 'active' }),
          getSystemStats(),
          getActivityLogs(),
          getNotifications()
        ]);
        setUsers(usersData);
        setSystemStats(statsData);
        setActivityLogs(logsData);
        setNotifications(notificationsData.data.notifications || []);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  return (
    <div className="w-full">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-muted-foreground">{t('admin.dashboard.loading', 'Loading dashboard data...')}</p>
        </div>
      ) : (
        <>
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard title="Total Users" value={systemStats?.users?.total || 0} icon={<Users />} />
              <StatCard title="Appointments" value={systemStats?.appointments?.total || 0} icon={<Activity />} />
              <StatCard title="Prescriptions" value={systemStats?.prescriptions?.total || 0} icon={<Bell />} />
              <StatCard title="System Health" value={systemStats?.systemHealth?.status || 'Unknown'} icon={<Server />} />
            </div>
            <SystemStatsCard stats={systemStats} />
            <ActivityLogTable logs={activityLogs.slice(0, 5)} />
            <NotificationList notifications={notifications.slice(0, 5)} />
          </div>
        </>
      )}
    </div>
  );
} 