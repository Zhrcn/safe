import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Modal,
  ScrollView,
  Alert,
  Animated,
  Easing,
  Pressable,
  Platform,
  SafeAreaView,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchMedications,
  removeMedication,
  requestRefill,
} from '../../../features/medications/medicationsSlice';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useRouter, useNavigation } from 'expo-router';
import 'nativewind';

// --- UI Constants ---
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

// --- Utility Functions ---
function getStatusColor(status) {
  switch ((status || '').toLowerCase()) {
    case 'active':
      return '#22c55e';
    case 'completed':
      return '#2563eb';
    case 'expired':
      return '#ef4444';
    default:
      return '#64748b';
  }
}

function getInitials(name) {
  if (!name) return '';
  const parts = name.split(' ');
  if (parts.length === 1) return parts[0][0];
  return parts[0][0] + parts[1][0];
}

// --- Snackbar Component ---
function Snackbar({ visible, message, onDismiss }) {
  if (!visible) return null;
  return (
    <View className="absolute left-4 right-4 bottom-10 bg-gray-900 rounded-xl px-6 py-4 flex-row items-center justify-between shadow-lg z-200">
      <Text className="text-white text-base font-semibold tracking-tight">{message}</Text>
      <TouchableOpacity onPress={onDismiss} accessibilityLabel="Dismiss notification">
        <MaterialCommunityIcons name="close" size={20} color="white" />
      </TouchableOpacity>
    </View>
  );
}

// --- Medication Details Modal ---
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
      <View className="absolute left-0 right-0 bottom-0 bg-white rounded-t-2xl border-t border-gray-200 shadow-xl shadow-blue-500/20">
        <View className="items-center mb-3">
          <View className="w-14 h-1.5 rounded-full bg-gray-200 self-center" />
        </View>
        <Text className="text-blue-700 font-bold text-2xl text-center mb-2">{medication.name}</Text>
        <Text className="text-blue-600 text-base text-center mb-4">{medication.dosage} - {medication.frequency}</Text>
        {medication.prescribedBy && (
          <Text className="text-gray-500 text-sm text-center mb-2">
            <MaterialCommunityIcons name="hospital" size={16} color="#2563eb" />{' '}
            {medication.prescribedBy.firstName} {medication.prescribedBy.lastName}
          </Text>
        )}
        {medication.refillDate && (
          <Text className="text-gray-500 text-sm text-center mb-2">
            <MaterialCommunityIcons name="calendar" size={16} color="#2563eb" />{' '}
            Next refill: {new Date(medication.refillDate).toLocaleDateString()}
          </Text>
        )}
        {medication.notes && (
          <View className="bg-yellow-100 border border-yellow-300 rounded-lg p-3 mb-2">
            <MaterialCommunityIcons name="alert-circle" size={16} color="#f59e42" />
            <Text className="text-yellow-800 text-sm ml-2">{medication.notes}</Text>
          </View>
        )}
        <TouchableOpacity
          className="bg-blue-600 rounded-lg px-8 py-3 shadow-md"
          onPress={onClose}
          accessibilityLabel="Close details"
        >
          <Text className="text-white font-bold text-base">Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

