import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Modal, TextInput, TouchableOpacity, ActivityIndicator, Image, Alert, Platform } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAppointments } from '../../../features/appointments/appointmentsSlice';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { MaterialIcons } from '@expo/vector-icons';

const APPOINTMENT_TYPES = [
  'Check-up',
  'Follow-up',
  'Consultation',
  'Emergency',
];

// Utility to format date
const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
};
const formatTime = (timeStr) => timeStr || '';

// Status badge component
const StatusBadge = ({ status }) => {
  let color = 'bg-yellow-100 text-yellow-800';
  if (status === 'confirmed' || status === 'accepted' || status === 'scheduled') color = 'bg-blue-100 text-blue-800';
  if (status === 'cancelled' || status === 'rejected') color = 'bg-red-100 text-red-800';
  if (status === 'completed') color = 'bg-green-100 text-green-800';
  return (
    <View className={`px-2 py-0.5 rounded-full ${color} ml-2`}>
      <Text className="text-xs font-semibold capitalize">{status || 'pending'}</Text>
    </View>
  );
};

// Avatar component
const DoctorAvatar = ({ doctor }) => {
  const uri = doctor?.user?.profileImage;
  const initials = doctor?.user ? `${doctor.user.firstName?.[0] || ''}${doctor.user.lastName?.[0] || ''}`.toUpperCase() : 'D';
  if (uri) {
    return <Image source={{ uri }} className="w-12 h-12 rounded-full mr-4 bg-gray-200" />;
  }
  return (
    <View className="w-12 h-12 rounded-full bg-gray-200 mr-4 items-center justify-center">
      <Text className="text-lg text-gray-500 font-bold">{initials}</Text>
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
  if (status === 'pending') return 'border-yellow-400';
  if (status === 'accepted' || status === 'confirmed' || status === 'scheduled') return 'border-blue-400';
  if (status === 'completed') return 'border-green-400';
  if (status === 'cancelled' || status === 'rejected') return 'border-red-400';
  return 'border-gray-200';
};

// Helper to check if date is the default '1-1-1111'
const isDefaultDate = (date) => {
  if (!date) return true;
  const d = new Date(date);
  return d.getFullYear() === 1111 && d.getMonth() === 0 && d.getDate() === 1;
};

// Helper to check if appointment is more than 24 hours in the future
const canReschedule = (date, time) => {
  if (!date || isDefaultDate(date)) return false;
  try {
    // Combine date and time if both exist
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

export default function AppointmentsScreen() {
  const dispatch = useDispatch();
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
  const [appointments, setAppointments] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    dispatch(fetchAppointments());
  }, [dispatch]);

  useEffect(() => {
    if (list) setAppointments(list);
  }, [list]);

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
      setAppointments((prev) => prev.map((apt) =>
        (apt._id === editId || apt.id === editId)
          ? { ...apt, type, date, time, location, notes, status: apt.status === 'pending' ? 'pending' : 'rescheduled' }
          : apt
      ));
    } else {
      // New appointment: always pending
      setAppointments((prev) => [
        ...prev,
        {
          id: Date.now(),
          type,
          date: date || '1111-01-01T00:00:00.000Z',
          time,
          location,
          notes,
          status: 'pending',
          doctor: { user: { firstName: 'John', lastName: 'Doe' } },
        },
      ]);
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
          onPress: () => setAppointments((prev) => prev.map((apt) =>
            (apt._id === item._id || apt.id === item.id)
              ? { ...apt, status: 'cancelled' }
              : apt
          )),
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
      <View className={`flex-row bg-white dark:bg-gray-800 rounded-2xl p-4 mb-5 shadow-xl border-l-4 ${statusAccent(item.status)} border border-gray-100 dark:border-gray-700`}> 
        <View className="flex-1">
          <View className="flex-row justify-between items-start mb-2">
            <Text className="text-xl font-extrabold text-blue-700 dark:text-blue-400 max-w-[60%]" numberOfLines={1} ellipsizeMode="tail">{item.type || 'Appointment'}</Text>
            <StatusBadge status={item.status} />
          </View>
          <View className="flex-row items-center mb-2">
            <MaterialIcons name="person" size={22} color="#2563eb" style={{ marginRight: 8 }} />
            <Text className="text-base font-semibold text-gray-700 dark:text-gray-200" numberOfLines={1} ellipsizeMode="tail">{getDoctorName(item)}</Text>
          </View>
          <View className="flex-row items-center mb-2">
            <MaterialIcons name="event" size={20} color="#9ca3af" style={{ marginRight: 8 }} />
            <Text className="text-base text-gray-500 dark:text-gray-400">
              {isDefaultDate(item.date) ? 'TBD' : new Date(item.date).toLocaleDateString()}
            </Text>
          </View>
          <View className="flex-row items-center mb-2">
            <MaterialIcons name="access-time" size={20} color="#9ca3af" style={{ marginRight: 8 }} />
            <Text className="text-base text-gray-500 dark:text-gray-400">{item.time || 'Preferred time'}</Text>
          </View>
          {item.location && (
            <View className="flex-row items-center mb-2">
              <MaterialIcons name="location-on" size={20} color="#9ca3af" style={{ marginRight: 8 }} />
              <Text className="text-base text-gray-500 dark:text-gray-400" numberOfLines={1} ellipsizeMode="tail">{item.location}</Text>
            </View>
          )}
          {item.notes && (
            <Text className="text-xs text-gray-400 italic mb-1" numberOfLines={2} ellipsizeMode="tail">{item.notes}</Text>
          )}
          <View className="flex-row gap-2 mt-3 flex-wrap">
            <TouchableOpacity className="flex-row items-center px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-700 mb-2 active:bg-blue-100" onPress={() => Alert.alert('Chat', 'Chat functionality coming soon!')}>
              <MaterialIcons name="chat-bubble" size={20} color="#2563eb" style={{ marginRight: 6 }} />
              <Text className="text-xs text-blue-700 dark:text-blue-300 font-semibold">Chat</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-row items-center px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-700 mb-2 active:bg-blue-100" onPress={() => Alert.alert('Call', 'Call functionality coming soon!')}>
              <MaterialIcons name="call" size={20} color="#2563eb" style={{ marginRight: 6 }} />
              <Text className="text-xs text-blue-700 dark:text-blue-300 font-semibold">Call</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-row items-center px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-700 mb-2 active:bg-blue-100" onPress={() => Alert.alert('Video', 'Video functionality coming soon!')}>
              <MaterialIcons name="videocam" size={20} color="#2563eb" style={{ marginRight: 6 }} />
              <Text className="text-xs text-blue-700 dark:text-blue-300 font-semibold">Video</Text>
            </TouchableOpacity>
            {isPending && (
              <TouchableOpacity className="flex-row items-center px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/30 mb-2 active:bg-blue-200" onPress={() => openEditModal(item)}>
                <MaterialIcons name="edit" size={20} color="#2563eb" style={{ marginRight: 6 }} />
                <Text className="text-xs text-blue-700 dark:text-blue-300 font-semibold">Edit</Text>
              </TouchableOpacity>
            )}
            {isPending && (
              <TouchableOpacity className="flex-row items-center px-4 py-2 rounded-full bg-red-50 dark:bg-red-900/30 mb-2 active:bg-red-200" onPress={() => handleCancel(item)}>
                <MaterialIcons name="cancel" size={20} color="#ef4444" style={{ marginRight: 6 }} />
                <Text className="text-xs text-red-700 dark:text-red-300 font-semibold">Cancel</Text>
              </TouchableOpacity>
            )}
            {isAccepted && !isCancelled && canReschedule(item.date, item.time) && (
              <TouchableOpacity className="flex-row items-center px-4 py-2 rounded-full bg-yellow-50 dark:bg-yellow-900/30 mb-2 active:bg-yellow-200" onPress={() => openRescheduleModal(item)}>
                <MaterialIcons name="schedule" size={20} color="#eab308" style={{ marginRight: 6 }} />
                <Text className="text-xs text-yellow-800 dark:text-yellow-300 font-semibold">Reschedule</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900 px-4 pt-6">
      <Text className="text-3xl font-extrabold mb-4 text-blue-700 dark:text-blue-400">Appointments</Text>
      {loading && (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#2563eb" />
        </View>
      )}
      {error && (
        <View className="flex-row items-center bg-red-100 dark:bg-red-900 rounded-lg p-3 mb-4">
          <Text className="text-lg mr-2">❌</Text>
          <Text className="text-red-700 dark:text-red-300">{error}</Text>
        </View>
      )}
      {!loading && (!appointments || appointments.length === 0) && (
        <View className="flex-1 justify-center items-center mt-16">
          <MaterialIcons name="event-busy" size={64} color="#9ca3af" style={{ marginBottom: 16 }} />
          <Text className="text-xl text-gray-400 mb-2 font-semibold">No appointments scheduled</Text>
          <TouchableOpacity
            className="bg-blue-600 dark:bg-blue-500 px-8 py-4 rounded-full mt-4 shadow-lg active:bg-blue-700"
            onPress={() => setModalVisible(true)}
          >
            <Text className="text-white text-lg font-bold">New Appointment</Text>
          </TouchableOpacity>
        </View>
      )}
      {!loading && appointments && appointments.length > 0 && (
        <FlatList
          data={appointments}
          keyExtractor={item => item._id?.toString() || item.id?.toString()}
          renderItem={renderAppointment}
          contentContainerStyle={{ paddingBottom: 24 }}
          ListFooterComponent={
            <TouchableOpacity
              className="bg-blue-600 dark:bg-blue-500 px-6 py-3 rounded-full mt-4 shadow self-center"
              onPress={() => setModalVisible(true)}
            >
              <Text className="text-white text-lg font-semibold">New Appointment</Text>
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
        <View className="flex-1 justify-center items-center bg-black/40">
          <View className="w-full max-w-md bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl items-center border border-blue-100 dark:border-blue-900">
            <Text className="text-2xl font-extrabold mb-6 text-blue-700 dark:text-blue-400">{editId ? 'Edit Appointment' : 'Schedule New Appointment'}</Text>
            <View className="w-full mb-4">
              <Text className="mb-1 text-sm font-medium">Appointment Type <Text className="text-red-500">*</Text></Text>
              <View className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg">
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
            <TouchableOpacity className="mb-4 w-full" onPress={() => setShowTimePicker(true)}>
              <Text className="mb-1 text-sm font-medium">Time <Text className="text-red-500">*</Text></Text>
              <View className="p-4 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600">
                <Text className={time ? 'text-gray-900 dark:text-white' : 'text-gray-400'}>{time || 'Select time'}</Text>
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
              className="mb-4 p-4 text-base rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 w-full"
              placeholder="Location *"
              value={location}
              onChangeText={setLocation}
              placeholderTextColor="#9ca3af"
            />
            <TextInput
              className="mb-4 p-4 text-base rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 w-full"
              placeholder="Notes (optional)"
              value={notes}
              onChangeText={setNotes}
              placeholderTextColor="#9ca3af"
              multiline
            />
            {formError ? <Text className="text-red-500 mb-2">{formError}</Text> : null}
            {success && <Text className="text-green-600 mb-2">Appointment {editId ? 'updated' : 'scheduled'}!</Text>}
            <View className="h-px w-full bg-gray-200 dark:bg-gray-700 my-4" />
            <View className="flex-row justify-between w-full mt-2">
              <TouchableOpacity className="flex-1 mr-2 bg-blue-600 rounded-xl p-4 active:bg-blue-700" onPress={handleBook}>
                <Text className="text-white text-center font-bold text-lg">{editId ? 'Save' : 'Schedule'}</Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-1 ml-2 bg-gray-400 rounded-xl p-4 active:bg-gray-500" onPress={() => { setModalVisible(false); setEditId(null); }}>
                <Text className="text-white text-center font-bold text-lg">Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
} 