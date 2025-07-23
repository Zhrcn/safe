import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, useWindowDimensions, ActivityIndicator } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchDashboard } from '../../../features/dashboard/dashboardSlice';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import CustomHeader from '../../../components/ui/CustomHeader';
import CustomTabBar from '../../../components/ui/CustomTabBar';
import CustomDrawer from '../../../components/ui/CustomDrawer';

function HealthMetricCard({ icon, label, value, iconName, sizeScale }) {
  const Icon = icon;
  return (
    <View
      style={[
        styles.metricCard,
        {
          minWidth: 120 * sizeScale,
          padding: 14 * sizeScale,
          borderRadius: 14 * sizeScale,
        },
      ]}
    >
      <Icon name={iconName} size={28 * sizeScale} color="#2563eb" style={{ marginBottom: 8 * sizeScale }} />
      <Text style={[styles.metricLabel, { fontSize: 15 * sizeScale, marginBottom: 2 * sizeScale }]}>{label}</Text>
      <Text style={[styles.metricValue, { fontSize: 17 * sizeScale }]}>{value}</Text>
    </View>
  );
}

function QuickAction({ icon, label, onPress, iconName, sizeScale }) {
  const Icon = icon;
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.quickAction,
        {
          minWidth: 100 * sizeScale,
          padding: 14 * sizeScale,
          borderRadius: 14 * sizeScale,
        },
      ]}
    >
      <Icon name={iconName} size={26 * sizeScale} color="#2563eb" style={{ marginBottom: 8 * sizeScale }} />
      <Text style={[styles.quickActionLabel, { fontSize: 14 * sizeScale }]}>{label}</Text>
    </TouchableOpacity>
  );
}

