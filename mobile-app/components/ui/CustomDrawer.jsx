import React from 'react';
import { View, Text, TouchableOpacity, Animated, Dimensions, StyleSheet } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import { useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';

const PAGES = [
  { name: 'home', label: 'Home', icon: 'home-filled', route: '/(tabs)/home' },
  { name: 'messaging', label: 'Messages', icon: 'chat-bubble', route: '/(tabs)/messaging' },
  { name: 'appointments', label: 'Appointments', icon: 'event-available', route: '/(pages)/appointments' },
  { name: 'consultations', label: 'Consultations', icon: 'medical-services', route: '/(pages)/consultations' },
  { name: 'medications', label: 'Medications', icon: 'medication', route: '/(pages)/medications' },
  { name: 'prescriptions', label: 'Prescriptions', icon: 'description', route: '/(pages)/prescriptions' },
  { name: 'providers', label: 'Providers', icon: 'local-hospital', route: '/(tabs)/providers' },
  { name: 'medical-records', label: 'Medical Records', icon: 'folder', route: '/(tabs)/medical-records' },
  { name: 'profile', label: 'Profile', icon: 'person', route: '/(tabs)/profile' },
];

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function CustomDrawer({ visible, onClose }) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const [slideAnim] = React.useState(new Animated.Value(-SCREEN_WIDTH * 0.7));

  React.useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -SCREEN_WIDTH * 0.7,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  if (!visible) return null;

  const handleLogout = () => {
    dispatch(logout());
    onClose && onClose();
    router.replace('/auth/login');
  };

  return (
    <Animated.View style={[styles.drawer, { transform: [{ translateX: slideAnim }] }]}> 
      {/* Close button */}
      <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
        <MaterialIcons name="close" size={24} color="#64748b" />
      </TouchableOpacity>
      {/* Drawer items */}
      <View style={{ flex: 1 }}>
        {PAGES.map(page => {
          const isActive = pathname.includes(page.name);
          return (
            <TouchableOpacity
              key={page.name}
              onPress={() => { router.replace(page.route); onClose && onClose(); }}
              style={[styles.item, isActive && styles.itemActive]}
              activeOpacity={0.8}
            >
              <MaterialIcons name={page.icon} size={20} color={isActive ? '#2563eb' : '#64748b'} style={{ marginRight: 12 }} />
              <Text style={[styles.itemLabel, { color: isActive ? '#2563eb' : '#334155' }]} numberOfLines={1}>{page.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {/* Logout button at bottom */}
      <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
        <MaterialCommunityIcons name="logout" size={20} color="#ef4444" style={{ marginRight: 10 }} />
        <Text style={{ color: '#ef4444', fontWeight: 'bold', fontSize: 15 }}>Logout</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  drawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: SCREEN_WIDTH * 0.7,
    height: '100%',
    backgroundColor: '#fff',
    zIndex: 100,
    elevation: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    paddingTop: 32,
    paddingHorizontal: 10,
    flexDirection: 'column',
  },
  closeBtn: {
    position: 'absolute',
    top: 10,
    right: 8,
    padding: 4,
    zIndex: 2,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 2,
    backgroundColor: 'transparent',
  },
  itemActive: {
    backgroundColor: '#e0e7ff',
  },
  itemLabel: {
    fontSize: 14,
    fontWeight: '500',
    flexShrink: 1,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    marginBottom: 10,
    backgroundColor: '#fff',
  },
}); 