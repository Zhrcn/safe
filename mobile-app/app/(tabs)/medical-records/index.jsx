import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, useWindowDimensions } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMedicalRecords } from '../../../features/medicalRecords/medicalRecordsSlice';
import CustomHeader from '../../../components/ui/CustomHeader';
import CustomTabBar from '../../../components/ui/CustomTabBar';
import CustomDrawer from '../../../components/ui/CustomDrawer';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

const SECTIONS = [
  { key: 'vitalSigns', label: 'Vital Signs', icon: 'heart-pulse' },
  { key: 'allergies', label: 'Allergies', icon: 'alert-circle' },
  { key: 'chronicConditions', label: 'Chronic Conditions', icon: 'stethoscope' },
  { key: 'diagnoses', label: 'Diagnoses', icon: 'clipboard-pulse-outline' },
  { key: 'labResults', label: 'Lab Results', icon: 'flask-outline' },
  { key: 'imagingReports', label: 'Imaging', icon: 'image-multiple-outline' },
  { key: 'medications', label: 'Medications', icon: 'pill' },
  { key: 'immunizations', label: 'Immunizations', icon: 'needle' },
  { key: 'surgicalHistory', label: 'Surgical History', icon: 'hospital' },
  { key: 'documents', label: 'Documents', icon: 'file-document-outline' },
  { key: 'familyHistory', label: 'Family History', icon: 'account-group-outline' },
  { key: 'socialHistory', label: 'Social History', icon: 'account-voice' },
  { key: 'generalHistory', label: 'General History', icon: 'book-open-outline' },
  { key: 'emergencyContact', label: 'Emergency Contact', icon: 'phone-alert' },
  { key: 'personalInfo', label: 'Personal Info', icon: 'account-circle-outline' },
];

function SectionTab({ icon, label, active, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.tab, active && styles.tabActive]}>
      <MaterialCommunityIcons name={icon} size={18} color={active ? '#2563eb' : '#64748b'} />
      <Text style={[styles.tabLabel, { color: active ? '#2563eb' : '#64748b' }]} numberOfLines={1}>{label}</Text>
    </TouchableOpacity>
  );
}

function RecordCard({ item, sectionKey }) {
  if (sectionKey === 'vitalSigns') {
    return (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Date: {item.date ? new Date(item.date).toLocaleDateString() : 'N/A'}</Text>
        <Text style={styles.cardSub}>Heart Rate: {item.heartRate || 'N/A'} BPM</Text>
        <Text style={styles.cardSub}>Blood Pressure: {item.bloodPressure || 'N/A'}</Text>
        <Text style={styles.cardSub}>Temperature: {item.temperature || 'N/A'}°C</Text>
        <Text style={styles.cardSub}>Respiratory Rate: {item.respiratoryRate || 'N/A'} bpm</Text>
        <Text style={styles.cardSub}>BMI: {item.bmi || 'N/A'}</Text>
        <Text style={styles.cardSub}>Oxygen Saturation: {item.oxygenSaturation || 'N/A'}%</Text>
      </View>
    );
  }
  if (sectionKey === 'allergies') {
    return (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardSub}>Severity: {item.severity || 'N/A'}</Text>
        {item.notes && <Text style={styles.cardSub}>Notes: {item.notes}</Text>}
      </View>
    );
  }
  if (sectionKey === 'chronicConditions') {
    return (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardSub}>Status: {item.status || 'N/A'}</Text>
        {item.diagnosisDate && <Text style={styles.cardSub}>Diagnosed: {new Date(item.diagnosisDate).toLocaleDateString()}</Text>}
        {item.notes && <Text style={styles.cardSub}>Notes: {item.notes}</Text>}
      </View>
    );
  }
  if (sectionKey === 'medications') {
    return (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardSub}>Dosage: {item.dosage}</Text>
        <Text style={styles.cardSub}>Frequency: {item.frequency}</Text>
        <Text style={styles.cardSub}>Status: {item.status}</Text>
        {item.notes && <Text style={styles.cardSub}>Notes: {item.notes}</Text>}
      </View>
    );
  }
  if (sectionKey === 'labResults') {
    return (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{item.testName || 'Lab Result'}</Text>
        <Text style={styles.cardSub}>Date: {item.date ? new Date(item.date).toLocaleDateString() : 'N/A'}</Text>
        <Text style={styles.cardSub}>Result: {item.result || 'N/A'}</Text>
        {item.normalRange && <Text style={styles.cardSub}>Normal Range: {item.normalRange}</Text>}
        {item.unit && <Text style={styles.cardSub}>Unit: {item.unit}</Text>}
        {item.labName && <Text style={styles.cardSub}>Lab: {item.labName}</Text>}
      </View>
    );
  }
  if (sectionKey === 'imagingReports') {
    return (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{item.type || 'Imaging Report'}</Text>
        <Text style={styles.cardSub}>Date: {item.date ? new Date(item.date).toLocaleDateString() : 'N/A'}</Text>
        {item.images && <Text style={styles.cardSub}>Images: {item.images.length}</Text>}
        {item.notes && <Text style={styles.cardSub}>Notes: {item.notes}</Text>}
      </View>
    );
  }
  if (sectionKey === 'documents') {
    return (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{item.title || 'Document'}</Text>
        <Text style={styles.cardSub}>Type: {item.type}</Text>
        <Text style={styles.cardSub}>Date: {item.uploadDate ? new Date(item.uploadDate).toLocaleDateString() : 'N/A'}</Text>
      </View>
    );
  }
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{typeof item === 'object' ? JSON.stringify(item, null, 1) : String(item)}</Text>
    </View>
  );
}

