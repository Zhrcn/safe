import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Modal, TextInput, TouchableOpacity, ActivityIndicator, Image, Alert, Platform, StyleSheet, useWindowDimensions, ScrollView } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAppointments } from '../../../features/appointments/appointmentsSlice';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useNavigation } from 'expo-router';

const APPOINTMENT_TYPES = [
  'Check-up',
  'Follow-up',
  'Consultation',
  'Emergency',
];
const TABS = [
  { key: 'upcoming', label: 'Upcoming', icon: 'event-available' },
  { key: 'past', label: 'Past', icon: 'history' },
  { key: 'cancelled', label: 'Cancelled', icon: 'cancel' },
];

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
};
const formatTime = (timeStr) => timeStr || '';

const StatusBadge = ({ status }) => {
  let color = '#fde68a', text = '#b45309';
  if (status === 'confirmed' || status === 'accepted' || status === 'scheduled') { color = '#dbeafe'; text = '#1d4ed8'; }
  if (status === 'cancelled' || status === 'rejected') { color = '#fecaca'; text = '#b91c1c'; }
  if (status === 'completed') { color = '#bbf7d0'; text = '#15803d'; }
  return (
    <View style={{ backgroundColor: color, borderRadius: 12, paddingHorizontal: 8, paddingVertical: 2, marginLeft: 8 }}>
      <Text style={{ color: text, fontSize: 12, fontWeight: 'bold', textTransform: 'capitalize' }}>{status || 'pending'}</Text>
    </View>
  );
};

const DoctorAvatar = ({ doctor }) => {
  const uri = doctor?.user?.profileImage;
  const initials = doctor?.user ? `${doctor.user.firstName?.[0] || ''}${doctor.user.lastName?.[0] || ''}`.toUpperCase() : 'D';
  if (uri) {
    return <Image source={{ uri }} style={{ width: 44, height: 44, borderRadius: 22, marginRight: 12, backgroundColor: '#e0e7ef' }} />;
  }
  return (
    <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: '#e0e7ef', marginRight: 12, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: '#64748b', fontWeight: 'bold', fontSize: 18 }}>{initials}</Text>
    </View>
  );
};

const getDoctorName = (item) => {
  if (item.doctor && item.doctor.user) {
    return `Dr. ${item.doctor.user.firstName || ''} ${item.doctor.user.lastName || ''}`.trim();
  }
  return item.doctorName || 'Doctor';
};

const statusAccent = (status) => {
  if (status === 'pending') return '#facc15';
  if (status === 'accepted' || status === 'confirmed' || status === 'scheduled') return '#60a5fa';
  if (status === 'completed') return '#4ade80';
  if (status === 'cancelled' || status === 'rejected') return '#f87171';
  return '#e5e7eb';
};

const isDefaultDate = (date) => {
  if (!date) return true;
  const d = new Date(date);
  return d.getFullYear() === 1111 && d.getMonth() === 0 && d.getDate() === 1;
};

const canReschedule = (date, time) => {
  if (!date || isDefaultDate(date)) return false;
  try {
    let appointmentDate = new Date(date);
    if (time && time !== 'TBD') {
      const [hours, minutes] = time.split(':');
      appointmentDate.setHours(Number(hours), Number(minutes), 0, 0);
    }
    const now = new Date();
    return (appointmentDate.getTime() - now.getTime()) > 24 * 60 * 60 * 1000;
  } catch {
    return false;
  }
};

function TabButton({ icon, label, active, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.tabBtn, active && styles.tabBtnActive]}> 
      <MaterialIcons name={icon} size={20} color={active ? '#2563eb' : '#64748b'} />
      <Text style={[styles.tabBtnLabel, { color: active ? '#2563eb' : '#64748b' }]}>{label}</Text>
    </TouchableOpacity>
  );
}

