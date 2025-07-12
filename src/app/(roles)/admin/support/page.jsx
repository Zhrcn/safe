'use client';
import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Table, TableBody, TableCell, TableHead, TableRow, TableHeader } from '@/components/ui/Table';
import Button from '@/components/ui/Button';

const mockTickets = [
  { id: 'TCK-001', user: 'Dr. Sarah Johnson', subject: 'Password Reset', status: 'Open', createdAt: '2024-03-15T09:00:00Z' },
  { id: 'TCK-002', user: 'Emma Wilson', subject: 'Account Locked', status: 'Closed', createdAt: '2024-03-14T15:30:00Z' },
  { id: 'TCK-003', user: 'John Smith', subject: 'Unable to access records', status: 'Open', createdAt: '2024-03-13T11:20:00Z' },
];

export default function AdminSupportPage() {
  const [tickets] = useState(mockTickets);

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Support & Ticket Management</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ticket ID</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tickets.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground">No tickets found.</TableCell>
            </TableRow>
          ) : (
            tickets.map(ticket => (
              <TableRow key={ticket.id}>
                <TableCell>{ticket.id}</TableCell>
                <TableCell>{ticket.user}</TableCell>
                <TableCell>{ticket.subject}</TableCell>
                <TableCell>{ticket.status}</TableCell>
                <TableCell>{ticket.createdAt ? new Date(ticket.createdAt).toLocaleString() : '-'}</TableCell>
                <TableCell>
                  <Button size="sm" variant="info" className="rounded-2xl">View</Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </Card>
  );
} 