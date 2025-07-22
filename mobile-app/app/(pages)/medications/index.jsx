import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, ActivityIndicator, StyleSheet, Modal, ScrollView, Dimensions, Alert, Animated, Easing, Pressable, Platform } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMedications, addMedication, editMedication, removeMedication, updateReminders, requestRefill } from '../../../features/medications/medicationsSlice';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const TABS = [
  { key: 'medications', label: 'Medications', icon: 'pill' },
  { key: 'reminders', label: 'Reminders', icon: 'bell-ring' },
  { key: 'availability', label: 'Availability', icon: 'magnify' },
];

const STATUS_OPTIONS = [
  { key: 'all', label: 'All', color: '#64748b' },
  { key: 'active', label: 'Active', color: '#22c55e' },
  { key: 'completed', label: 'Completed', color: '#2563eb' },
  { key: 'expired', label: 'Expired', color: '#ef4444' },
];

const windowWidth = Dimensions.get('window').width;

function getStatusColor(status) {
  switch ((status || '').toLowerCase()) {
    case 'active': return '#22c55e';
    case 'completed': return '#2563eb';
    case 'expired': return '#ef4444';
    default: return '#64748b';
  }
}

function getInitials(name) {
  if (!name) return '';
  const parts = name.split(' ');
  if (parts.length === 1) return parts[0][0];
  return parts[0][0] + parts[1][0];
}

function Header({ onBack }) {
  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.headerBack} onPress={onBack} accessibilityLabel="Back">
        <MaterialCommunityIcons name="arrow-left" size={26} color="#2563eb" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Medications</Text>
      <View style={{ width: 32 }} />
    </View>
  );
}

function Snackbar({ visible, message, onDismiss }) {
  if (!visible) return null;
  return (
    <View style={styles.snackbar} accessibilityLiveRegion="polite">
      <Text style={styles.snackbarText}>{message}</Text>
      <TouchableOpacity onPress={onDismiss} accessibilityLabel="Dismiss notification">
        <MaterialCommunityIcons name="close" size={20} color="white" />
      </TouchableOpacity>
    </View>
  );
}

function MedicationDetailsModal({ visible, medication, onClose }) {
  if (!medication) return null;
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
      accessibilityViewIsModal
      accessibilityLabel="Medication details"
    >
      <Pressable style={styles.modalOverlay} onPress={onClose} accessible={false} />
      <View style={styles.bottomSheet}>
        <View style={{ alignItems: 'center', marginBottom: 12 }}>
          <View style={styles.modalHandle} />
        </View>
        <Text style={styles.modalTitle}>{medication.name}</Text>
        <Text style={styles.modalSub}>{medication.dosage} - {medication.frequency}</Text>
        {medication.prescribedBy && (
          <Text style={styles.modalMeta}><MaterialCommunityIcons name="hospital" size={16} color="#2563eb" /> {medication.prescribedBy.firstName} {medication.prescribedBy.lastName}</Text>
        )}
        {medication.refillDate && (
          <Text style={styles.modalMeta}><MaterialCommunityIcons name="calendar" size={16} color="#2563eb" /> Next refill: {new Date(medication.refillDate).toLocaleDateString()}</Text>
        )}
        {medication.notes && (
          <View style={styles.alertBox}>
            <MaterialCommunityIcons name="alert-circle" size={16} color="#f59e42" />
            <Text style={styles.alertText}>{medication.notes}</Text>
          </View>
        )}
        <TouchableOpacity style={styles.closeModalBtn} onPress={onClose} accessibilityLabel="Close details">
          <Text style={styles.closeModalBtnText}>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

function MedicationCard({ medication, onEdit, onDelete, onSetReminder, onRefill, onViewDetails, index }) {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      delay: index * 60,
      useNativeDriver: true,
      easing: Easing.out(Easing.ease),
    }).start();
  }, [fadeAnim, index]);
  return (
    <Animated.View style={[styles.card, {
      opacity: fadeAnim,
      transform: [{ translateY: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }],
    }]}> 
      <View style={styles.cardTopRow}>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(medication.status) }]}/>
        <Text style={styles.cardTitle}>{medication.name}</Text>
        <TouchableOpacity style={styles.cardIconBtn} onPress={() => onViewDetails(medication)} accessibilityLabel="View details">
          <MaterialCommunityIcons name="eye" size={20} color="#2563eb" />
        </TouchableOpacity>
      </View>
      <Text style={styles.cardSub}>{medication.dosage} - {medication.frequency}</Text>
      <View style={styles.cardMetaRow}>
        {medication.prescribedBy && (
          <View style={styles.avatarWrap}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{getInitials(`${medication.prescribedBy.firstName} ${medication.prescribedBy.lastName}`)}</Text>
            </View>
          </View>
        )}
        {medication.prescribedBy && (
          <Text style={styles.cardMeta}><MaterialCommunityIcons name="hospital" size={15} color="#2563eb" /> {medication.prescribedBy.firstName} {medication.prescribedBy.lastName}</Text>
        )}
        {medication.refillDate && (
          <Text style={styles.cardMeta}><MaterialCommunityIcons name="calendar" size={15} color="#2563eb" /> {new Date(medication.refillDate).toLocaleDateString()}</Text>
        )}
      </View>
      {medication.notes ? (
        <View style={styles.alertBox}>
          <MaterialCommunityIcons name="alert-circle" size={15} color="#f59e42" />
          <Text style={styles.alertText}>{medication.notes}</Text>
        </View>
      ) : null}
      <View style={styles.cardActionsRow}>
        <TouchableOpacity style={[styles.iconActionBtn, { backgroundColor: '#2563eb' }]} onPress={() => onEdit(medication)} accessibilityLabel="Edit medication">
          <MaterialCommunityIcons name="pencil" size={18} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.iconActionBtn, { backgroundColor: medication.remindersEnabled ? '#64748b' : '#22c55e' }]} onPress={() => onSetReminder(medication)} accessibilityLabel={medication.remindersEnabled ? 'Disable reminder' : 'Enable reminder'}>
          <MaterialCommunityIcons name={medication.remindersEnabled ? 'bell-off' : 'bell-ring'} size={18} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.iconActionBtn, { backgroundColor: '#22c55e' }]} onPress={() => onRefill(medication)} accessibilityLabel="Request refill">
          <MaterialCommunityIcons name="refresh" size={18} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.iconActionBtn, { backgroundColor: '#ef4444' }]} onPress={() => onDelete(medication._id)} accessibilityLabel="Delete medication">
          <MaterialCommunityIcons name="trash-can" size={18} color="white" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

