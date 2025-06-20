import React from 'react';
import { cn } from '@/utils/styles';
import { User, X, LogOut, Settings } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function ProfileDialog({
  open,
  onClose,
  user,
  onLogout,
  onSettings,
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
          'relative z-50 w-full max-w-sm rounded-lg border border-border bg-card shadow-lg',
          className
        )}
      >
        <div className="flex items-center justify-between border-b border-border p-4">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">
              Profile
            </h3>
          </div>
          <Button
            onClick={onClose}
            size="icon"
            variant="ghost"
            aria-label="Close profile dialog"
            className="rounded-lg hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center">
                <User className="h-8 w-8 text-primary" />
              </div>
              <div className="absolute bottom-0 right-0 h-4 w-4 rounded-lg border-2 border-background bg-success" />
            </div>
            <div>
              <h4 className="font-medium text-foreground">
                {user?.name || 'User Name'}
              </h4>
              <p className="text-sm text-muted-foreground">
                {user?.email || 'user@example.com'}
              </p>
            </div>
          </div>
          <div className="mt-6 space-y-2">
            <Button
              onClick={onSettings}
              variant="outline"
              className="w-full flex items-center gap-2 mt-2"
            >
              <Settings className="h-5 w-5" />
              Settings
            </Button>
            <Button
              onClick={onLogout}
              variant="destructive"
              className="w-full flex items-center gap-2 mt-4"
            >
              <LogOut className="h-5 w-5" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 