export default function DashboardScreen() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.dashboard);
  const router = useRouter();
  const user = data?.profile || {};
  const medicalFile = data?.medicalFile || {};
  const appointments = data?.appointments || [];
  const medications = data?.medications || [];
  const allergies = medicalFile.allergies || [];
  const chronicConditions = medicalFile.chronicConditions || [];
  const vitals = (medicalFile.vitalSigns && medicalFile.vitalSigns.length > 0) ? medicalFile.vitalSigns[medicalFile.vitalSigns.length - 1] : {};

  // Responsive scaling
  const { width } = useWindowDimensions();
  // scale: 1 for small, 1.15 for medium, 1.3 for large screens
  let sizeScale = 1;
  if (width >= 900) sizeScale = 1.3;
  else if (width >= 600) sizeScale = 1.15;

  // Responsive: for large screens, show metrics and quick actions in grid, else column/row
  const isLargeScreen = width >= 900;
  const isMediumScreen = width >= 600 && width < 900;
  const isSmallScreen = width < 600;

  useEffect(() => {
    dispatch(fetchDashboard());
  }, [dispatch]);

  // Health metrics config
  const healthMetrics = [
    { icon: MaterialCommunityIcons, label: 'Heart Rate', value: vitals.heartRate ? `${vitals.heartRate} BPM` : 'N/A', iconName: 'heart-pulse' },
    { icon: MaterialCommunityIcons, label: 'Blood Pressure', value: vitals.bloodPressure || 'N/A', iconName: 'water' },
    { icon: MaterialCommunityIcons, label: 'Temperature', value: vitals.temperature ? `${vitals.temperature}°C` : 'N/A', iconName: 'thermometer' },
    { icon: MaterialCommunityIcons, label: 'Respiratory Rate', value: vitals.respiratoryRate ? `${vitals.respiratoryRate} bpm` : 'N/A', iconName: 'lungs' },
    { icon: MaterialCommunityIcons, label: 'BMI', value: vitals.bmi ? `${vitals.bmi}` : 'N/A', iconName: 'human-male-height' },
    { icon: MaterialCommunityIcons, label: 'Oxygen Saturation', value: vitals.oxygenSaturation ? `${vitals.oxygenSaturation}%` : 'N/A', iconName: 'water-percent' },
  ];

  // Quick actions config
  const quickActions = [
    { icon: MaterialIcons, iconName: 'event-available', label: 'Schedule Appointment', onPress: () => router.push('/(pages)/appointments') },
    { icon: MaterialCommunityIcons, iconName: 'file-document', label: 'Medical Records', onPress: () => router.push('/(tabs)/medical-records') },
    { icon: MaterialCommunityIcons, iconName: 'chat', label: 'Message Provider', onPress: () => router.push('/(tabs)/messaging') },
  ];

  return (
    <View style={[styles.container, { paddingHorizontal: 16 * sizeScale, backgroundColor: '#fff' }]}>
      <CustomHeader onMenuPress={() => setDrawerOpen(true)} />
      <CustomDrawer visible={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <ScrollView style={{ flex: 1 }}>
        {/* Welcome header */}
        <Text style={[styles.welcome, { fontSize: 24 * sizeScale, marginTop: 8 * sizeScale }]}>
          Welcome{user.name ? `, ${user.name}` : ''}!
        </Text>
        <Text style={[styles.subtitle, { fontSize: 15 * sizeScale, marginBottom: 12 * sizeScale }]}>
          Here’s an overview of your health and activity.
        </Text>
        {/* Loading/Error State */}
        {loading && (
          <View style={styles.centeredWrap}>
            <ActivityIndicator size={48 * sizeScale} color="#2563eb" style={{ marginVertical: 32 * sizeScale }} />
            <Text style={{ color: '#2563eb', fontWeight: 'bold', fontSize: 18 * sizeScale }}>Loading your dashboard...</Text>
          </View>
        )}
        {error && (
          <View style={styles.centeredWrap}>
            <MaterialIcons name="error-outline" size={40 * sizeScale} color="#ef4444" style={{ marginBottom: 8 * sizeScale }} />
            <Text style={{ color: '#ef4444', fontWeight: 'bold', fontSize: 18 * sizeScale }}>Failed to load data</Text>
            <Text style={{ color: '#64748b', fontSize: 15 * sizeScale }}>{error}</Text>
          </View>
        )}
        {!loading && !error && (
        <>
        {/* Health metrics */}
        <View style={styles.sectionDivider} />
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 * sizeScale }}>
          <MaterialCommunityIcons name="heart-pulse" size={22 * sizeScale} color="#2563eb" style={{ marginRight: 8 }} />
          <Text style={[styles.sectionTitle, { fontSize: 18 * sizeScale }]}>Health Metrics</Text>
        </View>
        {isLargeScreen ? (
          <View style={[styles.metricsGrid, { marginBottom: 18 * sizeScale, flexDirection: 'row', flexWrap: 'wrap', gap: 18 * sizeScale }]}>
            {healthMetrics.map((metric, idx) => (
              <HealthMetricCard
                key={idx}
                icon={metric.icon}
                iconName={metric.iconName}
                label={metric.label}
                value={metric.value}
                sizeScale={sizeScale}
              />
            ))}
          </View>
        ) : isMediumScreen ? (
          <View style={[styles.metricsGrid, { marginBottom: 18 * sizeScale, flexDirection: 'row', flexWrap: 'wrap', gap: 12 * sizeScale }]}>
            {healthMetrics.map((metric, idx) => (
              <HealthMetricCard
                key={idx}
                icon={metric.icon}
                iconName={metric.iconName}
                label={metric.label}
                value={metric.value}
                sizeScale={sizeScale}
              />
            ))}
          </View>
        ) : (
          <View style={{ marginBottom: 18 * sizeScale }}>
            {healthMetrics.map((metric, idx) => (
              <HealthMetricCard
                key={idx}
                icon={metric.icon}
                iconName={metric.iconName}
                label={metric.label}
                value={metric.value}
                sizeScale={sizeScale}
              />
            ))}
          </View>
        )}
        <View style={styles.sectionDivider} />
        {/* Quick actions */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 * sizeScale }}>
          <MaterialIcons name="flash-on" size={22 * sizeScale} color="#2563eb" style={{ marginRight: 8 }} />
          <Text style={[styles.sectionTitle, { fontSize: 18 * sizeScale }]}>Quick Actions</Text>
        </View>
        {isLargeScreen ? (
          <View style={[styles.quickActionsGrid, { marginBottom: 18 * sizeScale, flexDirection: 'row', flexWrap: 'wrap', gap: 18 * sizeScale }]}>
            {quickActions.map((action, idx) => (
              <QuickAction
                key={idx}
                icon={action.icon}
                iconName={action.iconName}
                label={action.label}
                onPress={action.onPress}
                sizeScale={sizeScale}
              />
            ))}
          </View>
        ) : isMediumScreen ? (
          <View style={[styles.quickActionsGrid, { marginBottom: 18 * sizeScale, flexDirection: 'row', flexWrap: 'wrap', gap: 12 * sizeScale }]}>
            {quickActions.map((action, idx) => (
              <QuickAction
                key={idx}
                icon={action.icon}
                iconName={action.iconName}
                label={action.label}
                onPress={action.onPress}
                sizeScale={sizeScale}
              />
            ))}
          </View>
        ) : (
          <View style={[styles.quickActionsCol, { marginBottom: 18 * sizeScale }]}>
            {quickActions.map((action, idx) => (
              <QuickAction
                key={idx}
                icon={action.icon}
                iconName={action.iconName}
                label={action.label}
                onPress={action.onPress}
                sizeScale={sizeScale}
              />
            ))}
          </View>
        )}
        <View style={styles.sectionDivider} />
        {/* Appointments */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 * sizeScale }}>
          <MaterialIcons name="event-available" size={22 * sizeScale} color="#2563eb" style={{ marginRight: 8 }} />
          <Text style={[styles.sectionTitle, { fontSize: 18 * sizeScale }]}>Upcoming Appointments</Text>
        </View>
        {appointments.length === 0 ? (
          <View style={styles.centeredWrap}><MaterialIcons name="event-busy" size={40 * sizeScale} color="#9ca3af" style={{ marginBottom: 8 * sizeScale }} /><Text style={[styles.emptyText, { marginBottom: 14 * sizeScale }]}>No upcoming appointments.</Text></View>
        ) : (
          appointments.map((apt, idx) => (
            <View
              key={apt._id || idx}
              style={[
                styles.listItem,
                {
                  borderRadius: 14 * sizeScale,
                  padding: 12 * sizeScale,
                  marginBottom: 8 * sizeScale,
                },
              ]}
            >
              <MaterialIcons name="person" size={20 * sizeScale} color="#94a3b8" style={{ marginRight: 8 * sizeScale }} />
              <View style={{ flex: 1 }}>
                <Text
                  style={[styles.itemTitle, { fontSize: 15 * sizeScale }]}
                  numberOfLines={1}
                >
                  {apt.doctor?.user?.firstName} {apt.doctor?.user?.lastName}
                </Text>
                <Text style={[styles.itemSub, { fontSize: 12 * sizeScale }]}>
                  {apt.type} | {apt.status}
                </Text>
                <Text style={[styles.itemSub2, { fontSize: 12 * sizeScale }]}>
                  {apt.date ? new Date(apt.date).toLocaleString() : ''}
                </Text>
              </View>
            </View>
          ))
        )}
        <View style={styles.sectionDivider} />
        {/* Medications */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 * sizeScale }}>
          <MaterialCommunityIcons name="medical-bag" size={22 * sizeScale} color="#2563eb" style={{ marginRight: 8 }} />
          <Text style={[styles.sectionTitle, { fontSize: 18 * sizeScale }]}>Active Medications</Text>
        </View>
        {medications.length === 0 ? (
          <View style={styles.centeredWrap}><MaterialCommunityIcons name="pill-off" size={40 * sizeScale} color="#9ca3af" style={{ marginBottom: 8 * sizeScale }} /><Text style={[styles.emptyText, { marginBottom: 14 * sizeScale }]}>No active medications.</Text></View>
        ) : (
          medications.map((med, idx) => (
            <View
              key={med._id || idx}
              style={[
                styles.listItem,
                {
                  borderRadius: 14 * sizeScale,
                  padding: 12 * sizeScale,
                  marginBottom: 8 * sizeScale,
                },
              ]}
            >
              <MaterialCommunityIcons name="medical-services" size={20 * sizeScale} color="#94a3b8" style={{ marginRight: 8 * sizeScale }} />
              <View style={{ flex: 1 }}>
                <Text
                  style={[styles.itemTitle, { fontSize: 15 * sizeScale }]}
                  numberOfLines={1}
                >
                  {med.name}
                </Text>
                <Text style={[styles.itemSub, { fontSize: 12 * sizeScale }]}>
                  {med.dosage} | {med.frequency}
                </Text>
                <Text style={[styles.itemSub2, { fontSize: 12 * sizeScale }]}>{med.status}</Text>
              </View>
            </View>
          ))
        )}
        <View style={styles.sectionDivider} />
        {/* Allergies */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 * sizeScale }}>
          <MaterialCommunityIcons name="alert-circle" size={22 * sizeScale} color="#f59e42" style={{ marginRight: 8 }} />
          <Text style={[styles.sectionTitle, { fontSize: 18 * sizeScale }]}>Allergies</Text>
        </View>
        {allergies.length === 0 ? (
          <View style={styles.centeredWrap}><MaterialCommunityIcons name="emoticon-neutral-outline" size={40 * sizeScale} color="#9ca3af" style={{ marginBottom: 8 * sizeScale }} /><Text style={[styles.emptyText, { marginBottom: 14 * sizeScale }]}>No allergies reported.</Text></View>
        ) : (
          allergies.map((allergy, idx) => (
            <View
              key={allergy._id || idx}
              style={[
                styles.listItem,
                {
                  borderRadius: 14 * sizeScale,
                  padding: 12 * sizeScale,
                  marginBottom: 8 * sizeScale,
                },
              ]}
            >
              <MaterialCommunityIcons name="alert-circle" size={20 * sizeScale} color="#f59e42" style={{ marginRight: 8 * sizeScale }} />
              <Text style={[styles.itemTitle, { fontSize: 15 * sizeScale }]}>{allergy.name}</Text>
              <Text style={[styles.itemSub, { fontSize: 12 * sizeScale, marginLeft: 8 * sizeScale }]}>{allergy.severity}</Text>
            </View>
          ))
        )}
        <View style={styles.sectionDivider} />
        {/* Chronic Conditions */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 * sizeScale }}>
          <MaterialCommunityIcons name="heart-broken" size={22 * sizeScale} color="#ef4444" style={{ marginRight: 8 }} />
          <Text style={[styles.sectionTitle, { fontSize: 18 * sizeScale }]}>Chronic Conditions</Text>
        </View>
        {chronicConditions.length === 0 ? (
          <View style={styles.centeredWrap}><MaterialCommunityIcons name="emoticon-neutral-outline" size={40 * sizeScale} color="#9ca3af" style={{ marginBottom: 8 * sizeScale }} /><Text style={[styles.emptyText, { marginBottom: 14 * sizeScale }]}>No chronic conditions reported.</Text></View>
        ) : (
          chronicConditions.map((cond, idx) => (
            <View
              key={cond._id || idx}
              style={[
                styles.listItem,
                {
                  borderRadius: 14 * sizeScale,
                  padding: 12 * sizeScale,
                  marginBottom: 8 * sizeScale,
                },
              ]}
            >
              <MaterialCommunityIcons name="heart-broken" size={20 * sizeScale} color="#ef4444" style={{ marginRight: 8 * sizeScale }} />
              <Text style={[styles.itemTitle, { fontSize: 15 * sizeScale }]}>{cond.name}</Text>
              <Text style={[styles.itemSub, { fontSize: 12 * sizeScale, marginLeft: 8 * sizeScale }]}>{cond.status}</Text>
            </View>
          ))
        )}
        </>
        )}
      </ScrollView>
      <CustomTabBar />
    </View>
  );
}

// Hide the default header for this page
DashboardScreen.options = {
  headerShown: false,
};

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  welcome: {
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 2,
  },
  subtitle: {
    color: '#64748b',
    marginBottom: 8,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  metricCard: {
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 6,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    flexBasis: '30%',
    flexGrow: 1,
  },
  metricLabel: {
    fontWeight: 'bold',
    color: '#2563eb',
  },
  metricValue: {
    color: '#334155',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: 12,
  },
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 8,
  },
  quickAction: {
    backgroundColor: '#e0e7ff',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 6,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    flexGrow: 1,
  },
  quickActionLabel: {
    fontWeight: 'bold',
    color: '#2563eb',
  },
  sectionTitle: {
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 2,
    marginTop: 12,
  },
  emptyText: {
    color: '#64748b',
    marginBottom: 8,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderColor: '#e5e7eb',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  itemTitle: {
    fontWeight: '600',
    color: '#1e293b',
  },
  itemSub: {
    color: '#64748b',
  },
  itemSub2: {
    color: '#94a3b8',
  },
  quickActionsCol: {
    flexDirection: 'column',
    gap: 10,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 18,
    marginHorizontal: 0,
  },
  centeredWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
});