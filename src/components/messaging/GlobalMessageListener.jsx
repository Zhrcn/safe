"use client";
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSocket } from '@/utils/socket';
import { addMessageToConversation } from '@/store/slices/patient/conversationsSlice';
import { updateOnlineStatus } from '@/store/slices/patient/onlineStatusSlice';
import { onUserPresence } from '@/store/services/patient/conversationApi';
import { selectCurrentUser } from '@/store/slices/auth/authSlice';
import toast from 'react-hot-toast';

// Store for managing unread counts across components
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
              // No user found, waiting...
      return;
    }

            // Setting up socket listeners for user

    const setupSocketListeners = () => {
      const socket = getSocket();
      if (!socket) {
        // Socket not available, retrying in 2 seconds...
        setTimeout(setupSocketListeners, 2000);
        return;
      }

      if (!socket.connected) {
        // Socket not connected, waiting for connection...
        socket.once('connect', () => {
          // Socket connected, setting up listeners...
          setupSocketListeners();
        });
        return;
      }

      // Socket connected and ready, setting up listeners...

      const handleReceiveMessage = ({ conversationId, message }) => {
        // Received message
        
        // Check if this is a message from the current user
        const isFromCurrentUser = message.sender === currentUser._id || 
                                 (typeof message.sender === 'object' && message.sender._id === currentUser._id);
        
        // Add message to conversation slice (currently only supporting patient conversations)
        if (currentRole === 'patient') {
          dispatch(addMessageToConversation({ conversationId, message }));
        }
        // TODO: Add support for doctor and pharmacist conversations when their slices are created
        
        // Update unread counts for messages from other users
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
        
        // Clear typing indicator when message is received
        typingStates[conversationId] = false;
      };

      const handleTyping = ({ conversationId, userId }) => {
        // Handle typing indicators
        if (userId !== currentUser._id) {
          typingStates[conversationId] = true;
          // Typing indicator
          
          // Clear typing indicator after 2 seconds
          setTimeout(() => {
            typingStates[conversationId] = false;
          }, 2000);
        }
      };

      const handleDisconnect = () => {
        // Socket disconnected, will reconnect automatically...
      };

      const handleReconnect = () => {
        // Socket reconnected, re-setting up listeners...
        // Re-setup listeners after reconnection
        setTimeout(setupSocketListeners, 1000);
      };

      // Handle user presence updates
      const handleUserPresence = ({ userId, isOnline }) => {
        dispatch(updateOnlineStatus({ userId, isOnline }));
      };

      // Listen for messages
      socket.on('receive_message', handleReceiveMessage);
      socket.on('typing', handleTyping);
      socket.on('disconnect', handleDisconnect);
      socket.on('reconnect', handleReconnect);
      socket.on('user_presence', handleUserPresence);

      // Cleanup function
      return () => {
        // Cleaning up socket listeners...
        socket.off('receive_message', handleReceiveMessage);
        socket.off('typing', handleTyping);
        socket.off('disconnect', handleDisconnect);
        socket.off('reconnect', handleReconnect);
        socket.off('user_presence', handleUserPresence);
      };
    };

    // Initial setup
    const cleanup = setupSocketListeners();

    // Cleanup on unmount or user change
    return cleanup;
  }, [dispatch, currentUser, currentRole]);

  // This component doesn't render anything
  return null;
} 