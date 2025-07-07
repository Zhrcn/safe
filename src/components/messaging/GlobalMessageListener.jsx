"use client";
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSocket } from '@/utils/socket';
import { addMessageToConversation } from '@/store/slices/patient/conversationsSlice';
import { updateOnlineStatus } from '@/store/slices/patient/onlineStatusSlice';
import { onUserPresence } from '@/store/services/patient/conversationApi';
import { selectCurrentUser } from '@/store/slices/auth/authSlice';
import toast from 'react-hot-toast';

let unreadCounts = {};
let typingStates = {};

export const getUnreadCounts = () => unreadCounts;
export const getTypingStates = () => typingStates;

export default function GlobalMessageListener() {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const currentRole = currentUser?.role;

  useEffect(() => {
    if (!currentUser?._id) {
      return;
    }

    const setupSocketListeners = () => {
      const socket = getSocket();
      if (!socket) {
        setTimeout(setupSocketListeners, 2000);
        return;
      }

      if (!socket.connected) {
        socket.once('connect', () => {
          setupSocketListeners();
        });
        return;
      }

      const handleReceiveMessage = ({ conversationId, message }) => {
        const isFromCurrentUser = message.sender === currentUser._id || 
                                 (typeof message.sender === 'object' && message.sender._id === currentUser._id);
        
        if (currentRole === 'patient') {
          dispatch(addMessageToConversation({ conversationId, message }));
        }
        
        if (!isFromCurrentUser) {
          unreadCounts[conversationId] = (unreadCounts[conversationId] || 0) + 1;
          
          const senderName = typeof message.sender === 'object' 
            ? `${message.sender.firstName || ''} ${message.sender.lastName || ''}`.trim()
            : 'Someone';
          
          const displayName = senderName || 'Someone';
          const messagePreview = message.content.length > 50 
            ? `${message.content.substring(0, 50)}...` 
            : message.content;
          
          toast.success(`New message from ${displayName}: ${messagePreview}`, {
            duration: 4000,
            position: 'top-right',
          });
        }
        
        typingStates[conversationId] = false;
      };

      const handleTyping = ({ conversationId, userId }) => {
        if (userId !== currentUser._id) {
          typingStates[conversationId] = true;
          
          setTimeout(() => {
            typingStates[conversationId] = false;
          }, 2000);
        }
      };

      const handleDisconnect = () => {
      };

      const handleReconnect = () => {
        setTimeout(setupSocketListeners, 1000);
      };

      const handleUserPresence = ({ userId, isOnline }) => {
        dispatch(updateOnlineStatus({ userId, isOnline }));
      };

      socket.on('receive_message', handleReceiveMessage);
      socket.on('typing', handleTyping);
      socket.on('disconnect', handleDisconnect);
      socket.on('reconnect', handleReconnect);
      socket.on('user_presence', handleUserPresence);

      return () => {
        socket.off('receive_message', handleReceiveMessage);
        socket.off('typing', handleTyping);
        socket.off('disconnect', handleDisconnect);
        socket.off('reconnect', handleReconnect);
        socket.off('user_presence', handleUserPresence);
      };
    };

    const cleanup = setupSocketListeners();

    return cleanup;
  }, [dispatch, currentUser, currentRole]);

  return null;
}