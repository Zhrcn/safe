import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { useSelector } from 'react-redux';
import { login } from '../../features/auth/authSlice';
import { useRouter } from 'expo-router';
import { useAppDispatch } from '../../store';
import { Stack } from 'expo-router';

export default function LoginScreen() {
  const dispatch = useAppDispatch();
  const { loading, error, token } = useSelector((state) => state.auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = () => {
    dispatch(login({ email, password }));
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Login' }} />
      <View className="flex-1 justify-center items-center bg-white dark:bg-gray-900 px-4">
        {/* Logo/Icon */}
        <Image source={require('../../assets/images/safe-logo.png')} className="w-20 h-20 mb-4" />
        <Text className="text-3xl font-extrabold mb-2 text-center text-blue-700 dark:text-blue-400">Welcome Back</Text>
        <Text className="text-base text-gray-500 dark:text-gray-300 mb-6 text-center">Sign in to your account</Text>
        <TextInput
          className="mb-4 p-4 text-base rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:border-blue-500 w-full"
          placeholder="Email"
          placeholderTextColor="#9ca3af"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <View className="mb-2 w-full relative">
          <TextInput
            className="p-4 text-base rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:border-blue-500 pr-12"
            placeholder="Password"
            placeholderTextColor="#9ca3af"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            className="absolute right-3 top-1/2 -translate-y-1/2"
            onPress={() => setShowPassword((prev) => !prev)}
            accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
          >
            <Text className="text-gray-500 text-lg">{showPassword ? '🙈' : '👁️'}</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => router.push('/auth/forgot-password')} className="self-end mb-4">
          <Text className="text-blue-600 dark:text-blue-400 text-sm">Forgot password?</Text>
        </TouchableOpacity>
        {loading ? (
          <ActivityIndicator size="large" color="#2563eb" className="mb-4" />
        ) : (
          <TouchableOpacity
            className="w-full bg-blue-600 dark:bg-blue-500 py-3 rounded-lg mb-2 shadow-md"
            onPress={handleLogin}
            disabled={loading}
          >
            <Text className="text-white text-lg font-semibold text-center">Login</Text>
          </TouchableOpacity>
        )}
        {error && <Text className="text-red-500 mt-2 text-center">{error}</Text>}
        <View className="flex-row justify-center mt-6">
          <Text className="text-gray-600 dark:text-gray-300">New here? </Text>
          <TouchableOpacity onPress={() => router.push('/auth/register')}>
            <Text className="text-blue-600 dark:text-blue-400 font-semibold">Create an account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
} 