export default function MedicalRecordsScreen() {
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector((state) => state.medicalRecords);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(SECTIONS[0].key);
  const { width } = useWindowDimensions();
  const sizeScale = width >= 900 ? 1.2 : width >= 600 ? 1.1 : 1;

  useEffect(() => {
    dispatch(fetchMedicalRecords());
  }, [dispatch]);

  const records = list && typeof list === 'object' && !Array.isArray(list) ? list : {};
  const section = records[activeTab];

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <CustomHeader onMenuPress={() => setDrawerOpen(true)} />
      <CustomDrawer visible={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <View style={{ flex: 1, padding: 8 * sizeScale }}>
        <Text style={{ fontSize: 20 * sizeScale, fontWeight: 'bold', marginBottom: 8 * sizeScale, color: '#2563eb' }}>Medical Records</Text>
      {loading && <Text>Loading...</Text>}
        {error && <Text style={{ color: 'red' }}>{error}</Text>}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginBottom: 12 * sizeScale, maxHeight: 44 * sizeScale }}
          contentContainerStyle={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 0 }}
        >
          {SECTIONS.map((tab) => (
            <SectionTab
              key={tab.key}
              icon={tab.icon}
              label={tab.label}
              active={activeTab === tab.key}
              onPress={() => setActiveTab(tab.key)}
            />
          ))}
        </ScrollView>
        <ScrollView style={{ flex: 1 }}>
          {loading ? null : !section || (Array.isArray(section) && section.length === 0) ? (
            <Text style={{ color: '#64748b', marginTop: 24 * sizeScale }}>No records found in this section.</Text>
          ) : Array.isArray(section) ? (
            section.map((item, idx) => <RecordCard key={item._id || idx} item={item} sectionKey={activeTab} />)
          ) : typeof section === 'object' ? (
            <RecordCard item={section} sectionKey={activeTab} />
          ) : (
            <Text style={{ color: '#1e293b' }}>{String(section)}</Text>
          )}
        </ScrollView>
          </View>
      <CustomTabBar />
    </View>
  );
} 

const styles = StyleSheet.create({
  tab: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 4,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
    minWidth: 68,
    maxWidth: 90,
    height: 36,
  },
  tabActive: {
    backgroundColor: '#e0e7ff',
    borderColor: '#2563eb',
    borderWidth: 1,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    marginTop: 1,
    textAlign: 'center',
    maxWidth: 80,
  },
  card: {
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#2563eb',
    marginBottom: 2,
  },
  cardSub: {
    color: '#334155',
    fontSize: 14,
    marginBottom: 1,
  },
});

MedicalRecordsScreen.options = {
  headerShown: false,
}; 