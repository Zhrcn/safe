'use client';

import React from 'react';
import Button from '@/components/ui/Button';
import { TrendingUp, TrendingDown, Minus, ArrowRight } from 'lucide-react';
import { useSafeTranslation } from '@/hooks/useSafeTranslation';



export function AdminPageContainer({ title, description, children }) {
  return (
    <div className="p-6 space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
      {children}
    </div>
  );
}

export function AdminCard({ title, subtitle, actions, children, className = '' }) {
  return (
    <div className={`border border-border bg-card shadow-sm rounded-2xl ${className}`}>
      <div className="p-4">
        {(title || subtitle || actions) && (
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
            <div>
              {title && <h2 className="text-lg font-medium text-foreground">{title}</h2>}
              {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
            </div>
            {actions && <div className="mt-2 sm:mt-0">{actions}</div>}
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

export function StatCard({ title, value, trend = null, icon, description, className = '', onClick }) {
  const { t } = useSafeTranslation();
  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUp size={16} className="text-success" />;
    if (trend === 'down') return <TrendingDown size={16} className="text-error" />;
    if (trend === 'neutral') return <Minus size={16} className="text-warning" />;
    return null;
  };

  const getWrapperClass = () => {
    let baseClass = 'border border-border bg-card text-card-foreground rounded-2xl p-4 transition-all duration-200';
    if (onClick) baseClass += ' cursor-pointer hover:shadow-md';
    return `${baseClass} ${className}`;
  };

  return (
    <div className={getWrapperClass()} onClick={onClick}>
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-xl font-bold text-foreground">{value}</h3>
          <p className="text-sm text-muted-foreground mt-1">{t(title)}</p>
          {description && (
            <p className="mt-2 text-sm text-muted-foreground">{description}</p>
          )}
          {trend && (
            <div className="flex items-center mt-2">
              {getTrendIcon()}
              <span
                className={`ml-1 text-sm ${
                  trend === 'up'
                    ? 'text-success'
                    : trend === 'down'
                    ? 'text-error'
                    : 'text-warning'
                }`}
              >
                {trend === 'up' ? t('admin.stats.increase') : trend === 'down' ? t('admin.stats.decrease') : t('admin.stats.noChange')}
              </span>
            </div>
          )}
        </div>
        {icon && (
          <div className="p-2 rounded-full bg-primary/10 text-primary">{icon}</div>
        )}
      </div>
    </div>
  );
}

export function ChartContainer({ title, subtitle, children, className = '' }) {
  return (
    <div className={`border border-border bg-card text-card-foreground rounded-2xl ${className}`}>
      {title && (
        <div className="border-b border-border p-4">
          <h2 className="text-lg font-medium text-foreground">{title}</h2>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  );
}

export function UserRoleBadge({ role }) {
  const safeRole = role || '';
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground`}>
      {safeRole.charAt(0).toUpperCase() + safeRole.slice(1)}
    </span>
  );
}

export function UserStatusBadge({ status }) {
  const safeStatus = status || '';
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground`}>
      {safeStatus.charAt(0).toUpperCase() + safeStatus.slice(1)}
    </span>
  );
}

export function NotificationSeverityBadge({ severity }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground`}>
      {severity.charAt(0).toUpperCase() + severity.slice(1)}
    </span>
  );
}

export function ActivityLogItem({ user, action, timestamp, details, category }) {
  const getCategoryStyle = () => {
    switch (category?.toLowerCase()) {
      case 'user':
        return 'text-blue-600 bg-blue-100 dark:text-blue-300 dark:bg-blue-900';
      case 'security':
        return 'text-red-600 bg-red-100 dark:text-red-300 dark:bg-red-900';
      case 'system':
        return 'text-purple-600 bg-purple-100 dark:text-purple-300 dark:bg-purple-900';
      default:
        return 'text-gray-600 bg-gray-100 dark:text-gray-300 dark:bg-gray-800';
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <div className="p-3 border-b border-border last:border-0">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-1">
        <div className="flex items-center">
          <span className="font-medium text-foreground">{user}</span>
          {category && (
            <span className={`ml-2 text-xs px-2 py-1 rounded bg-muted text-muted-foreground`}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </span>
          )}
        </div>
        <span className="text-muted-foreground text-sm mt-1 sm:mt-0">
          {formatTimestamp(timestamp)}
        </span>
      </div>
      <p className="mb-1 text-foreground">{action}</p>
      {details && <p className="text-sm text-muted-foreground">{details}</p>}
    </div>
  );
}

export function NotificationItem({ title, message, timestamp, severity, isRead, onMarkAsRead }) {
  const { t } = useSafeTranslation();
  const getNotificationClasses = () => {
    let baseClass = 'p-3 border-b border-border last:border-0 transition-colors duration-200';
    if (!isRead) baseClass += ' bg-primary/5';
    return baseClass;
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <div className={getNotificationClasses()}>
      <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-1">
        <div className="flex items-center space-x-2">
          <span className="font-medium text-foreground">{title}</span>
          {severity && <NotificationSeverityBadge severity={severity} />}
        </div>
        <span className="text-muted-foreground text-sm mt-1 sm:mt-0">
          {formatTimestamp(timestamp)}
        </span>
      </div>
      <p className="mb-2 text-foreground">{message}</p>
      {!isRead && onMarkAsRead && (
        <Button
          onClick={onMarkAsRead}
          variant="info"
          className="text-sm flex items-center hover:underline"
        >
          {t('admin.notifications.markAsRead')}
          <ArrowRight size={16} className="ml-1" />
        </Button>
      )}
    </div>
  );
}
