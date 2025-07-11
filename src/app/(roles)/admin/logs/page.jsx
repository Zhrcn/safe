'use client';
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableRow, TableHeader } from '@/components/ui/Table';
import { getSystemLogs } from '@/services/adminService';

export default function AdminLogsPage() {
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLogs() {
      setLoading(true);
      try {
        const data = await getSystemLogs();
        // Map backend log fields to expected frontend fields
        const mappedLogs = (data || []).map(log => ({
          id: log._id || log.id,
          timestamp: log.timestamp || log.createdAt,
          user: (log.meta && (log.meta.user || log.meta.username || log.meta.email)) || '-',
          action: log.message || log.action || '-',
          details: (log.meta && (log.meta.details || log.meta.info || log.meta.actionDetails)) || '-',
          ip: (log.meta && (log.meta.ip || log.meta.ipAddress)) || '-',
        }));
        setLogs(mappedLogs);
      } catch (error) {
        setLogs([]);
      } finally {
        setLoading(false);
      }
    }
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter(log =>
    (log.user || '').toLowerCase().includes(search.toLowerCase()) ||
    (log.action || '').toLowerCase().includes(search.toLowerCase()) ||
    (log.details || '').toLowerCase().includes(search.toLowerCase()) ||
    (log.ip || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Audit & System Logs</h3>
      <div className="mb-4 flex items-center gap-2">
        <input
          type="text"
          placeholder="Search logs..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border border-border rounded-2xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Timestamp</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>Details</TableHead>
            <TableHead>IP</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredLogs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground">No logs found.</TableCell>
            </TableRow>
          ) : (
            filteredLogs.map(log => (
              <TableRow key={log.id}>
                <TableCell>{log.timestamp ? new Date(log.timestamp).toLocaleString() : '-'}</TableCell>
                <TableCell>{log.user}</TableCell>
                <TableCell>{log.action}</TableCell>
                <TableCell>{log.details || '-'}</TableCell>
                <TableCell>{log.ip || '-'}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </Card>
  );
} 