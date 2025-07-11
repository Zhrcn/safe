import React from 'react';
import { Card } from '@/components/ui/Card';
import { useTranslation } from 'react-i18next';

export function SystemStatsCard({ stats }) {
  const { t } = useTranslation();
  if (!stats) return null;
  return (
    <Card className="p-6 mt-6">
      <h3 className="text-lg font-semibold mb-4">{t('admin.systemStats.title')}</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-4 border border-border rounded-md">
          <h6 className="text-foreground mb-2 text-lg font-semibold">{t('admin.stats.status')}</h6>
          <p className="text-foreground">
            {stats.systemHealth?.status === t('admin.stats.healthy') ? (
              <span className="text-green-600">● {t('admin.stats.healthy')}</span>
            ) : (
              <span className="text-red-600">● {t('admin.stats.issues')}</span>
            )}
          </p>
        </div>
        <div className="p-4 border border-border rounded-md">
          <h6 className="text-foreground mb-2 text-lg font-semibold">{t('admin.stats.uptime')}</h6>
          <p className="text-foreground">{stats.systemHealth?.uptime || '-'}</p>
        </div>
        <div className="p-4 border border-border rounded-md">
          <h6 className="text-foreground mb-2 text-lg font-semibold">{t('admin.stats.appointments')}</h6>
          <p className="text-foreground">{t('admin.stats.total')}: {stats.appointments?.total || 0}</p>
          <p className="text-foreground">{t('admin.stats.scheduled')}: {stats.appointments?.scheduled || 0}</p>
        </div>
        <div className="p-4 border border-border rounded-md">
          <h6 className="text-foreground mb-2 text-lg font-semibold">{t('admin.stats.prescriptions')}</h6>
          <p className="text-foreground">{t('admin.stats.total')}: {stats.prescriptions?.total || 0}</p>
          <p className="text-foreground">{t('admin.stats.active')}: {stats.prescriptions?.active || 0}</p>
        </div>
      </div>
    </Card>
  );
} 