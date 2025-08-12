import React, { useEffect, useState } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProfile } from '../../../features/profile/profileSlice';
import { logout } from '../../../features/auth/authSlice';
import { useRouter, Stack } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import CustomHeader from '../../../components/ui/CustomHeader';
import CustomTabBar from '../../../components/ui/CustomTabBar';
import CustomDrawer from '../../../components/ui/CustomDrawer';

const InfoRow = ({ icon, label, value }) => (
  <View className="flex-row items-center mb-2">
    <MaterialIcons name={icon} size={20} color="#2563eb" style={{ marginRight: 8 }} />
    <Text className="text-base font-medium text-gray-700 dark:text-gray-200 mr-1">{label}:</Text>
    <Text className="text-base text-gray-500 dark:text-gray-300">{value || 'N/A'}</Text>
  </View>
);

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export default function ProfileScreen() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { data, loading, error } = useSelector((state) => state.profile);
  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState({});
  const [success, setSuccess] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  useEffect(() => {
    if (data) {
      setForm({
        name: `${data.user?.firstName || ''} ${data.user?.lastName || ''}`.trim(),
        email: data.user?.email || '',
        phone: data.user?.phoneNumber || '',
        address: data.user?.address || '',
        city: data.user?.city || '',
        state: data.user?.state || '',
        dob: data.user?.dateOfBirth || '',
        gender: data.user?.gender || '',
        bloodType: data.bloodType || '',
        education: data.user?.education || '',
        occupation: data.user?.occupation || '',
        maritalStatus: data.user?.maritalStatus || '',
        memberSince: data.user?.createdAt || '',
      });
    }
  }, [data]);

  const handleEdit = () => {
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setModalVisible(false);
    }, 1500);
  };

  const handleLogout = () => {
    dispatch(logout());
    router.replace('/auth/login');
  };

  const insurance = data?.insurance || data?.insuranceDetails || {};

  return (
    <View className="flex-1 bg-white dark:bg-gray-900">
      <CustomHeader onMenuPress={() => setDrawerOpen(true)} />
      <CustomDrawer visible={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <ScrollView className="flex-1 p-4">
        <View className="items-center mb-6">
          {data?.user?.profileImage ? (
            <Image
              source={data.user.profileImage.includes('/uploads') ? { uri: `http://192.168.1.100:5001${data.user.profileImage}` } : { uri: data.user.profileImage }}
              className="w-24 h-24 rounded-full mb-2 bg-gray-200"
            />
          ) : (
            <Image source={require('../../../assets/images/6872779a3ccff829030148a7-John_Smith.jpg')} className="w-24 h-24 rounded-full mb-2 bg-gray-200" />
          )}
          <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{form.name}</Text>
          <Text className="text-base text-gray-500 dark:text-gray-300 mb-1">{form.email}</Text>
          <View className="flex-row items-center mb-2">
            <Text className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full mr-2">Active</Text>
            <TouchableOpacity className="ml-2 px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700" onPress={() => setModalVisible(true)}>
              <Text className="text-xs text-blue-700 dark:text-blue-300">Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity className="ml-2 px-3 py-1 rounded-full bg-red-100 dark:bg-red-900/30" onPress={handleLogout}>
              <Text className="text-xs text-red-700 dark:text-red-300">Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
        {loading && <Text>Loading...</Text>}
        {error && <Text className="text-red-500">{error}</Text>}
        {data && (
          <>
            <View className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-4 mb-4 shadow">
              <Text className="text-lg font-bold text-blue-700 dark:text-blue-400 mb-2">Basic Information</Text>
              <InfoRow icon="person" label="Full Name" value={form.name} />
              <InfoRow icon="cake" label="Date of Birth" value={formatDate(form.dob)} />
              <InfoRow icon="wc" label="Gender" value={form.gender} />
              <InfoRow icon="bloodtype" label="Blood Type" value={form.bloodType} />
            </View>
            <View className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-4 mb-4 shadow">
              <Text className="text-lg font-bold text-blue-700 dark:text-blue-400 mb-2">Contact Information</Text>
              <InfoRow icon="email" label="Email" value={form.email} />
              <InfoRow icon="phone" label="Phone" value={form.phone} />
              <InfoRow icon="home" label="Address" value={form.address} />
              <InfoRow icon="location-city" label="City" value={form.city} />
              <InfoRow icon="business" label="State" value={form.state} />
              <InfoRow icon="calendar-today" label="Member Since" value={formatDate(form.memberSince)} />
            </View>
            <View className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-4 mb-4 shadow">
              <Text className="text-lg font-bold text-blue-700 dark:text-blue-400 mb-2">Additional Information</Text>
              <InfoRow icon="school" label="Education" value={form.education} />
              <InfoRow icon="work" label="Occupation" value={form.occupation} />
              <InfoRow icon="favorite" label="Marital Status" value={form.maritalStatus} />
            </View>
            <View className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-4 mb-4 shadow">
              <Text className="text-lg font-bold text-blue-700 dark:text-blue-400 mb-2">Insurance Information</Text>
              <InfoRow icon="local-hospital" label="Provider" value={insurance.provider} />
              <InfoRow icon="policy" label="Policy Number" value={insurance.policyNumber} />
              <InfoRow icon="group" label="Group Number" value={insurance.groupNumber} />
              <InfoRow icon="description" label="Coverage Type" value={insurance.coverageType} />
              <InfoRow icon={insurance.status === 'active' ? 'check-circle' : 'cancel'} label="Status" value={insurance.status || 'N/A'} />
              <InfoRow icon="calendar-today" label="Expiry Date" value={formatDate(insurance.expiryDate)} />
              <InfoRow icon="phone" label="Contact Phone" value={insurance.contactPhone} />
              <InfoRow icon="email" label="Contact Email" value={insurance.contactEmail} />
              <InfoRow icon="home" label="Contact Address" value={insurance.contactAddress} />
            </View>
          </>
        )}
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent
          onRequestClose={() => setModalVisible(false)}
        >
          <View className="flex-1 justify-center items-center bg-black/40">
            <View className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg items-center">
              <Text className="text-2xl font-bold mb-4 text-blue-700 dark:text-blue-400">Edit Profile</Text>
              <ScrollView className="w-full">
                <TextInput className="mb-4 p-4 rounded bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600" placeholder="Full Name" value={form.name} onChangeText={v => setForm(f => ({ ...f, name: v }))} />
                <TextInput className="mb-4 p-4 rounded bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600" placeholder="Email" value={form.email} onChangeText={v => setForm(f => ({ ...f, email: v }))} />
                <TextInput className="mb-4 p-4 rounded bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600" placeholder="Phone" value={form.phone} onChangeText={v => setForm(f => ({ ...f, phone: v }))} />
                <TextInput className="mb-4 p-4 rounded bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600" placeholder="Address" value={form.address} onChangeText={v => setForm(f => ({ ...f, address: v }))} />
                <TextInput className="mb-4 p-4 rounded bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600" placeholder="City" value={form.city} onChangeText={v => setForm(f => ({ ...f, city: v }))} />
                <TextInput className="mb-4 p-4 rounded bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600" placeholder="State" value={form.state} onChangeText={v => setForm(f => ({ ...f, state: v }))} />
              </ScrollView>
              {success && <Text className="text-green-600 mb-2">Profile updated!</Text>}
              <View className="flex-row justify-between w-full mt-2">
                <TouchableOpacity className="flex-1 mr-2 bg-blue-600 rounded-lg p-3" onPress={handleEdit}>
                  <Text className="text-white text-center font-semibold">Save</Text>
                </TouchableOpacity>
                <TouchableOpacity className="flex-1 ml-2 bg-gray-400 rounded-lg p-3" onPress={() => setModalVisible(false)}>
                  <Text className="text-white text-center font-semibold">Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
      <CustomTabBar />
    </View>
  );
}

ProfileScreen.options = {
  headerShown: false,
}; 