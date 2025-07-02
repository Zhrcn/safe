import React from 'react';
import { Card } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export function NotificationList({ notifications = [], onMarkAsRead }) {
  return (
    <Card className="p-6 mt-6">
      <h3 className="text-lg font-semibold mb-4">Notifications</h3>
      {notifications.length === 0 ? (
        <div className="text-muted-foreground text-center">No notifications found.</div>
      ) : (
        <ul className="space-y-4">
          {notifications.map((notif) => (
            <li key={notif.id} className={`flex flex-col md:flex-row md:items-center md:justify-between p-4 rounded-2xl border ${notif.read ? 'bg-muted' : 'bg-accent'}`}>
              <div>
                <div className="font-semibold text-foreground">{notif.title}</div>
                <div className="text-muted-foreground text-sm mb-1">{notif.message}</div>
                <div className="text-xs text-muted-foreground">{notif.timestamp ? new Date(notif.timestamp).toLocaleString() : '-'}</div>
              </div>
              {!notif.read && onMarkAsRead && (
                <Button size="sm" className="mt-2 md:mt-0" onClick={() => onMarkAsRead(notif.id)}>
                  Mark as Read
                </Button>
              )}
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
} 