function ReminderRow({ medication, onToggle, onEdit }) {
  return (
    <View style={styles.reminderRow}>
      <MaterialCommunityIcons name="bell-ring" size={22} color="#2563eb" style={{ marginRight: 10 }} />
      <Text style={styles.reminderName}>{medication.name}</Text>
      <TouchableOpacity style={styles.reminderToggle} onPress={() => onToggle(medication)} accessibilityLabel={medication.remindersEnabled ? 'Disable reminder' : 'Enable reminder'}>
        <MaterialCommunityIcons name={medication.remindersEnabled ? 'toggle-switch' : 'toggle-switch-off-outline'} size={32} color={medication.remindersEnabled ? '#22c55e' : '#64748b'} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.reminderEdit} onPress={() => onEdit(medication)} accessibilityLabel="Edit reminder">
        <MaterialCommunityIcons name="pencil" size={20} color="#2563eb" />
      </TouchableOpacity>
    </View>
  );
}

function PharmacyRequestCard({ request }) {
  return (
    <View style={styles.requestCard}>
      <MaterialCommunityIcons name="pharmacy" size={28} color="#6366f1" style={{ marginRight: 10 }} />
      <View style={{ flex: 1 }}>
        <Text style={styles.requestTitle}>{request.medicineName}</Text>
        <Text style={styles.requestMeta}>Pharmacy: {request.pharmacyName}</Text>
        <Text style={styles.requestMeta}>Status: {request.status}</Text>
        <Text style={styles.requestMeta}>Date: {new Date(request.createdAt).toLocaleDateString()}</Text>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={28} color="#64748b" />
    </View>
  );
}

