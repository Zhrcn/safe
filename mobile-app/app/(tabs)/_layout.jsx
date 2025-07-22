import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <IconSymbol name="profile" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="messaging"
        options={{
          title: 'Messaging',
          tabBarIcon: ({ color, size }) => <IconSymbol name="chat" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <IconSymbol name="home" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="providers"
        options={{
          title: 'Providers',
          tabBarIcon: ({ color, size }) => <IconSymbol name="providers" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="medical-records"
        options={{
          title: 'Records',
          tabBarIcon: ({ color, size }) => <IconSymbol name="records" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
} 