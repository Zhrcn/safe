'use client';
import { useEffect, useState } from 'react';
import { getNotifications } from '@/services/adminService';
import { NotificationList } from '@/components/admin/NotificationList';

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNotifications() {
      setLoading(true);
      try {
        const data = await getNotifications();
        setNotifications(data);
      } catch (error) {
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    }
    fetchNotifications();
  }, []);

  return (
    <div className="w-full">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-muted-foreground">Loading notifications...</p>
        </div>
      ) : (
        <NotificationList notifications={notifications} />
      )}
    </div>
  );
} 