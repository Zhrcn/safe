import React, { useEffect } from 'react';
import { View, Text, ScrollView, Button } from 'react-native';
import { ThemedView } from '../../../components/ThemedView';
import { useSelector, useDispatch } from 'react-redux';
import { fetchDashboard } from '../../../features/dashboard/dashboardSlice';
import { useRouter } from 'expo-router';

export default function DashboardScreen() {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.dashboard);
  const router = useRouter();

  useEffect(() => {
    dispatch(fetchDashboard());
  }, [dispatch]);

  return (
    <ScrollView className="flex-1 bg-white dark:bg-gray-900 p-4">
      <Text className="text-2xl font-bold mb-4">Dashboard</Text>
      {loading && <Text>Loading...</Text>}
      {error && <Text className="text-red-500">{error}</Text>}
      {data && (
        <View className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4 mb-2">
          <Text>Upcoming Appointments: {data.upcomingAppointments}</Text>
          <Text>Active Medications: {data.activeMedications}</Text>
          <Text>Recent Messages: {data.recentMessages}</Text>
        </View>
      )}
      <View className="flex-row justify-between">
        <View className="flex-1 bg-green-100 dark:bg-green-900 rounded-xl p-4 mr-2">
          <Text className="font-semibold mb-1">Appointments</Text>
          <Text className="text-xs text-gray-600 dark:text-gray-300">View & book</Text>
        </View>
        <View className="flex-1 bg-yellow-100 dark:bg-yellow-900 rounded-xl p-4 mx-1">
          <Text className="font-semibold mb-1">Records</Text>
          <Text className="text-xs text-gray-600 dark:text-gray-300">All your files</Text>
        </View>
        <View className="flex-1 bg-purple-100 dark:bg-purple-900 rounded-xl p-4 ml-2">
          <Text className="font-semibold mb-1">Medications</Text>
          <Text className="text-xs text-gray-600 dark:text-gray-300">Reminders</Text>
        </View>
      </View>
      {/* Navigation buttons for nested pages */}
      <View className="mt-6 space-y-3">
        <Button title="Go to Appointments" onPress={() => router.push('/(pages)/appointments')} />
        <Button title="Go to Medications" onPress={() => router.push('/(pages)/medications')} />
        <Button title="Go to Consultations" onPress={() => router.push('/(pages)/consultations')} />
        <Button title="Go to Prescriptions" onPress={() => router.push('/(pages)/prescriptions')} />
      </View>
    </ScrollView>
  );
} 