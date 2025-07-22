import React, { useEffect } from 'react';
import { View, Text, Button, FlatList } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMedicalRecords } from '../../../features/medicalRecords/medicalRecordsSlice';
import { Stack } from 'expo-router';

export default function MedicalRecordsScreen() {
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector((state) => state.medicalRecords);

  useEffect(() => {
    dispatch(fetchMedicalRecords());
  }, [dispatch]);

  return (
    <View className="flex-1 bg-white dark:bg-gray-900 p-4">
      <Text className="text-2xl font-bold mb-4">Medical Records</Text>
      {loading && <Text>Loading...</Text>}
      {error && <Text className="text-red-500">{error}</Text>}
      <FlatList
        data={list}
        keyExtractor={item => item.id?.toString()}
        renderItem={({ item }) => (
          <View className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4 mb-2">
            <Text>{item.type} - {item.date}</Text>
          </View>
        )}
        ListEmptyComponent={(!loading ? <Text>No records found.</Text> : null)}
      />
      <Button title="Upload New Record" onPress={() => {}} />
    </View>
  );
}

// Hide the default header for this page
export const unstable_settings = { initialRouteName: undefined };

MedicalRecordsScreen.options = {
  headerShown: false,
}; 