export default function AppointmentsScreen() {
  const dispatch = useDispatch();
  const router = useRouter();
  const navigation = useNavigation();
  const { list, loading, error } = useSelector((state) => state.appointments);
  const [modalVisible, setModalVisible] = useState(false);
  const [type, setType] = useState('');
  const [date, setDate] = useState('1111-01-01T00:00:00.000Z');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [success, setSuccess] = useState(false);
  const [formError, setFormError] = useState('');
  const [editId, setEditId] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [search, setSearch] = useState('');
  const { width } = useWindowDimensions();
  const sizeScale = width >= 900 ? 1.2 : width >= 600 ? 1.1 : 1;

  useEffect(() => {
    dispatch(fetchAppointments());
  }, [dispatch]);

  // Filter appointments by tab
  const now = new Date();
  const filtered = (list || []).filter(item => {
    if (activeTab === 'upcoming') {
      if (item.status === 'cancelled' || item.status === 'rejected') return false;
      const date = new Date(item.date);
      return date >= now || isDefaultDate(item.date);
    }
    if (activeTab === 'past') {
      if (item.status === 'cancelled' || item.status === 'rejected') return false;
      const date = new Date(item.date);
      return date < now && !isDefaultDate(item.date);
    }
    if (activeTab === 'cancelled') {
      return item.status === 'cancelled' || item.status === 'rejected';
    }
    return true;
  }).filter(item => {
    // Search filter
    const docName = getDoctorName(item).toLowerCase();
    const typeMatch = (item.type || '').toLowerCase();
    return (
      docName.includes(search.toLowerCase()) ||
      typeMatch.includes(search.toLowerCase()) ||
      (item.location || '').toLowerCase().includes(search.toLowerCase())
    );
  });

  const openEditModal = (item) => {
    setEditId(item._id || item.id);
    setType(item.type || '');
    setDate(item.date || '');
    setTime(item.time || '');
    setLocation(item.location || '');
    setNotes(item.notes || '');
    setModalVisible(true);
  };

  const openRescheduleModal = (item) => {
    setEditId(item._id || item.id);
    setType(item.type || '');
    setDate(item.date || '');
    setTime(item.time || '');
    setLocation(item.location || '');
    setNotes(item.notes || '');
    setModalVisible(true);
  };

  const handleBook = () => {
    if (!type || !date || !time || !location) {
      setFormError('Please fill in all required fields.');
      return;
    }
    setFormError('');
    if (editId) {
      // Edit or reschedule
      // This part of the logic needs to be updated to use the backend data
      // For now, it will just update the local state, which won't persist
      // setAppointments((prev) => prev.map((apt) =>
      //   (apt._id === editId || apt.id === editId)
      //     ? { ...apt, type, date, time, location, notes, status: apt.status === 'pending' ? 'pending' : 'rescheduled' }
      //     : apt
      // ));
    } else {
      // New appointment: always pending
      // This part of the logic needs to be updated to use the backend data
      // For now, it will just update the local state, which won't persist
      // setAppointments((prev) => [
      //   ...prev,
      //   {
      //     id: Date.now(),
      //     type,
      //     date: date || '1111-01-01T00:00:00.000Z',
      //     time,
      //     location,
      //     notes,
      //     status: 'pending',
      //     doctor: { user: { firstName: 'John', lastName: 'Doe' } },
      //   },
      // ]);
    }
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setModalVisible(false);
      setType('');
      setDate('');
      setTime('');
      setLocation('');
      setNotes('');
      setDoctorName('');
      setEditId(null);
    }, 1500);
  };

  const handleCancel = (item) => {
    Alert.alert(
      'Cancel Appointment',
      'Are you sure you want to cancel this appointment?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes',
          onPress: () => {
            // This part of the logic needs to be updated to use the backend data
            // For now, it will just update the local state, which won't persist
            // setAppointments((prev) => prev.map((apt) =>
            //   (apt._id === item._id || apt.id === item.id)
            //     ? { ...apt, status: 'cancelled' }
            //     : apt
            // ));
          },
        },
      ]
    );
  };

  // Date/time picker handlers
  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate.toISOString().split('T')[0]);
    }
  };
  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const hours = selectedTime.getHours().toString().padStart(2, '0');
      const minutes = selectedTime.getMinutes().toString().padStart(2, '0');
      setTime(`${hours}:${minutes}`);
    }
  };

  const renderAppointment = ({ item }) => {
    const isPending = item.status === 'pending';
    const isCancelled = item.status === 'cancelled';
    const isAccepted = item.status === 'accepted' || item.status === 'confirmed' || item.status === 'scheduled';
    return (
      <View style={styles.appointmentCard}> 
        <View style={styles.appointmentContent}>
          <View style={styles.header}>
            <Text style={styles.appointmentType}>{item.type || 'Appointment'}</Text>
            <StatusBadge status={item.status} />
          </View>
          <View style={styles.doctorInfo}>
            <DoctorAvatar doctor={item.doctor} />
            <Text style={styles.doctorName}>{getDoctorName(item)}</Text>
          </View>
          <View style={styles.dateTimeRow}>
            <View style={styles.dateTimeItem}>
              <MaterialIcons name="event" size={20} color="#9ca3af" style={{ marginRight: 8 }} />
              <Text style={styles.dateTimeText}>
                {isDefaultDate(item.date) ? 'TBD' : new Date(item.date).toLocaleDateString()}
              </Text>
            </View>
            <View style={styles.dateTimeItem}>
              <MaterialIcons name="access-time" size={20} color="#9ca3af" style={{ marginRight: 8 }} />
              <Text style={styles.dateTimeText}>{item.time || 'Preferred time'}</Text>
            </View>
          </View>
          {item.location && (
            <View style={styles.locationRow}>
              <MaterialIcons name="location-on" size={20} color="#9ca3af" style={{ marginRight: 8 }} />
              <Text style={styles.locationText} numberOfLines={1} ellipsizeMode="tail">{item.location}</Text>
            </View>
          )}
          {item.notes && (
            <Text style={styles.notesText} numberOfLines={2} ellipsizeMode="tail">{item.notes}</Text>
          )}
          <View style={styles.actions}>
            <TouchableOpacity style={styles.actionButton} onPress={() => Alert.alert('Chat', 'Chat functionality coming soon!')}>
              <MaterialIcons name="chat-bubble" size={20} color="#2563eb" style={{ marginRight: 6 }} />
              <Text style={styles.actionButtonText}>Chat</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={() => Alert.alert('Call', 'Call functionality coming soon!')}>
              <MaterialIcons name="call" size={20} color="#2563eb" style={{ marginRight: 6 }} />
              <Text style={styles.actionButtonText}>Call</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={() => Alert.alert('Video', 'Video functionality coming soon!')}>
              <MaterialIcons name="videocam" size={20} color="#2563eb" style={{ marginRight: 6 }} />
              <Text style={styles.actionButtonText}>Video</Text>
            </TouchableOpacity>
            {isPending && (
              <TouchableOpacity style={styles.actionButton} onPress={() => openEditModal(item)}>
                <MaterialIcons name="edit" size={20} color="#2563eb" style={{ marginRight: 6 }} />
                <Text style={styles.actionButtonText}>Edit</Text>
              </TouchableOpacity>
            )}
            {isPending && (
              <TouchableOpacity style={styles.actionButton} onPress={() => handleCancel(item)}>
                <MaterialIcons name="cancel" size={20} color="#ef4444" style={{ marginRight: 6 }} />
                <Text style={styles.actionButtonText}>Cancel</Text>
              </TouchableOpacity>
            )}
            {isAccepted && !isCancelled && canReschedule(item.date, item.time) && (
              <TouchableOpacity style={styles.actionButton} onPress={() => openRescheduleModal(item)}>
                <MaterialIcons name="schedule" size={20} color="#eab308" style={{ marginRight: 6 }} />
                <Text style={styles.actionButtonText}>Reschedule</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f8fafc', paddingHorizontal: 8 * sizeScale, paddingTop: 12 * sizeScale }}>
      {/* Back Button */}
      <TouchableOpacity onPress={() => {
        if (navigation.canGoBack()) {
          router.back();
        } else {
          router.replace('/(tabs)/home');
        }
      }} style={{ marginBottom: 12, alignSelf: 'flex-start' }}>
        <MaterialIcons name="arrow-back" size={28} color="#2563eb" />
      </TouchableOpacity>
      <Text style={{ fontSize: 26 * sizeScale, fontWeight: 'bold', color: '#2563eb', marginBottom: 8 * sizeScale }}>Appointments</Text>
      {/* Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 10 * sizeScale }} contentContainerStyle={{ flexDirection: 'row' }}>
        {TABS.map(tab => (
          <TabButton key={tab.key} icon={tab.icon} label={tab.label} active={activeTab === tab.key} onPress={() => setActiveTab(tab.key)} />
        ))}
      </ScrollView>
      {/* Search bar */}
      <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 10, paddingHorizontal: 10, marginBottom: 10 * sizeScale, borderWidth: 1, borderColor: '#e5e7eb' }}>
        <MaterialIcons name="search" size={20} color="#64748b" style={{ marginRight: 6 }} />
        <TextInput
          style={{ flex: 1, fontSize: 15 * sizeScale, paddingVertical: 8 }}
          placeholder="Search by doctor, type, or location"
          value={search}
          onChangeText={setSearch}
          placeholderTextColor="#9ca3af"
        />
      </View>
      {/* List */}
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
          <Text style={{ fontSize: 17, color: '#64748b', marginBottom: 8 }}>No appointments found</Text>
          <TouchableOpacity
            style={{ backgroundColor: '#2563eb', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 24, marginTop: 8 }}
            onPress={() => setModalVisible(true)}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>New Appointment</Text>
          </TouchableOpacity>
        </View>
      )}
      {!loading && filtered.length > 0 && (
        <FlatList
          data={filtered}
          keyExtractor={item => item._id?.toString() || item.id?.toString()}
          renderItem={renderAppointment}
          contentContainerStyle={{ paddingBottom: 24 }}
          ListFooterComponent={
            <TouchableOpacity
              style={{ backgroundColor: '#2563eb', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 24, alignSelf: 'center', marginTop: 12 }}
              onPress={() => setModalVisible(true)}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>New Appointment</Text>
            </TouchableOpacity>
          }
        />
      )}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editId ? 'Edit Appointment' : 'Schedule New Appointment'}</Text>
            <View style={styles.modalFormGroup}>
              <Text style={styles.modalLabel}>Appointment Type <Text style={styles.modalRequired}>*</Text></Text>
              <View style={styles.modalInputGroup}>
                <Picker
                  selectedValue={type}
                  onValueChange={setType}
                  style={{ color: type ? '#111' : '#9ca3af' }}
                >
                  <Picker.Item label="Select type" value="" />
                  {APPOINTMENT_TYPES.map((t) => (
                    <Picker.Item key={t} label={t} value={t} />
                  ))}
                </Picker>
              </View>
            </View>
            {/* Date field removed: patient cannot choose date */}
            {/* <TouchableOpacity className="mb-4 w-full" onPress={() => setShowDatePicker(true)}>
              <Text className="mb-1 text-sm font-medium">Date <Text className="text-red-500">*</Text></Text>
              <View className="p-4 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600">
                <Text className={date ? 'text-gray-900 dark:text-white' : 'text-gray-400'}>{date || 'Select date'}</Text>
              </View>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={date && !isNaN(new Date(date)) ? new Date(date) : new Date()}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleDateChange}
                minimumDate={new Date()}
              />
            )} */}
            <TouchableOpacity style={styles.modalInputGroup} onPress={() => setShowTimePicker(true)}>
              <Text style={styles.modalLabel}>Time <Text style={styles.modalRequired}>*</Text></Text>
              <View style={styles.modalInputGroup}>
                <Text style={time ? styles.modalInputText : styles.modalInputPlaceholder}>{time || 'Select time'}</Text>
              </View>
            </TouchableOpacity>
            {showTimePicker && (
              <DateTimePicker
                value={time ? new Date(`1970-01-01T${time}:00`) : new Date()}
                mode="time"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleTimeChange}
                is24Hour={true}
              />
            )}
            <TextInput
              style={styles.modalInputGroup}
              placeholder="Location *"
              value={location}
              onChangeText={setLocation}
              placeholderTextColor="#9ca3af"
            />
            <TextInput
              style={styles.modalInputGroup}
              placeholder="Notes (optional)"
              value={notes}
              onChangeText={setNotes}
              placeholderTextColor="#9ca3af"
              multiline
            />
            {formError ? <Text style={styles.formError}>{formError}</Text> : null}
            {success && <Text style={styles.successMessage}>Appointment {editId ? 'updated' : 'scheduled'}!</Text>}
            <View style={styles.modalDivider} />
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalActionButton} onPress={handleBook}>
                <Text style={styles.modalActionButtonText}>{editId ? 'Save' : 'Schedule'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalCancelButton} onPress={() => { setModalVisible(false); setEditId(null); }}>
                <Text style={styles.modalCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  appointmentCard: {
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
    borderLeftWidth: 4,
    borderLeftColor: '#e5e7eb',
  },
  appointmentContent: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  appointmentType: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2563eb',
    flex: 1,
    marginRight: 8,
  },
  doctorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: 'semibold',
    color: '#374151',
    marginLeft: 12,
  },
  dateTimeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  dateTimeItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateTimeText: {
    fontSize: 14,
    color: '#6b7280',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationText: {
    fontSize: 14,
    color: '#6b7280',
    flex: 1,
  },
  notesText: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  actionButtonText: {
    fontSize: 13,
    color: '#2563eb',
    fontWeight: 'bold',
    marginLeft: 6,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
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
  modalFormGroup: {
    width: '100%',
    marginBottom: 16,
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: 'medium',
    color: '#4b5563',
    marginBottom: 8,
  },
  modalInputGroup: {
    width: '100%',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  modalInputText: {
    fontSize: 15,
    color: '#111',
  },
  modalInputPlaceholder: {
    fontSize: 15,
    color: '#9ca3af',
  },
  modalRequired: {
    color: '#ef4444',
  },
  modalDivider: {
    width: '100%',
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 16,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalActionButton: {
    flex: 1,
    backgroundColor: '#2563eb',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginRight: 10,
  },
  modalActionButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  modalCancelButton: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginLeft: 10,
  },
  modalCancelButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  formError: {
    color: '#ef4444',
    fontSize: 13,
    marginTop: 4,
    marginBottom: 8,
  },
  successMessage: {
    color: '#4ade80',
    fontSize: 13,
    marginTop: 4,
    marginBottom: 8,
  },
  tabBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 7,
    marginRight: 8,
  },
  tabBtnActive: {
    backgroundColor: '#e0e7ff',
    borderColor: '#2563eb',
    borderWidth: 1,
  },
  tabBtnLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 6,
  },
}); 