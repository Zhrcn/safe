import React from 'react';
import { cn } from '@/utils/styles';
import { Bell, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function NotificationDialog({
  open,
  onClose,
  notifications = [],
  onMarkAsRead,
  onClearAll,
  className,
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={cn(
          'relative z-50 w-full max-w-lg rounded-2xl border border-border bg-card shadow-lg',
          className
        )}
      >
        <div className="flex items-center justify-between border-b border-border p-4">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">
              Notifications
            </h3>
          </div>
          <Button
            onClick={onClose}
            size="icon"
            variant="ghost"
            aria-label="Close notifications dialog"
            className="rounded-2xl p-1 hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="max-h-[60vh] overflow-y-auto p-4">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Bell className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <p className="text-sm text-muted-foreground">
                No notifications at this time
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    'flex items-start gap-4 rounded-2xl border border-border p-4',
                    !notification.read && 'bg-accent/50'
                  )}
                >
                  <div className="rounded-2xl bg-primary/10 p-2">
                    <Bell className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <h4 className="font-medium text-foreground">
                        {notification.title}
                      </h4>
                      <span className="text-xs text-muted-foreground">
                        {notification.time}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {notification.message}
                    </p>
                    {!notification.read && (
                      <Button
                        onClick={() => onMarkAsRead(notification.id)}
                        variant="secondary"
                        size="sm"
                        className="w-full mt-2"
                      >
                        Mark as Read
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {notifications.length > 0 && (
          <div className="border-t border-border p-4">
            <Button
              onClick={onClearAll}
              variant="outline"
              size="sm"
              className="w-full mt-4"
            >
              Clear All
            </Button>
          </div>
        )}
      </div>
    </div>
  );
} 