// --- Medication Card ---
function MedicationCard({
  medication,
  onEdit,
  onDelete,
  onSetReminder,
  onRefill,
  onViewDetails,
  index,
}) {
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
    <Animated.View
      style={[
        styles.card,
        {
          opacity: fadeAnim,
          transform: [
            {
              translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              }),
            },
          ],
        },
      ]}
    >
      <View className="flex-row items-center mb-2">
        <View
          className={`w-3 h-3 rounded-full mr-2 ${getStatusColor(medication.status)}`}
        />
        <Text className="text-blue-700 font-bold text-lg flex-1" numberOfLines={1} ellipsizeMode="tail">{medication.name}</Text>
        <TouchableOpacity
          className="w-8 h-8 rounded-lg bg-blue-100 items-center justify-center"
          onPress={() => onViewDetails(medication)}
          accessibilityLabel="View details"
        >
          <MaterialCommunityIcons name="eye" size={20} color="#2563eb" />
        </TouchableOpacity>
      </View>
      <Text className="text-blue-600 text-base font-semibold mb-1">{medication.dosage} - {medication.frequency}</Text>
      <View className="flex-row items-center mb-2">
        {medication.prescribedBy && (
          <View className="mr-2">
            <View className="w-7 h-7 rounded-lg bg-blue-100 items-center justify-center">
              <Text className="text-blue-700 font-bold text-sm">{getInitials(
                `${medication.prescribedBy.firstName} ${medication.prescribedBy.lastName}`
              )}</Text>
            </View>
          </View>
        )}
        {medication.prescribedBy && (
          <Text className="text-gray-500 text-sm mr-2" numberOfLines={1} ellipsizeMode="tail">
            <MaterialCommunityIcons name="hospital" size={15} color="#2563eb" />{' '}
            {medication.prescribedBy.firstName} {medication.prescribedBy.lastName}
          </Text>
        )}
        {medication.refillDate && (
          <Text className="text-gray-500 text-sm">
            <MaterialCommunityIcons name="calendar" size={15} color="#2563eb" />{' '}
            {new Date(medication.refillDate).toLocaleDateString()}
          </Text>
        )}
      </View>
      {medication.notes ? (
        <View className="bg-yellow-100 border border-yellow-300 rounded-lg p-3 mb-2">
          <MaterialCommunityIcons name="alert-circle" size={15} color="#f59e42" />
          <Text className="text-yellow-800 text-sm ml-2" numberOfLines={2} ellipsizeMode="tail">{medication.notes}</Text>
        </View>
      ) : null}
      <View className="flex-row mt-3">
        <TouchableOpacity
          className="w-10 h-10 rounded-lg bg-blue-600 items-center justify-center mr-2 shadow-md"
          onPress={() => onEdit(medication)}
          accessibilityLabel="Edit medication"
        >
          <MaterialCommunityIcons name="pencil" size={18} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          className={`w-10 h-10 rounded-lg items-center justify-center mr-2 ${medication.remindersEnabled ? 'bg-gray-400' : 'bg-green-600'}`}
          onPress={() => onSetReminder(medication)}
          accessibilityLabel={
            medication.remindersEnabled ? 'Disable reminder' : 'Enable reminder'
          }
        >
          <MaterialCommunityIcons
            name={medication.remindersEnabled ? 'bell-off' : 'bell-ring'}
            size={18}
            color="white"
          />
        </TouchableOpacity>
        <TouchableOpacity
          className="w-10 h-10 rounded-lg bg-green-600 items-center justify-center mr-2 shadow-md"
          onPress={() => onRefill(medication)}
          accessibilityLabel="Request refill"
        >
          <MaterialCommunityIcons name="refresh" size={18} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          className="w-10 h-10 rounded-lg bg-red-600 items-center justify-center shadow-md"
          onPress={() => onDelete(medication._id)}
          accessibilityLabel="Delete medication"
        >
          <MaterialCommunityIcons name="trash-can" size={18} color="white" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

