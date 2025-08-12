import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Image, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
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
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled
      >
         <View style={styles.container}>
          <Image source={require('../../assets/images/safe-logo.png')} style={styles.logo} />
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to your account</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#9ca3af"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            autoCorrect={false}
            textContentType="emailAddress"
            importantForAutofill="yes"
            autoFocus
          />
          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.input, styles.passwordInput]}
              placeholder="Password"
              placeholderTextColor="#9ca3af"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              autoCorrect={false}
              textContentType="password"
              importantForAutofill="yes"
            />
            <TouchableOpacity
              style={styles.showPasswordButton}
              onPress={() => setShowPassword((prev) => !prev)}
              accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
            >
              <Text style={styles.showPasswordIcon}>{showPassword ? '🙈' : '👁️'}</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => router.push('/auth/forgot-password')} style={styles.forgotPasswordButton}>
            <Text style={styles.forgotPasswordText}>Forgot password?</Text>
          </TouchableOpacity>
          {loading ? (
            <ActivityIndicator size="large" color="#2563eb" style={styles.loadingIndicator} />
          ) : (
            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleLogin}
              disabled={loading}
            >
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>
          )}
          {error && <Text style={styles.errorText}>{error}</Text>}
          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>New here? </Text>
            <TouchableOpacity onPress={() => router.push('/auth/register')}>
              <Text style={styles.registerLink}>Create an account</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 16,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
    color: '#2563eb',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    marginBottom: 16,
    padding: 16,
    fontSize: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    color: '#1e293b',
  },
  passwordContainer: {
    width: '100%',
    marginBottom: 8,
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 48,
  },
  showPasswordButton: {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: [{ translateY: -14 }],
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  showPasswordIcon: {
    fontSize: 20,
    color: '#64748b',
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginBottom: 16,
  },
  forgotPasswordText: {
    color: '#2563eb',
    fontSize: 14,
  },
  loadingIndicator: {
    marginBottom: 16,
  },
  loginButton: {
    width: '100%',
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  errorText: {
    color: '#ef4444',
    marginTop: 8,
    textAlign: 'center',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  registerText: {
    color: '#64748b',
    fontSize: 15,
  },
  registerLink: {
    color: '#2563eb',
    fontWeight: 'bold',
    fontSize: 15,
  },
}); 