export default function MedicationsScreen() {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.medications);
  const [activeTab, setActiveTab] = useState('medications');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddEdit, setShowAddEdit] = useState(false);
  const [editMedication, setEditMedication] = useState(null);
  const [showReminder, setShowReminder] = useState(false);
  const [reminderMedication, setReminderMedication] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [detailsMedication, setDetailsMedication] = useState(null);
  const [snackbar, setSnackbar] = useState({ visible: false, message: '' });

  useEffect(() => {
    dispatch(fetchMedications());
  }, [dispatch]);

  const filteredMedications = useMemo(() => {
    return (items || []).filter(med => {
      const matchesSearch = (med.name || '').toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' || (med.status || '').toLowerCase() === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [items, search, statusFilter]);

  const handleEdit = (med) => {
    setEditMedication(med);
    setShowAddEdit(true);
  };
  const handleDelete = (id) => {
    Alert.alert('Delete Medication', 'Are you sure you want to delete this medication?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => { dispatch(removeMedication(id)); setSnackbar({ visible: true, message: 'Medication deleted.' }); } },
    ]);
  };
  const handleSetReminder = (med) => {
    setReminderMedication(med);
    setShowReminder(true);
  };
  const handleRefill = (med) => {
    dispatch(requestRefill(med._id));
    setSnackbar({ visible: true, message: 'Refill requested.' });
  };
  const handleViewDetails = (med) => {
    setDetailsMedication(med);
    setShowDetails(true);
  };
  const handleSnackbarDismiss = () => setSnackbar({ visible: false, message: '' });

  return (
    <View style={styles.gradientBg}>
      <Header onBack={() => {}} />
      <View style={styles.tabsRow}>
        {TABS.map(tab => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tabPill, activeTab === tab.key && styles.tabPillActive]}
            onPress={() => setActiveTab(tab.key)}
            accessibilityRole="tab"
            accessibilityState={{ selected: activeTab === tab.key }}
          >
            <MaterialCommunityIcons name={tab.icon} size={18} color={activeTab === tab.key ? '#fff' : '#2563eb'} />
            <Text style={[styles.tabPillText, activeTab === tab.key && styles.tabPillTextActive]}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.searchBarWrap}>
        <MaterialCommunityIcons name="magnify" size={20} color="#9ca3af" style={{ marginRight: 8 }} />
        <TextInput
          placeholder="Search medications..."
          value={search}
          onChangeText={setSearch}
          style={styles.searchBarInput}
          placeholderTextColor="#9ca3af"
          accessibilityLabel="Search medications"
        />
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterChipsRow} contentContainerStyle={{ paddingHorizontal: 8 }}>
        {STATUS_OPTIONS.map(opt => (
          <TouchableOpacity
            key={opt.key}
            style={[styles.chip, statusFilter === opt.key && { backgroundColor: opt.color }]}
            onPress={() => setStatusFilter(opt.key)}
            accessibilityRole="button"
            accessibilityState={{ selected: statusFilter === opt.key }}
          >
            <Text style={[styles.chipText, statusFilter === opt.key && { color: 'white', fontWeight: 'bold' }]}>{opt.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {activeTab === 'medications' && (
        loading ? (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 32 }}>
            <ActivityIndicator size="large" color="#2563eb" />
            <Text style={{ color: '#2563eb', marginTop: 12, fontWeight: 'bold' }}>Loading medications...</Text>
          </View>
        ) : error ? (
          <Text style={{ color: 'red', marginTop: 32, textAlign: 'center' }}>{error}</Text>
        ) : (
          <FlatList
            contentContainerStyle={{ padding: 16, paddingBottom: 80 }}
            data={filteredMedications}
            keyExtractor={item => item._id?.toString()}
            renderItem={({ item, index }) => (
              <MedicationCard
                medication={item}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onSetReminder={handleSetReminder}
                onRefill={handleRefill}
                onViewDetails={handleViewDetails}
                index={index}
              />
            )}
            ListEmptyComponent={<View style={{ alignItems: 'center', marginTop: 48 }}><MaterialCommunityIcons name="emoticon-sad-outline" size={48} color="#9ca3af" /><Text style={{ color: '#6b7280', fontSize: 18, marginTop: 8, marginBottom: 8 }}>No medications found.</Text><Text style={{ color: '#2563eb', fontWeight: 'bold' }}>Try adjusting your search.</Text></View>}
            accessibilityLabel="Medications list"
          />
        )
      )}
      {activeTab === 'reminders' && (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 }}>
          <MaterialCommunityIcons name="bell-ring" size={48} color="#2563eb" />
          <Text style={{ color: '#2563eb', fontWeight: 'bold', fontSize: 20, marginTop: 12 }}>Reminders tab coming soon.</Text>
        </View>
      )}
      {activeTab === 'availability' && (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 }}>
          <MaterialCommunityIcons name="magnify" size={48} color="#2563eb" />
          <Text style={{ color: '#2563eb', fontWeight: 'bold', fontSize: 20, marginTop: 12 }}>Availability tab coming soon.</Text>
        </View>
      )}
      {/* Floating Add Button */}
      {activeTab === 'medications' && (
        <TouchableOpacity style={styles.fab} onPress={() => setShowAddEdit(true)} accessibilityLabel="Add medication" accessibilityRole="button">
          <MaterialCommunityIcons name="plus" size={32} color="white" />
        </TouchableOpacity>
      )}
      {/* Details Modal */}
      <MedicationDetailsModal visible={showDetails} medication={detailsMedication} onClose={() => setShowDetails(false)} />
      {/* Snackbar */}
      <Snackbar visible={snackbar.visible} message={snackbar.message} onDismiss={handleSnackbarDismiss} />
    </View>
  );
}

