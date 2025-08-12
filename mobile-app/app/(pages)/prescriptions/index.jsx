import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, ActivityIndicator, Modal, StyleSheet, ScrollView, Dimensions, TouchableWithoutFeedback, Image } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPrescriptions } from '../../../features/prescriptions/prescriptionsSlice';
import { useRouter, useNavigation } from 'expo-router';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';

const STATUS_OPTIONS = [
  { key: 'all', label: 'All', color: '#64748b' },
  { key: 'active', label: 'Active', color: '#22c55e' },
  { key: 'completed', label: 'Completed', color: '#2563eb' },
  { key: 'pending', label: 'Pending', color: '#eab308' },
  { key: 'expired', label: 'Expired', color: '#ef4444' },
];

function getStatusColor(status) {
  switch ((status || '').toLowerCase()) {
    case 'active': return '#22c55e';
    case 'completed': return '#2563eb';
    case 'pending': return '#eab308';
    case 'expired': return '#ef4444';
    default: return '#64748b';
  }
}

function StatusBadge({ status }) {
  const color = getStatusColor(status);
  return (
    <View style={{ backgroundColor: color, borderRadius: 12, paddingHorizontal: 8, paddingVertical: 2, marginLeft: 8 }}>
      <Text style={{ color: '#fff', fontSize: 12, fontWeight: 'bold', textTransform: 'capitalize' }}>{status || 'unknown'}</Text>
    </View>
  );
}

function PrescriptionCard({ prescription, onViewDetails }) {
  const doctorName = prescription.doctorName ? `Dr. ${prescription.doctorName}` : 'Doctor';
  const prescriptionDate = prescription.date ? new Date(prescription.date).toLocaleDateString() : 'N/A';
  const expiryDate = prescription.expiryDate ? new Date(prescription.expiryDate).toLocaleDateString() : 'N/A';
  const medications = Array.isArray(prescription.medications) ? prescription.medications : [];
  return (
    <TouchableOpacity style={styles.card} onPress={() => onViewDetails(prescription)}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>{doctorName}</Text>
          <Text style={styles.cardSub}>{prescription.doctorSpecialty || ''}</Text>
        </View>
        <StatusBadge status={prescription.status} />
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
        <MaterialIcons name="event" size={18} color="#9ca3af" style={{ marginRight: 4 }} />
        <Text style={styles.cardMeta}>{prescriptionDate}</Text>
        <Text style={styles.cardMeta}> | </Text>
        <MaterialIcons name="event-busy" size={18} color="#9ca3af" style={{ marginRight: 4 }} />
        <Text style={styles.cardMeta}>{expiryDate}</Text>
      </View>
      <Text style={styles.cardDiagnosis}>{prescription.diagnosis || ''}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
        <MaterialCommunityIcons name="pill" size={18} color="#2563eb" style={{ marginRight: 4 }} />
        <Text style={styles.cardMedications}>{medications.length} medications</Text>
      </View>
    </TouchableOpacity>
  );
}

