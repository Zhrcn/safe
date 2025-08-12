import React, { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchConversations } from '../../../features/messaging/messagingSlice';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, Stack } from 'expo-router';
import { getSocket } from '../../../utils/socket';
import { useSelector as useReduxSelector } from 'react-redux';
import CustomHeader from '../../../components/ui/CustomHeader';
import CustomTabBar from '../../../components/ui/CustomTabBar';
import CustomDrawer from '../../../components/ui/CustomDrawer';

export default function MessagingScreen() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const { list, loading, error } = useSelector((state) => state.messaging);
  const myUserId = useReduxSelector(state => state.auth.user?._id);
  const socketRef = useRef(null);

  useEffect(() => {
    dispatch(fetchConversations());
    let isMounted = true;
    (async () => {
      const socket = await getSocket();
      socketRef.current = socket;
      if (socket) {
        socket.on('newConversation', (conv) => {
          if (isMounted) dispatch(fetchConversations());
        });
        socket.on('newMessage', (msg) => {
          if (isMounted) dispatch(fetchConversations());
        });
      }
    })();
    return () => {
      isMounted = false;
      if (socketRef.current) {
        socketRef.current.off('newConversation');
        socketRef.current.off('newMessage');
      }
    };
  }, [dispatch]);

  const handleOpenChat = (conversation) => {
    router.push(`/messaging/${conversation._id}`);
  };

  const renderItem = ({ item }) => {
    const other = item.participants?.find(p => p._id !== myUserId);
    const lastMsg = item.messages?.length > 0 ? item.messages[item.messages.length - 1] : null;
    return (
      <TouchableOpacity
        className="flex-row items-center bg-white dark:bg-gray-800 rounded-2xl p-4 mb-3 shadow border border-gray-100 dark:border-gray-700"
        onPress={() => handleOpenChat(item)}
        activeOpacity={0.8}
      >
        {other?.profileImage || other?.avatar ? (
          <Image 
            source={other.profileImage?.includes('/uploads') || other.avatar?.includes('/uploads') ? 
              { uri: `http://192.168.1.100:5001${other.profileImage || other.avatar}` } : 
              { uri: other.profileImage || other.avatar }} 
            className="w-12 h-12 rounded-full mr-4 bg-gray-200" 
          />
        ) : (
          <View className="w-12 h-12 rounded-full bg-blue-100 items-center justify-center mr-4">
            <MaterialIcons name="person" size={28} color="#2563eb" />
          </View>
        )}
        <View className="flex-1 min-w-0">
          <Text className="font-semibold text-base text-gray-900 dark:text-white" numberOfLines={1}>{item.title}</Text>
          <Text className="text-gray-500 dark:text-gray-300 text-sm" numberOfLines={1}>{lastMsg ? lastMsg.content : 'No messages yet.'}</Text>
        </View>
        <View className="items-end ml-2 min-w-[60px]">
          {lastMsg?.timestamp && (
            <Text className="text-xs text-gray-400 mb-1">{new Date(lastMsg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
          )}
        </View>
        <MaterialIcons name="chevron-right" size={24} color="#9ca3af" style={{ marginLeft: 8 }} />
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900">
      <CustomHeader onMenuPress={() => setDrawerOpen(true)} />
      <CustomDrawer visible={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <View className="flex-1 p-4">
        <Text className="text-2xl font-bold mb-4 text-blue-700 dark:text-blue-400">Messages</Text>
        {loading && <Text>Loading...</Text>}
        {error && <Text className="text-red-500">{error}</Text>}
        <FlatList
          data={list}
          keyExtractor={item => item._id?.toString() || item.id?.toString()}
          renderItem={renderItem}
          ListEmptyComponent={(!loading ? <Text>No messages yet.</Text> : null)}
        />
      </View>
      <CustomTabBar />
    </View>
  );
}

MessagingScreen.options = {
  headerShown: false,
}; 