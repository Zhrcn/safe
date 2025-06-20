'use client';
import { useState, useEffect } from 'react';
import { Users, Activity, Bell, Server, UserPlus, Settings } from 'lucide-react';
import { AdminPageContainer, AdminCard, StatCard, ChartContainer, UserRoleBadge, UserStatusBadge, ActivityLogItem, NotificationItem } from '@/components/admin/AdminComponents';
import { getUsers, getSystemStats, getActivityLogs, getNotifications } from '@/services/adminService';
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Grid, Box, Typography } from '@mui/material';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [systemStats, setSystemStats] = useState(null);
  const [activityLogs, setActivityLogs] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
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
        setNotifications(notificationsData);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleMarkAsRead = async (id) => {
    setNotifications(notifications.map(notification =>
      notification.id === id ? { ...notification, isRead: true } : notification
    ));
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  return (
    <AdminPageContainer
      title="Admin Dashboard"
      description="Monitor system health, user activity, and manage platform settings."
      className="bg-background min-h-screen text-foreground"
    >
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-muted-foreground">Loading dashboard data...</p>
        </div>
      ) : (
        <>
          <div className="mb-6 border-b border-muted">
            <div className="flex space-x-4">
              {['overview', 'users', 'activity', 'system'].map((tab) => (
                <Button
                  key={tab}
                  onClick={() => handleTabChange(tab)}
                  className={`px-4 py-2 font-medium ${
                    activeTab === tab 
                      ? 'text-primary border-b-2 border-primary' 
                      : 'text-muted-foreground hover:text-primary'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Users"
                value={systemStats.users.total}
                icon={<Users />}
                description={`${systemStats.users.active} active users`}
                onClick={() => setActiveTab('users')}
              />
              <StatCard
                title="Appointments"
                value={systemStats.appointments.total}
                icon={<Activity />}
                description={`${systemStats.appointments.scheduled} scheduled`}
              />
              <StatCard
                title="Prescriptions"
                value={systemStats.prescriptions.total}
                icon={<Bell />}
                description={`${systemStats.prescriptions.active} active`}
              />
              <StatCard
                title="System Health"
                value={systemStats.systemHealth.status}
                icon={<Server />}
                description={`${systemStats.systemHealth.uptime} uptime`}
                onClick={() => setActiveTab('system')}
              />

              <div className="col-span-1 md:col-span-2">
                <ChartContainer title="User Distribution by Role" className="bg-card border border-border rounded-xl">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={Object.entries(systemStats.users.byRole).map(([name, value]) => ({ name, value }))}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {Object.entries(systemStats.users.byRole).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'var(--card)',
                          borderColor: 'var(--border)',
                          color: 'var(--foreground)'
                        }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>

              <div className="col-span-1 md:col-span-2">
                <ChartContainer title="Appointment Status" className="bg-card border border-border rounded-xl">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={Object.entries(systemStats.appointments).filter(([key]) => key !== 'total').map(([name, value]) => ({ name, value }))}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="name" stroke="var(--muted-foreground)" />
                      <YAxis stroke="var(--muted-foreground)" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'var(--card)',
                          borderColor: 'var(--border)',
                          color: 'var(--foreground)'
                        }}
                      />
                      <Bar dataKey="value" fill="var(--primary)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>

              <div className="col-span-1 md:col-span-2">
                <AdminCard
                  title="Recent Activity"
                  actions={
                    <Button
                      onClick={() => setActiveTab('activity')}
                      className="text-primary hover:bg-primary/10 px-3 py-1 rounded-md text-sm"
                    >
                      View All
                    </Button>
                  }
                  className="bg-card border border-border rounded-xl"
                >
                  {activityLogs.slice(0, 3).map((log) => (
                    <ActivityLogItem
                      key={log.id}
                      user={log.user}
                      action={log.action}
                      timestamp={log.timestamp}
                      details={log.details}
                      category={log.category}
                    />
                  ))}
                </AdminCard>
              </div>

              <div className="col-span-1 md:col-span-2">
                <AdminCard
                  title="Notifications"
                  actions={
                    <Button
                      className="text-primary hover:bg-primary/10 px-3 py-1 rounded-md text-sm"
                    >
                      Mark All Read
                    </Button>
                  }
                  className="bg-card border border-border rounded-xl"
                >
                  {notifications.slice(0, 3).map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      title={notification.title}
                      message={notification.message}
                      timestamp={notification.timestamp}
                      severity={notification.severity}
                      isRead={notification.isRead}
                      onMarkAsRead={() => handleMarkAsRead(notification.id)}
                    />
                  ))}
                </AdminCard>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <AdminCard
              title="User Management"
              actions={
                <Button
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-md flex items-center gap-2"
                >
                  <UserPlus size={20} />
                  Add User
                </Button>
              }
            >
              <TableContainer component={Paper} elevation={0} className="bg-transparent">
                <Table>
                  <TableHead>
                    <TableRow className="bg-muted/50">
                      <TableCell className="text-foreground font-medium">Name</TableCell>
                      <TableCell className="text-foreground font-medium">Email</TableCell>
                      <TableCell className="text-foreground font-medium">Role</TableCell>
                      <TableCell className="text-foreground font-medium">Status</TableCell>
                      <TableCell className="text-foreground font-medium">Last Active</TableCell>
                      <TableCell className="text-foreground font-medium" align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id} className="hover:bg-muted/30">
                        <TableCell className="text-foreground">{user.name}</TableCell>
                        <TableCell className="text-foreground">{user.email}</TableCell>
                        <TableCell>
                          <UserRoleBadge role={user.role} />
                        </TableCell>
                        <TableCell>
                          <UserStatusBadge status={user.status} />
                        </TableCell>
                        <TableCell className="text-foreground">
                          {new Date(user.lastActive).toLocaleString()}
                        </TableCell>
                        <TableCell align="right">
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<Settings size={16} />}
                            className="text-primary border-primary hover:bg-primary/10"
                          >
                            Manage
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </AdminCard>
          )}
          {activeTab === 'activity' && (
            <AdminCard title="Activity Logs">
              {activityLogs.map((log) => (
                <ActivityLogItem
                  key={log.id}
                  user={log.user}
                  action={log.action}
                  timestamp={log.timestamp}
                  details={log.details}
                  category={log.category}
                />
              ))}
            </AdminCard>
          )}
          {activeTab === 'system' && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <AdminCard title="System Health">
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                      <Box className="p-4 border border-border rounded-md">
                        <Typography variant="h6" className="text-foreground mb-2">Status</Typography>
                        <Typography variant="body1" className="text-foreground">
                          {systemStats.systemHealth.status === 'healthy' ? (
                            <span className="text-success">● Healthy</span>
                          ) : (
                            <span className="text-error">● Issues Detected</span>
                          )}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Box className="p-4 border border-border rounded-md">
                        <Typography variant="h6" className="text-foreground mb-2">Uptime</Typography>
                        <Typography variant="body1" className="text-foreground">
                          {systemStats.systemHealth.uptime}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Box className="p-4 border border-border rounded-md">
                        <Typography variant="h6" className="text-foreground mb-2">Response Time</Typography>
                        <Typography variant="body1" className="text-foreground">
                          {systemStats.systemHealth.responseTime}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Box className="p-4 border border-border rounded-md">
                        <Typography variant="h6" className="text-foreground mb-2">Last Issue</Typography>
                        <Typography variant="body1" className="text-foreground">
                          {new Date(systemStats.systemHealth.lastIssue).toLocaleString()}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </AdminCard>
              </Grid>
              <Grid item xs={12}>
                <ChartContainer title="System Performance">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart
                      data={[
                        { name: '00:00', value: 230 },
                        { name: '03:00', value: 180 },
                        { name: '06:00', value: 200 },
                        { name: '09:00', value: 280 },
                        { name: '12:00', value: 250 },
                        { name: '15:00', value: 310 },
                        { name: '18:00', value: 290 },
                        { name: '21:00', value: 240 }
                      ]}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="name" stroke="var(--muted-foreground)" />
                      <YAxis stroke="var(--muted-foreground)" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'var(--card)',
                          borderColor: 'var(--border)',
                          color: 'var(--foreground)'
                        }}
                      />
                      <Legend />
                      <Line type="monotone" dataKey="value" stroke="var(--primary)" name="Response Time (ms)" />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </Grid>
            </Grid>
          )}
        </>
      )}
    </AdminPageContainer>
  );
} 