"use client";
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSocket, resetSocketConnection } from '@/utils/socket';
import { addMessageToConversation } from '@/store/slices/patient/conversationsSlice';
import { updateOnlineStatus } from '@/store/slices/patient/onlineStatusSlice';
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
  const setupTimeoutRef = useRef(null);
  const retryCountRef = useRef(0);
  const maxRetries = 3;

  useEffect(() => {
    if (setupTimeoutRef.current) {
      clearTimeout(setupTimeoutRef.current);
    }

    if (!currentUser?._id) {
      console.log('[GlobalMessageListener] No authenticated user, skipping socket setup');
      return;
    }

    const setupSocketListeners = () => {
      const socket = getSocket();
      if (!socket) {
        if (retryCountRef.current < maxRetries) {
          console.log('[GlobalMessageListener] No socket available, retrying in 3s...', retryCountRef.current + 1);
          retryCountRef.current++;
          setupTimeoutRef.current = setTimeout(setupSocketListeners, 3000);
        } else {
          console.warn('[GlobalMessageListener] Max retries reached, giving up on socket connection');
        }
        return;
      }

      if (!socket.connected) {
        console.log('[GlobalMessageListener] Socket not connected, waiting for connection...');
        socket.once('connect', () => {
          console.log('[GlobalMessageListener] Socket connected, setting up listeners...');
          retryCountRef.current = 0;
          setupSocketListeners();
        });
        return;
      }

      console.log('[GlobalMessageListener] Setting up socket listeners for user:', currentUser._id);

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
        console.log('[GlobalMessageListener] Socket disconnected');
      };

      const handleReconnect = () => {
        console.log('[GlobalMessageListener] Socket reconnected, re-setting up listeners...');
        retryCountRef.current = 0; 
        setupTimeoutRef.current = setTimeout(setupSocketListeners, 1000);
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

    return () => {
      if (setupTimeoutRef.current) {
        clearTimeout(setupTimeoutRef.current);
      }
      if (cleanup) {
        cleanup();
      }
      retryCountRef.current = 0;
    };
  }, [dispatch, currentUser, currentRole]);

  return null;
}