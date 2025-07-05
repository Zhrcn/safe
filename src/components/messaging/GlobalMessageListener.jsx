"use client";
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSocket } from '@/utils/socket';
import { addMessageToConversation } from '@/store/slices/patient/conversationsSlice';
import toast from 'react-hot-toast';

// Store for managing unread counts across components
let unreadCounts = {};
let typingStates = {};

export const getUnreadCounts = () => unreadCounts;
export const getTypingStates = () => typingStates;

export default function GlobalMessageListener() {
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.user?.user);
  const currentRole = currentUser?.role;

  useEffect(() => {
    if (!currentUser?._id) {
      console.log('[GlobalMessageListener] No user found, waiting...');
      return;
    }

    console.log('[GlobalMessageListener] Setting up socket listeners for user:', currentUser._id);

    const setupSocketListeners = () => {
      const socket = getSocket();
      if (!socket) {
        console.log('[GlobalMessageListener] Socket not available, retrying in 2 seconds...');
        setTimeout(setupSocketListeners, 2000);
        return;
      }

      if (!socket.connected) {
        console.log('[GlobalMessageListener] Socket not connected, waiting for connection...');
        socket.once('connect', () => {
          console.log('[GlobalMessageListener] Socket connected, setting up listeners...');
          setupSocketListeners();
        });
        return;
      }

      console.log('[GlobalMessageListener] Socket connected and ready, setting up listeners...');

      const handleReceiveMessage = ({ conversationId, message }) => {
        console.log('[GlobalMessageListener] Received message:', { conversationId, message });
        
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
          console.log('[GlobalMessageListener] Typing indicator:', { conversationId, userId });
          
          // Clear typing indicator after 2 seconds
          setTimeout(() => {
            typingStates[conversationId] = false;
          }, 2000);
        }
      };

      const handleDisconnect = () => {
        console.log('[GlobalMessageListener] Socket disconnected, will reconnect automatically...');
      };

      const handleReconnect = () => {
        console.log('[GlobalMessageListener] Socket reconnected, re-setting up listeners...');
        // Re-setup listeners after reconnection
        setTimeout(setupSocketListeners, 1000);
      };

      // Listen for messages
      socket.on('receive_message', handleReceiveMessage);
      socket.on('typing', handleTyping);
      socket.on('disconnect', handleDisconnect);
      socket.on('reconnect', handleReconnect);

      // Cleanup function
      return () => {
        console.log('[GlobalMessageListener] Cleaning up socket listeners...');
        socket.off('receive_message', handleReceiveMessage);
        socket.off('typing', handleTyping);
        socket.off('disconnect', handleDisconnect);
        socket.off('reconnect', handleReconnect);
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