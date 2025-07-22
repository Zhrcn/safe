import React, { useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchConsultations } from '../../../features/consultations/consultationsSlice';

export default function ConsultationsScreen() {
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector((state) => state.consultations);

  useEffect(() => {
    dispatch(fetchConsultations());
  }, [dispatch]);

  return (
    <View className="flex-1 bg-white dark:bg-gray-900 p-4">
      <Text className="text-2xl font-bold mb-4">Consultations</Text>
      {loading && <Text className="text-blue-500">Loading...</Text>}
      {error && <Text className="text-red-500">{error}</Text>}
      <FlatList
        data={list}
        keyExtractor={item => item.id?.toString()}
        renderItem={({ item }) => (
          <View className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4 mb-2">
            <Text>{item.date} - {item.doctorName}</Text>
          </View>
        )}
        ListEmptyComponent={(!loading ? <Text className="text-gray-400 italic">No consultations found.</Text> : null)}
      />
    </View>
  );
} 