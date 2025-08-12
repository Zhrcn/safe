import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { getSocket } from '../../../../utils/socket';
import { useSelector, useDispatch } from 'react-redux';
import { fetchConversationById } from '../../../../features/messaging/messagingSlice';
import { useSelector as useReduxSelector } from 'react-redux';
import { Stack } from 'expo-router';

export default function ChatPage() {
  const { conversationId } = useLocalSearchParams();
  const dispatch = useDispatch();
  const { current, currentLoading, error } = useSelector((state) => state.messaging);
  const [input, setInput] = useState('');
  const flatListRef = useRef(null);
  const socketRef = useRef(null);
  const myUserId = useReduxSelector(state => state.auth.user?._id);

  useEffect(() => {
    dispatch(fetchConversationById(conversationId));
    let isMounted = true;
    (async () => {
      const socket = await getSocket();
      socketRef.current = socket;
      if (socket) {
        socket.emit('join_conversation', { conversationId });
        socket.on('newMessage', (msg) => {
          if (isMounted) dispatch(fetchConversationById(conversationId));
          console.log('Received newMessage event:', msg);
        });
        socket.on('connect_error', (err) => {
          console.error('Socket connect_error:', err);
        });
        socket.on('error', (err) => {
          console.error('Socket error:', err);
        });
      }
    })();
    return () => {
      isMounted = false;
      if (socketRef.current) {
        socketRef.current.emit('leave_conversation', { conversationId });
        socketRef.current.off('newMessage');
      }
    };
  }, [conversationId, dispatch]);

  const other = current?.participants?.find(p => p._id !== myUserId);

  const handleSend = async () => {
    if (!input.trim() || !other) return;
    const socket = socketRef.current || await getSocket();
    const msg = {
      conversationId,
      content: input,
      receiver: other._id,
    };
    console.log('Socket connected:', socket?.connected);
    console.log('Sending message:', msg);
    setInput('');
    if (socket) {
      socket.emit('send_message', { conversationId, message: msg }, (response) => {
        console.log('Send message response:', response);
        dispatch(fetchConversationById(conversationId));
      });
    }
  };

  const messages = current?.messages || [];
  const title = other ? `${other.firstName || ''} ${other.lastName || ''}`.trim() : 'Chat';

  const renderItem = ({ item }) => (
    <View style={{
      alignSelf: item.sender?._id === myUserId ? 'flex-end' : 'flex-start',
      backgroundColor: item.sender?._id === myUserId ? '#2563eb' : '#e5e7eb',
      borderRadius: 18,
      marginVertical: 4,
      padding: 10,
      maxWidth: '80%',
    }}>
      <Text style={{ color: item.sender?._id === myUserId ? '#fff' : '#111', fontSize: 16 }}>
        {item.content}
      </Text>
      <Text style={{ color: item.sender?._id === myUserId ? '#dbeafe' : '#6b7280', fontSize: 10, marginTop: 2, textAlign: 'right' }}>
        {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
    </View>
  );

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: '#fff' }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={{ flex: 1, backgroundColor: '#f9fafb' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 12, backgroundColor: '#2563eb', borderTopLeftRadius: 24, borderTopRightRadius: 24, marginBottom: 2 }}>
          <MaterialIcons name="arrow-back" size={24} color="#fff" style={{ marginRight: 12 }} onPress={() => window.history.back()} />
          <View style={{ flex: 1 }}>
            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18 }}>{title}</Text>
          </View>
        </View>
        {currentLoading ? <Text style={{ margin: 16 }}>Loading...</Text> : (
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderItem}
            keyExtractor={item => item._id?.toString() || item.id?.toString() || String(item.timestamp)}
            contentContainerStyle={{ paddingVertical: 12, paddingHorizontal: 8 }}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
          />
        )}
        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10, backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#e5e7eb' }}>
          <TextInput
            style={{ flex: 1, backgroundColor: '#f3f4f6', borderRadius: 24, paddingHorizontal: 16, paddingVertical: 10, fontSize: 16, marginRight: 8 }}
            placeholder="Type a message..."
            value={input}
            onChangeText={setInput}
            onSubmitEditing={handleSend}
            returnKeyType="send"
          />
          <TouchableOpacity onPress={handleSend} style={{ backgroundColor: '#2563eb', borderRadius: 24, padding: 10 }}>
            <MaterialIcons name="send" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
  
export const unstable_settings = { initialRouteName: undefined };

ChatPage.options = {
  headerShown: false,
}; 