const styles = StyleSheet.create({
  gradientBg: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 56 : 32,
    paddingBottom: 12,
    paddingHorizontal: 18,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    zIndex: 10,
  },
  headerBack: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
  },
  headerTitle: {
    fontWeight: 'bold',
    fontSize: 22,
    color: '#2563eb',
    textAlign: 'center',
    flex: 1,
  },
  tabsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 8,
    gap: 8,
  },
  tabPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0e7ff',
    borderRadius: 22,
    paddingHorizontal: 18,
    paddingVertical: 8,
    marginHorizontal: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  tabPillActive: {
    backgroundColor: '#2563eb',
  },
  tabPillText: {
    color: '#2563eb',
    fontWeight: 'bold',
    fontSize: 15,
    marginLeft: 6,
  },
  tabPillTextActive: {
    color: '#fff',
  },
  searchBarWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginHorizontal: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  searchBarInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    paddingVertical: 4,
    backgroundColor: 'transparent',
  },
  filterChipsRow: {
    marginBottom: 8,
    marginTop: 2,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 16,
    backgroundColor: '#e5e7eb',
    marginRight: 8,
    marginBottom: 4,
  },
  chipText: {
    color: '#374151',
    fontWeight: 'bold',
    fontSize: 14,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    marginBottom: 18,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 10,
    elevation: 3,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  statusBadge: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#111827',
    flex: 1,
  },
  cardIconBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e0e7ff',
    marginLeft: 8,
  },
  cardSub: {
    color: '#2563eb',
    fontSize: 15,
    marginBottom: 2,
    fontWeight: '500',
  },
  cardMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    marginBottom: 2,
    gap: 8,
  },
  avatarWrap: {
    alignItems: 'center',
    marginRight: 6,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#e0e7ff',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarText: {
    color: '#3730a3',
    fontWeight: 'bold',
    fontSize: 13,
  },
  cardMeta: {
    color: '#6b7280',
    fontSize: 13,
    marginRight: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  alertBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fffbe6',
    borderRadius: 8,
    padding: 8,
    marginTop: 8,
    marginBottom: 2,
  },
  alertText: {
    color: '#b45309',
    marginLeft: 6,
    fontSize: 13,
  },
  cardActionsRow: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 10,
    justifyContent: 'flex-end',
  },
  iconActionBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 2,
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 1,
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 32,
    backgroundColor: '#2563eb',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 6,
    zIndex: 100,
  },
  snackbar: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 24,
    backgroundColor: '#111827ee',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 8,
  },
  snackbarText: {
    color: 'white',
    fontSize: 16,
    flex: 1,
    marginRight: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000055',
  },
  bottomSheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 12,
    minHeight: 220,
  },
  modalHandle: {
    width: 48,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#e5e7eb',
    alignSelf: 'center',
    marginBottom: 8,
  },
  modalTitle: {
    fontWeight: 'bold',
    fontSize: 22,
    color: '#111827',
    textAlign: 'center',
    marginBottom: 2,
  },
  modalSub: {
    color: '#2563eb',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: '500',
  },
  modalMeta: {
    color: '#6b7280',
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 4,
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
  reminderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  reminderName: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 16,
    color: '#111827',
  },
  reminderToggle: {
    marginHorizontal: 8,
  },
  reminderEdit: {
    marginLeft: 4,
  },
  requestCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  requestTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#111827',
    marginBottom: 2,
  },
  requestMeta: {
    color: '#6b7280',
    fontSize: 13,
    marginBottom: 1,
  },
}); 