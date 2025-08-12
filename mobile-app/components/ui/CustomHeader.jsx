import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { MaterialIcons } from '@expo/vector-icons';

export default function CustomHeader({ onProfilePress, onNotificationPress, onMenuPress }) {
  const user = useSelector(state => state.auth.user);
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 18, paddingBottom: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f1f5f9', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 2 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity onPress={onMenuPress} style={{ marginRight: 0, padding: 0 }}>
          <MaterialIcons name="menu" size={28} color="#64748b" />
        </TouchableOpacity>
        <TouchableOpacity onPress={onProfilePress} style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', marginLeft: 16 }}>
          {user?.profileImage ? (
            <Image
              source={user.profileImage.includes('/uploads') ? { uri: `http://192.168.1.100:5001${user.profileImage}` } : { uri: user.profileImage }}
              style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: '#e0e7ff' }}
            />
          ) : (
            <Image source={require('../../assets/images/6872779a3ccff829030148a7-John_Smith.jpg')} style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: '#e0e7ff' }} />
          )}
        </TouchableOpacity>
      </View>
      <Image source={require('../../assets/images/safe-logo.png')} style={{ width: 60, height: 28, resizeMode: 'contain' }} />
      <TouchableOpacity onPress={onNotificationPress} style={{ padding: 6 }}>
        <MaterialIcons name="notifications-none" size={28} color="#64748b" />
      </TouchableOpacity>
    </View>
  );
} 