import React from 'react';
import { Slot, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  return (
    <SafeAreaView style={{ flex: 1, paddingBottom: insets.bottom }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Slot />
      </Stack>
    </SafeAreaView>
  );
} 