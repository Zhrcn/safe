import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { Provider, useSelector } from 'react-redux';
import { store } from '../store';
import "../global.css"
import { useRouter, useSegments, Slot } from 'expo-router';
import React, { useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { useAppDispatch } from '../store';
import { setToken } from '../features/auth/authSlice';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View } from 'react-native';

import { useColorScheme } from '@/hooks/useColorScheme';

function AuthGuard({ children }) {
  const dispatch = useAppDispatch();
  const { token } = useSelector((state) => state.auth);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    SecureStore.getItemAsync('token').then(storedToken => {
      if (storedToken) {
        dispatch(setToken(storedToken));
      }
    });
  }, []);

  useEffect(() => {
    console.log('AuthGuard token:', token, 'segments:', segments);
    if (token) {
      router.replace('/(tabs)/home');
    } else {
      router.replace('/auth/login');
    }
  }, [token]);

  return <>{children}</>;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...MaterialCommunityIcons.font,
  });
  const insets = useSafeAreaInsets();

  if (!loaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <AuthGuard>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <View style={{ flex: 1, paddingTop: insets.top }}>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="+not-found" />
            </Stack>
          </View>
          <StatusBar style="auto" />
        </ThemeProvider>
      </AuthGuard>
    </Provider>
  );
} 