function PrescriptionDetailsModal({ visible, prescription, onClose }) {
  if (!prescription) return null;
  const doctorName = prescription.doctorName ? `Dr. ${prescription.doctorName}` : 'Doctor';
  const prescriptionDate = prescription.date ? new Date(prescription.date).toLocaleDateString() : 'N/A';
  const expiryDateObj = prescription.expiryDate ? new Date(prescription.expiryDate) : null;
  const expiryDate = expiryDateObj ? expiryDateObj.toLocaleDateString() : 'N/A';
  const medications = Array.isArray(prescription.medications) ? prescription.medications : [];
  const dispenseHistory = Array.isArray(prescription.dispenseHistory) ? prescription.dispenseHistory : [];
  const isActiveAndNotExpired =
    prescription.status && prescription.status.toLowerCase() === 'active' &&
    (!expiryDateObj || expiryDateObj > new Date());
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Prescription Details</Text>
              <Text style={styles.modalLabel}>Doctor: <Text style={styles.modalValue}>{doctorName}</Text></Text>
              <Text style={styles.modalLabel}>Specialty: <Text style={styles.modalValue}>{prescription.doctorSpecialty || ''}</Text></Text>
              <Text style={styles.modalLabel}>Date: <Text style={styles.modalValue}>{prescriptionDate}</Text></Text>
              <Text style={styles.modalLabel}>Expiry: <Text style={styles.modalValue}>{expiryDate}</Text></Text>
              <Text style={styles.modalLabel}>Diagnosis: <Text style={styles.modalValue}>{prescription.diagnosis || ''}</Text></Text>
              <Text style={styles.modalLabel}>Medications:</Text>
              {medications.length > 0 ? medications.map((med, idx) => (
                <View key={idx} style={styles.medicationItem}>
                  <Text style={styles.medicationName}>{med.name}</Text>
                  <Text style={styles.medicationDetail}>Dosage: {med.dosage}</Text>
                  <Text style={styles.medicationDetail}>Frequency: {med.frequency}</Text>
                  {med.duration && <Text style={styles.medicationDetail}>Duration: {med.duration}</Text>}
                  {med.route && <Text style={styles.medicationDetail}>Route: {med.route}</Text>}
                  {med.instructions && <Text style={styles.medicationDetail}>Instructions: {med.instructions}</Text>}
                </View>
              )) : <Text style={styles.medicationDetail}>No medications listed.</Text>}
              {dispenseHistory.length > 0 && (
                <View style={styles.dispenseHistoryBox}>
                  <Text style={styles.modalLabel}>Dispense History:</Text>
                  {dispenseHistory.map((entry, idx) => (
                    <Text key={idx} style={styles.medicationDetail}>
                      Pharmacist: {entry.pharmacistId || '-'} | Date: {entry.dispenseDate ? new Date(entry.dispenseDate).toLocaleDateString() : '-'} | Quantity: {entry.quantityDispensed || '-'}
                      {entry.pharmacyNotes && ` | Notes: ${entry.pharmacyNotes}`}
                    </Text>
                  ))}
                </View>
              )}
              {isActiveAndNotExpired && prescription.id && (
                <View style={{ alignSelf: 'center', marginTop: 18, marginBottom: 8, alignItems: 'center' }}>
                  <Text style={{ fontWeight: 'bold', color: '#2563eb', marginBottom: 6 }}>Show this QR code to the pharmacist</Text>
                  <QRCode
                    value={String(prescription.id)}
                    size={160}
                    color="#2563eb"
                    backgroundColor="#fff"
                  />
                  <Text style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>Prescription ID: {prescription.id}</Text>
                </View>
              )}
              <TouchableOpacity style={styles.closeModalBtn} onPress={onClose}>
                <Text style={styles.closeModalBtnText}>Close</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

export default function PrescriptionsScreen() {
  const dispatch = useDispatch();
  const router = useRouter();
  const navigation = useNavigation();
  const { list, loading, error } = useSelector((state) => state.prescriptions);
  console.log('Redux prescriptions list:', list);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showDetails, setShowDetails] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);

  useEffect(() => {
    dispatch(fetchPrescriptions());
  }, [dispatch]);

  const filtered = (list || []).filter(p => {
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    if (!search) return true;
    const term = search.toLowerCase();
    return (
      (p.doctorName && p.doctorName.toLowerCase().includes(term)) ||
      (p.medications && Array.isArray(p.medications) && p.medications.some(med => med && med.name && med.name.toLowerCase().includes(term))) ||
      (p.notes && p.notes.toLowerCase().includes(term)) ||
      (p.id && String(p.id).toLowerCase().includes(term))
    );
  });

  return (
    <View style={{ flex: 1, backgroundColor: '#f8fafc', paddingHorizontal: 8, paddingTop: 12 }}>
      <TouchableOpacity onPress={() => {
        if (navigation.canGoBack()) {
          router.back();
        } else {
          router.replace('/(tabs)/home');
        }
      }} style={{ marginBottom: 12, alignSelf: 'flex-start' }}>
        <MaterialIcons name="arrow-back" size={28} color="#2563eb" />
      </TouchableOpacity>
      <Text style={{ fontSize: 26, fontWeight: 'bold', color: '#2563eb', marginBottom: 8 }}>Prescriptions</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 10, paddingHorizontal: 10, marginBottom: 10, borderWidth: 1, borderColor: '#e5e7eb' }}>
        <MaterialIcons name="search" size={20} color="#64748b" style={{ marginRight: 6 }} />
        <TextInput
          style={{ flex: 1, fontSize: 15, paddingVertical: 8 }}
          placeholder="Search by doctor, medication, or notes"
          value={search}
          onChangeText={setSearch}
          placeholderTextColor="#9ca3af"
        />
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 10 }} contentContainerStyle={{ flexDirection: 'row' }}>
        {STATUS_OPTIONS.map(opt => (
          <TouchableOpacity
            key={opt.key}
            style={{
              backgroundColor: statusFilter === opt.key ? opt.color : '#e5e7eb',
              borderRadius: 16,
              width: 90,
              height: 38,
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 8,
              marginBottom: 4,
            }}
            onPress={() => setStatusFilter(opt.key)}
          >
            <Text style={{ color: statusFilter === opt.key ? '#fff' : '#374151', fontWeight: 'bold', fontSize: 15, textAlign: 'center' }}>{opt.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {loading && (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#2563eb" />
        </View>
      )}
      {error && (
        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#fee2e2', borderRadius: 8, padding: 8, marginBottom: 8 }}>
          <MaterialIcons name="error-outline" size={20} color="#ef4444" style={{ marginRight: 6 }} />
          <Text style={{ color: '#ef4444', fontSize: 15 }}>{error}</Text>
        </View>
      )}
      {!loading && filtered.length === 0 && (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 32 }}>
          <MaterialIcons name="event-busy" size={54} color="#9ca3af" style={{ marginBottom: 12 }} />
          <Text style={{ fontSize: 17, color: '#64748b', marginBottom: 8 }}>No prescriptions found</Text>
        </View>
      )}
      {!loading && filtered.length > 0 && (
        <FlatList
          data={filtered}
          keyExtractor={item => item.id?.toString()}
          renderItem={({ item }) => (
            <PrescriptionCard prescription={item} onViewDetails={p => { setSelectedPrescription(p); setShowDetails(true); }} />
          )}
          contentContainerStyle={{ paddingBottom: 24 }}
        />
      )}
      <PrescriptionDetailsModal
        visible={showDetails}
        prescription={selectedPrescription}
        onClose={() => setShowDetails(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#2563eb',
  },
  cardSub: {
    color: '#374151',
    fontSize: 14,
    marginBottom: 2,
  },
  cardMeta: {
    color: '#6b7280',
    fontSize: 13,
    marginRight: 6,
  },
  cardDiagnosis: {
    color: '#334155',
    fontSize: 14,
    marginTop: 2,
    marginBottom: 2,
  },
  cardMedications: {
    color: '#2563eb',
    fontWeight: 'bold',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#e0e7ff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 16,
  },
  modalLabel: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#374151',
    marginTop: 6,
  },
  modalValue: {
    fontWeight: 'normal',
    color: '#2563eb',
  },
  medicationItem: {
    marginTop: 6,
    marginBottom: 2,
    paddingLeft: 8,
  },
  medicationName: {
    fontWeight: 'bold',
    color: '#2563eb',
    fontSize: 15,
  },
  medicationDetail: {
    color: '#334155',
    fontSize: 13,
    marginLeft: 4,
  },
  dispenseHistoryBox: {
    marginTop: 10,
    marginBottom: 6,
    backgroundColor: '#f1f5f9',
    borderRadius: 10,
    padding: 10,
  },
  closeModalBtn: {
    marginTop: 18,
    alignSelf: 'center',
    backgroundColor: '#2563eb',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  closeModalBtnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
}); 