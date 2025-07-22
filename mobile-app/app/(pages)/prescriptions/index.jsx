import React, { useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPrescriptions } from '../../../features/prescriptions/prescriptionsSlice';

export default function PrescriptionsScreen() {
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector((state) => state.prescriptions);

  useEffect(() => {
    dispatch(fetchPrescriptions());
  }, [dispatch]);

  return (
    <View className="flex-1 bg-white dark:bg-gray-900 p-4">
      <Text className="text-2xl font-bold mb-4">Prescriptions</Text>
      {loading && <Text>Loading...</Text>}
      {error && <Text className="text-red-500">{error}</Text>}
      <FlatList
        data={list}
        keyExtractor={item => item.id?.toString()}
        renderItem={({ item }) => (
          <View className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4 mb-2">
            <Text>{item.medicine} - {item.date}</Text>
          </View>
        )}
        ListEmptyComponent={(!loading ? <Text>No prescriptions found.</Text> : null)}
      />
    </View>
  );
} 