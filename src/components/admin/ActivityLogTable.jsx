import React from 'react';
import { Card } from '@/components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableRow, TableHeader } from '@/components/ui/Table';
import { useTranslation } from 'react-i18next';

export function ActivityLogTable({ logs = [] }) {
  const { t } = useTranslation();
  return (
    <Card className="p-6 mt-6">
      <h3 className="text-lg font-semibold mb-4">{t('admin.activityLog.title')}</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('admin.activityLog.user')}</TableHead>
            <TableHead>{t('admin.activityLog.action')}</TableHead>
            <TableHead>{t('admin.activityLog.timestamp')}</TableHead>
            <TableHead>{t('admin.activityLog.details')}</TableHead>
            <TableHead>{t('admin.activityLog.category')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground">{t('admin.activityLog.noLogs')}</TableCell>
            </TableRow>
          ) : (
            logs.map(log => (
              <TableRow key={log._id}>
                <TableCell>{log.meta?.user || '-'}</TableCell>
                <TableCell>{log.message}</TableCell>
                <TableCell>{log.timestamp ? new Date(log.timestamp).toLocaleString() : '-'}</TableCell>
                <TableCell>{log.meta ? JSON.stringify(log.meta) : '-'}</TableCell>
                <TableCell>{log.meta?.service || log.level || '-'}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </Card>
  );
} 