// --- Main Screen ---
export default function MedicationsScreen() {
  const dispatch = useDispatch();
  const router = useRouter();
  const navigation = useNavigation();
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
    return (items || []).filter((med) => {
      const matchesSearch = (med.name || '')
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === 'all' ||
        (med.status || '').toLowerCase() === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [items, search, statusFilter]);

  // --- Handlers ---
  const handleEdit = (med) => {
    setEditMedication(med);
    setShowAddEdit(true);
  };
  const handleDelete = (id) => {
    Alert.alert('Delete Medication', 'Are you sure you want to delete this medication?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          dispatch(removeMedication(id));
          setSnackbar({ visible: true, message: 'Medication deleted.' });
        },
      },
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

  // --- UI ---
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="flex-row items-center justify-between pt-7 pb-2 px-4 bg-white border-b border-gray-200 shadow-sm">
        <TouchableOpacity
          onPress={() => {
            if (navigation.canGoBack()) {
              router.back();
            } else {
              router.replace('/(tabs)/home');
            }
          }}
          className="w-9 h-9 rounded-full bg-blue-100 items-center justify-center shadow"
          accessibilityLabel="Back"
        >
          <MaterialIcons name="arrow-back" size={28} color="#2563eb" />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-blue-700 font-bold text-xl tracking-tight">Medications</Text>
        <View className="w-9" />
      </View>

      {/* Tabs */}
      <View className="flex-row justify-center items-center mt-2 mb-2 space-x-2">
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            className={`flex-row items-center px-4 py-2 rounded-full ${activeTab === tab.key ? 'bg-blue-600 shadow-lg' : 'bg-blue-50'} min-w-[100px] h-9`}
            onPress={() => setActiveTab(tab.key)}
            accessibilityRole="tab"
            accessibilityState={{ selected: activeTab === tab.key }}
            activeOpacity={0.85}
          >
            <MaterialCommunityIcons
              name={tab.icon}
              size={18}
              color={activeTab === tab.key ? '#fff' : '#2563eb'}
              className="mr-1"
            />
            <Text className={`text-base font-semibold ${activeTab === tab.key ? 'text-white' : 'text-blue-700'}`}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Search and Filter */}
      <View className="flex-row items-center bg-white rounded-xl px-4 py-3 mx-4 mb-2 shadow border border-gray-200">
        <MaterialCommunityIcons name="magnify" size={22} color="#9ca3af" className="mr-2" />
        <TextInput
          placeholder="Search medications..."
          value={search}
          onChangeText={setSearch}
          className="flex-1 text-base text-gray-900 bg-transparent font-medium"
          placeholderTextColor="#9ca3af"
          returnKeyType="search"
          clearButtonMode="while-editing"
          accessibilityLabel="Search medications"
        />
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="flex-row mb-2 mt-1 min-h-[36px] px-1"
        contentContainerStyle={{ alignItems: 'center' }}
      >
        {STATUS_OPTIONS.map((opt) => (
          <TouchableOpacity
            key={opt.key}
            className={`px-4 h-8 rounded-full border mr-2 items-center justify-center ${statusFilter === opt.key ? '' : 'bg-gray-100 border-gray-200'} ${statusFilter === opt.key ? 'bg-blue-600 border-blue-600' : ''}`}
            onPress={() => setStatusFilter(opt.key)}
            accessibilityRole="button"
            accessibilityState={{ selected: statusFilter === opt.key }}
            activeOpacity={0.85}
          >
            <Text className={`text-sm font-semibold ${statusFilter === opt.key ? 'text-white' : 'text-gray-700'}`}>{opt.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Main Content */}
      <View className="flex-1">
        {activeTab === 'medications' && (
          loading ? (
            <View className="flex-1 items-center justify-center py-8">
              <ActivityIndicator size="large" color="#2563eb" />
              <Text className="text-blue-700 font-bold text-base mt-3">Loading medications...</Text>
            </View>
          ) : error ? (
            <View className="flex-1 items-center justify-center py-8">
              <MaterialCommunityIcons name="alert-circle" size={48} color="#ef4444" />
              <Text className="text-red-500 font-bold text-lg mt-3 text-center">{error}</Text>
            </View>
          ) : (
            <FlatList
              contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
              data={filteredMedications}
              keyExtractor={(item) => item._id?.toString()}
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
              ListEmptyComponent={
                <View className="items-center mt-12">
                  <MaterialCommunityIcons name="emoticon-sad-outline" size={48} color="#9ca3af" />
                  <Text className="text-lg font-bold text-gray-400 mt-2 mb-2">No medications found.</Text>
                  <Text className="text-blue-600 font-bold">Try adjusting your search.</Text>
                </View>
              }
              accessibilityLabel="Medications list"
            />
          )
        )}
        {activeTab === 'reminders' && (
          <View className="flex-1 items-center justify-center px-6 pt-12">
            <MaterialCommunityIcons name="bell-ring" size={32} color="#2563eb" className="mb-2" />
            <Text className="font-bold text-xl text-blue-700 mb-2">Reminders</Text>
            <Text className="text-blue-600 font-bold text-base opacity-85 text-center">Reminders feature coming soon!</Text>
          </View>
        )}
        {activeTab === 'availability' && (
          <View className="flex-1 items-center justify-center px-6 pt-12">
            <MaterialCommunityIcons name="magnify" size={32} color="#2563eb" className="mb-2" />
            <Text className="font-bold text-xl text-blue-700 mb-2">Availability</Text>
            <Text className="text-blue-600 font-bold text-base opacity-85 text-center">Availability feature coming soon!</Text>
          </View>
        )}
      </View>

      {/* FAB */}
      {activeTab === 'medications' && (
        <TouchableOpacity
          className="absolute right-7 bottom-9 bg-blue-600 w-16 h-16 rounded-full items-center justify-center shadow-lg z-50"
          onPress={() => setShowAddEdit(true)}
          accessibilityLabel="Add medication"
          accessibilityRole="button"
          activeOpacity={0.85}
        >
          <MaterialCommunityIcons name="plus" size={32} color="white" />
        </TouchableOpacity>
      )}

      {/* Modals & Snackbar */}
      <MedicationDetailsModal
        visible={showDetails}
        medication={detailsMedication}
        onClose={() => setShowDetails(false)}
      />
      <Snackbar
        visible={snackbar.visible}
        message={snackbar.message}
        onDismiss={handleSnackbarDismiss}
      />
    </SafeAreaView>
  );
}

// --- Styles ---
const styles = {
  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000055',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    marginBottom: 18,
    padding: 18,
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.13,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#e0e7ef',
  },
};