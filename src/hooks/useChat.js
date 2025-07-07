import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { selectCurrentUser } from '@/store/slices/auth/authSlice';
import {
  fetchConversations,
  createConversation,
  sendMessage,
  addOptimisticMessage,
  setCurrentConversation,
  markConversationAsRead,
  removeConversation,
  deleteMessage,
  removeMessageFromConversation
} from '@/store/slices/patient/conversationsSlice';
import {
  joinConversation,
  leaveConversation,
  sendTyping,
  getMessagesSocket,
  onReceiveMessage,
  onMessageDeleted,
  onTyping
} from '@/store/services/patient/conversationApi';

export const useChat = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation('common');
  
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [messagesError, setMessagesError] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState({});

  const conversations = useSelector(state => state.conversations.conversations);
  const currentUser = useSelector(selectCurrentUser);
  const currentConversation = useSelector(state => state.conversations.currentConversation);

  useEffect(() => {
    dispatch(fetchConversations());
  }, [dispatch]);

  useEffect(() => {
    const unsubscribeReceive = onReceiveMessage((data) => {
      if (data && data.conversationId && data.message) {
        if (selectedConversation && selectedConversation._id === data.conversationId) {
          setMessages(prev => [...prev, data.message]);
        }
      }
    });

    const unsubscribeDelete = onMessageDeleted((data) => {
      if (data && data.conversationId && data.messageId) {
        if (selectedConversation && selectedConversation._id === data.conversationId) {
          setMessages(prev => prev.filter(m => m._id !== data.messageId));
        }
        dispatch(removeMessageFromConversation({
          conversationId: data.conversationId,
          messageId: data.messageId
        }));
      }
    });

    const unsubscribeTyping = onTyping((data) => {
      if (data && data.conversationId && data.userId) {
        setTypingUsers(prev => ({
          ...prev,
          [data.conversationId]: data.userId
        }));
        
        setTimeout(() => {
          setTypingUsers(prev => {
            const newState = { ...prev };
            delete newState[data.conversationId];
            return newState;
          });
        }, 3000);
      }
    });

    return () => {
      unsubscribeReceive();
      unsubscribeDelete();
      unsubscribeTyping();
    };
  }, [selectedConversation, dispatch]);

  const selectConversation = useCallback(async (conversation) => {
    if (!conversation) {
      setSelectedConversation(null);
      setMessages([]);
      return;
    }

    setSelectedConversation(conversation);
    dispatch(setCurrentConversation(conversation));
    
    joinConversation(conversation._id);
    
    setLoadingMessages(true);
    setMessagesError(null);
    
    try {
      const msgs = await getMessagesSocket(conversation._id);
      setMessages(msgs);
    } catch (err) {
      console.error('Error loading messages:', err);
      setMessagesError(err.message);
      toast.error('Failed to load messages');
    } finally {
      setLoadingMessages(false);
    }

    dispatch(markConversationAsRead(conversation._id));
  }, [dispatch]);

  const sendMessageHandler = useCallback(async (content) => {
    if (!selectedConversation || !currentUser) {
      toast.error('No conversation selected or user not loaded');
      return;
    }

    const messageContent = content.trim();
    if (!messageContent) return;

    dispatch(addOptimisticMessage({
      conversationId: selectedConversation._id,
      content: messageContent,
      currentUserId: currentUser._id,
    }));

    try {
      await dispatch(sendMessage({
        conversationId: selectedConversation._id,
        content: messageContent,
        currentUserId: currentUser._id,
      })).unwrap();
    } catch (err) {
      console.error('Error sending message:', err);
      toast.error('Failed to send message');
    }
  }, [selectedConversation, currentUser, dispatch]);

  const deleteMessageHandler = useCallback(async (messageId) => {
    if (!selectedConversation) return;

    try {
      await dispatch(deleteMessage({
        conversationId: selectedConversation._id,
        messageId
      })).unwrap();
      toast.success('Message deleted');
    } catch (err) {
      console.error('Error deleting message:', err);
      toast.error('Failed to delete message');
    }
  }, [selectedConversation, dispatch]);

  const deleteConversationHandler = useCallback(async (conversationId) => {
    if (window.confirm(t('Are you sure you want to delete this conversation? This action cannot be undone.'))) {
      try {
        await dispatch(removeConversation(conversationId)).unwrap();
        if (selectedConversation && selectedConversation._id === conversationId) {
          setSelectedConversation(null);
          setMessages([]);
        }
        toast.success('Conversation deleted');
      } catch (err) {
        console.error('Error deleting conversation:', err);
        toast.error('Failed to delete conversation');
      }
    }
  }, [selectedConversation, dispatch, t]);

  const createConversationHandler = useCallback(async (participants, subject) => {
    try {
      const result = await dispatch(createConversation({ participants, subject })).unwrap();
      if (result && result._id) {
        setSelectedConversation(result);
        return result;
      }
    } catch (err) {
      console.error('Error creating conversation:', err);
      toast.error('Failed to create conversation');
    }
    return null;
  }, [dispatch]);

  const sendTypingHandler = useCallback((conversationId) => {
    if (currentUser && conversationId) {
      sendTyping({ conversationId, userId: currentUser._id });
    }
  }, [currentUser]);

  useEffect(() => {
    return () => {
      if (selectedConversation) {
        leaveConversation(selectedConversation._id);
      }
    };
  }, [selectedConversation]);

  return {
    conversations,
    selectedConversation,
    messages,
    loadingMessages,
    messagesError,
    isTyping: typingUsers[selectedConversation?._id] || false,
    currentUser,
    currentConversation,
    
    selectConversation,
    sendMessage: sendMessageHandler,
    deleteMessage: deleteMessageHandler,
    deleteConversation: deleteConversationHandler,
    createConversation: createConversationHandler,
    sendTyping: sendTypingHandler,
    
    refreshMessages: () => selectConversation(selectedConversation)
  };
};