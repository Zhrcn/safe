import React, { useEffect, useState, useMemo, useRef } from 'react';
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

const getStatusColor = (status) => {
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
};

const getInitials = (name) => {
  if (!name) return '';
  const parts = name.split(' ');
  if (parts.length === 1) return parts[0][0];
  return parts[0][0] + parts[1][0];
};

const Snackbar = ({ visible, message, onDismiss }) => {
  if (!visible) return null;
  return (
    <View className="absolute left-4 right-4 bottom-10 bg-gray-900 rounded-xl px-6 py-4 flex-row items-center justify-between shadow-lg z-200">
      <Text className="text-white text-base font-semibold tracking-tight">{message}</Text>
      <TouchableOpacity onPress={onDismiss} accessibilityLabel="Dismiss notification">
        <MaterialCommunityIcons name="close" size={20} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const MedicationDetailsModal = ({ visible, medication, onClose }) => {
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
          <View className="bg-yellow-100 border border-yellow-300 rounded-lg p-3 mb-2 flex-row items-center">
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
};

const MedicationCard = ({
  medication,
  onEdit,
  onDelete,
  onSetReminder,
  onRefill,
  onViewDetails,
  index,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
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
      <View className="flex-row items-center mb-1">
        <View
          style={{
            width: 8,
            height: 8,
            borderRadius: 9999,
            marginRight: 8,
            backgroundColor: getStatusColor(medication.status),
          }}
        />
        <Text className="text-blue-700 font-bold text-lg flex-1" numberOfLines={1} ellipsizeMode="tail">{medication.name}</Text>
        <TouchableOpacity
          className="w-7 h-7 rounded-lg bg-blue-100 items-center justify-center"
          onPress={() => onViewDetails(medication)}
          accessibilityLabel="View details"
        >
          <MaterialCommunityIcons name="eye" size={16} color="#2563eb" />
        </TouchableOpacity>
      </View>
      <Text className="text-blue-600 text-base font-semibold mb-2">{medication.dosage} - {medication.frequency}</Text>
      <View className="flex-row items-center mb-2">
        {medication.prescribedBy && (
          <View className="flex-row items-center mr-3">
            <View className="w-6 h-6 rounded-lg bg-blue-100 items-center justify-center mr-1">
              <Text className="text-blue-700 font-bold text-xs">{getInitials(
                `${medication.prescribedBy.firstName} ${medication.prescribedBy.lastName}`
              )}</Text>
            </View>
            <Text className="text-gray-500 text-xs" numberOfLines={1} ellipsizeMode="tail">
              <MaterialCommunityIcons name="hospital" size={12} color="#2563eb" />{' '}
              {medication.prescribedBy.firstName} {medication.prescribedBy.lastName}
            </Text>
          </View>
        )}
        {medication.refillDate && (
          <View className="flex-row items-center">
            <MaterialCommunityIcons name="calendar" size={12} color="#2563eb" />
            <Text className="text-gray-500 text-xs ml-1">
              {new Date(medication.refillDate).toLocaleDateString()}
            </Text>
          </View>
        )}
      </View>
      {medication.notes ? (
        <View className="bg-yellow-100 border border-yellow-300 rounded-lg p-2 mb-3">
          <View className="flex-row items-start">
            <MaterialCommunityIcons name="alert-circle" size={14} color="#f59e42" style={{ marginTop: 1 }} />
            <Text className="text-yellow-800 text-xs ml-1 flex-1" numberOfLines={2} ellipsizeMode="tail">{medication.notes}</Text>
          </View>
        </View>
      ) : null}
      <View className="flex-row justify-end">
        <TouchableOpacity
          className="w-8 h-8 rounded-lg bg-blue-600 items-center justify-center mr-1 shadow-md"
          onPress={() => onEdit(medication)}
          accessibilityLabel="Edit medication"
        >
          <MaterialCommunityIcons name="pencil" size={14} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          className={`w-8 h-8 rounded-lg items-center justify-center mr-1 ${medication.remindersEnabled ? 'bg-gray-400' : 'bg-green-600'}`}
          onPress={() => onSetReminder(medication)}
          accessibilityLabel={
            medication.remindersEnabled ? 'Disable reminder' : 'Enable reminder'
          }
        >
          <MaterialCommunityIcons
            name={medication.remindersEnabled ? 'bell-off' : 'bell-ring'}
            size={14}
            color="white"
          />
        </TouchableOpacity>
        <TouchableOpacity
          className="w-8 h-8 rounded-lg bg-green-600 items-center justify-center mr-1 shadow-md"
          onPress={() => onRefill(medication)}
          accessibilityLabel="Request refill"
        >
          <MaterialCommunityIcons name="refresh" size={14} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          className="w-8 h-8 rounded-lg bg-red-600 items-center justify-center shadow-md"
          onPress={() => onDelete(medication._id)}
          accessibilityLabel="Delete medication"
        >
          <MaterialCommunityIcons name="trash-can" size={14} color="white" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};
  
const MedicationsScreen = () => {
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

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-row items-center justify-between pt-4 pb-1 px-4 bg-white border-b border-gray-200 shadow-sm">
        <TouchableOpacity
          onPress={() => {
            if (navigation.canGoBack()) {
              router.back();
            } else {
              router.replace('/(tabs)/home');
            }
          }}
          className="w-8 h-8 rounded-full bg-blue-100 items-center justify-center shadow"
          accessibilityLabel="Back"
        >
          <MaterialIcons name="arrow-back" size={24} color="#2563eb" />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-blue-700 font-bold text-xl tracking-tight">Medications</Text>
        <View className="w-8" />
      </View>

      <View className="flex-row justify-center items-center mt-1 mb-1 space-x-1">
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            className={`flex-row items-center px-3 py-1 rounded-full ${activeTab === tab.key ? 'bg-blue-600 shadow-lg' : 'bg-blue-50'} min-w-[90px] h-7`}
            onPress={() => setActiveTab(tab.key)}
            accessibilityRole="tab"
            accessibilityState={{ selected: activeTab === tab.key }}
            activeOpacity={0.85}
          >
            <MaterialCommunityIcons
              name={tab.icon}
              size={16}
              color={activeTab === tab.key ? '#fff' : '#2563eb'}
              className="mr-1"
            />
            <Text className={`text-sm font-semibold ${activeTab === tab.key ? 'text-white' : 'text-blue-700'}`}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View className="flex-row items-center bg-white rounded-lg px-3 py-2 mx-4 mb-1 shadow border border-gray-200">
        <MaterialCommunityIcons name="magnify" size={20} color="#9ca3af" className="mr-2" />
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
        className="flex-row mb-1 mt-1 min-h-[32px] px-1"
        contentContainerStyle={{ alignItems: 'center' }}
      >
        {STATUS_OPTIONS.map((opt) => (
          <TouchableOpacity
            key={opt.key}
            className={`px-3 h-7 rounded-full border mr-1 items-center justify-center ${statusFilter === opt.key ? '' : 'bg-gray-100 border-gray-200'} ${statusFilter === opt.key ? 'bg-blue-600 border-blue-600' : ''}`}
            onPress={() => setStatusFilter(opt.key)}
            accessibilityRole="button"
            accessibilityState={{ selected: statusFilter === opt.key }}
            activeOpacity={0.85}
          >
            <Text className={`text-xs font-semibold ${statusFilter === opt.key ? 'text-white' : 'text-gray-700'}`}>{opt.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

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
              contentContainerStyle={{ paddingHorizontal: 8, paddingTop: 4, paddingBottom: 32, flexGrow: 1 }}
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
                <View className="items-center mt-4">
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
};

export default MedicationsScreen;

const styles = {
  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000055',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 12,
    padding: 12,
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.13,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#e0e7ef',
  },
};