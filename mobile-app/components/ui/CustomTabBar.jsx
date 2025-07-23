import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

const TABS = [
  { name: 'messaging', label: 'Messages', icon: 'chat-bubble', route: '/(tabs)/messaging' },
  { name: 'providers', label: 'Providers', icon: 'local-hospital', route: '/(tabs)/providers' },
  { name: 'home', label: 'Home', icon: 'home-filled', route: '/(tabs)/home' },
  { name: 'medical-records', label: 'Records', icon: 'folder', route: '/(tabs)/medical-records' },
  { name: 'profile', label: 'Profile', icon: 'person', route: '/(tabs)/profile' },
];

export default function CustomTabBar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingVertical: 10, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#f1f5f9', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 8 }}>
      {TABS.map(tab => {
        const isActive = pathname.includes(tab.name);
        return (
          <TouchableOpacity
            key={tab.name}
            onPress={() => router.replace(tab.route)}
            style={{ alignItems: 'center', flex: 1 }}
            activeOpacity={0.8}
          >
            <MaterialIcons name={tab.icon} size={28} color={isActive ? '#2563eb' : '#94a3b8'} />
            <Text style={{ fontSize: 12, color: isActive ? '#2563eb' : '#94a3b8', fontWeight: isActive ? 'bold' : 'normal', marginTop: 2 }}>{tab.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
} 