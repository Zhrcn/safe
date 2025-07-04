"use client";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchConversations,
  createConversation,
  sendMessage,
  addMessageToConversation,
  setCurrentConversation,
  markConversationAsRead,
} from '@/store/slices/patient/conversationsSlice';
import {
  onReceiveMessage,
  joinConversation,
  leaveConversation,
  sendTyping
} from '@/store/services/patient/conversationApi';
import ChatList from "@/components/messaging/ChatList";
import ChatPage from "@/components/messaging/ChatPage";
import { MessageCircle } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { getSocket } from "@/utils/socket";
import { getNonPatientUsers } from '@/store/services/user/userApi';
import toast from 'react-hot-toast';
import { getDoctors } from '@/store/services/doctor/doctorApi';

function NewChatModal({ open, onClose, onCreate, users, selectedUser, setSelectedUser, subject, setSubject, loading, error }) {
  const { t } = useTranslation('common');
  if (!open) return null;

  const allUsers = [
    ...users.map(user => ({
      ...user,
      id: user._id,
      type: user.role,
      displayName: `${user.firstName || ''} ${user.lastName || ''}`.trim()
    })),
  ].filter(u => u.displayName && u.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">{t('Start New Chat')}</h2>
        <label className="block mb-2 text-sm font-medium">{t('Select User')}</label>
        <select
          className="w-full border rounded px-2 py-1 mb-4"
          value={selectedUser ? selectedUser.id : ""}
          onChange={e => {
            const user = allUsers.find(u => u.id === e.target.value);
            setSelectedUser(user || null);
          }}
        >
          <option value="">{t('Choose a user')}</option>
          {allUsers.map(user => (
            <option key={user.id} value={user.id}>
              {user.displayName} {user.type === 'doctor' ? t('(Doctor)') : user.type === 'pharmacist' ? t('(Pharmacist)') : user.type === 'admin' ? t('(Admin)') : ''}
            </option>
          ))}
        </select>
        <label className="block mb-2 text-sm font-medium">{t('Subject')}</label>
        <input
          className="w-full border rounded px-2 py-1 mb-4"
          value={subject}
          onChange={e => setSubject(e.target.value)}
          placeholder={t('Enter subject')}
        />
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 bg-gray-200 rounded"
            onClick={onClose}
          >
            {t('Cancel')}
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded"
            onClick={onCreate}
            disabled={!selectedUser}
          >
            {t('Create')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PatientMessagingPage() {
  const dispatch = useDispatch();
  const { t } = useTranslation('common');
  const [selected, setSelected] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [mobileView, setMobileView] = useState(false);
  const [showNewChat, setShowNewChat] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [subject, setSubject] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCounts, setUnreadCounts] = useState({});
  const conversations = useSelector(state => state.conversations.conversations);
  const currentUser = useSelector(state => state.user?.user);
  console.log('[MessagingPage] currentUser:', currentUser);
  const [doctors, setDoctors] = useState([]);
  const [doctorsLoading, setDoctorsLoading] = useState(true);
  const [doctorsError, setDoctorsError] = useState(null);
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState(null);

  useEffect(() => {
    dispatch(fetchConversations());
    setDoctorsLoading(true);
    setDoctorsError(null);
    getDoctors()
      .then(data => setDoctors(data))
      .catch(err => setDoctorsError(err.message || 'Failed to fetch doctors'))
      .finally(() => setDoctorsLoading(false));
  }, [dispatch]);

  useEffect(() => {
    if (selected) {
      joinConversation(selected._id);
      dispatch(setCurrentConversation(selected));
      return () => leaveConversation(selected._id);
    }
  }, [selected, dispatch]);

  useEffect(() => {
    const off = onReceiveMessage(({ conversationId, message }) => {
      console.log('[onReceiveMessage] received', { conversationId, message });
      dispatch(addMessageToConversation({ conversationId, message }));
      if (!selected || selected._id !== conversationId) {
        toast('New message received!');
        setUnreadCounts(prev => ({
          ...prev,
          [conversationId]: (prev[conversationId] || 0) + 1
        }));
      } else {
        setIsTyping(false);
      }
    });
    return off;
  }, [dispatch, selected]);

  useEffect(() => {
    function handleResize() {
      setMobileView(window.innerWidth < 768);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const socket = getSocket();
    if (!socket || !selected) return;
    const handleTyping = ({ conversationId, userId }) => {
      if (selected && conversationId === selected._id && userId !== currentUser._id) {
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 2000);
      }
    };
    socket.on('typing', handleTyping);
    return () => socket.off('typing', handleTyping);
  }, [selected, currentUser]);

  useEffect(() => {
    if (selected) {
      setUnreadCounts(prev => ({ ...prev, [selected._id]: 0 }));
      dispatch(markConversationAsRead(selected._id));
    }
  }, [selected, dispatch]);

  useEffect(() => {
    setUsersLoading(true);
    setUsersError(null);
    getNonPatientUsers()
      .then(data => setUsers(data))
      .catch(err => setUsersError(err.message || 'Failed to fetch users'))
      .finally(() => setUsersLoading(false));
  }, []);

  const handleInputChange = (value) => {
    setNewMessage(value);
    if (selected && currentUser && currentUser._id) {
      sendTyping({ conversationId: selected._id, userId: currentUser._id });
    }
  };

  const filtered = conversations.filter(conv =>
    (conv.title || "Untitled Conversation").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = conv => {
    setSelected(conv);
  };

  const handleSend = async () => {
    console.log('[handleSend] called', { newMessage, selected, currentUser });
    if (!newMessage.trim()) {
      console.warn('[handleSend] Tried to send empty message.');
      return;
    }
    if (!selected) {
      console.error('[handleSend] No conversation selected.');
      toast.error('No conversation selected.');
      return;
    }
    if (!currentUser || !currentUser._id) {
      console.error('[handleSend] User not loaded.');
      toast.error('User not loaded. Please log in again.');
      return;
    }
    await dispatch(sendMessage({
      conversationId: selected._id,
      content: newMessage,
      currentUserId: currentUser._id,
    }))
      .unwrap()
      .then((result) => {
        console.log('[handleSend] Message sent successfully:', result);
      })
      .catch(err => {
        console.error('[handleSend] Send message error:', err);
        toast.error('Failed to send message');
      });
    setNewMessage("");
  };

  const handleCreateChat = async () => {
    if (!selectedUser) return;
    if (!currentUser || !currentUser._id) {
      toast.error('User not loaded. Please log in again.');
      return;
    }
    const participants = [selectedUser.id, currentUser._id];
    const result = await dispatch(createConversation({ participants, subject }));
    if (result.payload && result.payload._id) {
      setSelected(result.payload);
    }
    setShowNewChat(false);
    setSelectedUser(null);
    setSubject("");
  };

  const handleNewChat = () => {
    setShowNewChat(true);
  };

  const handleCloseNewChat = () => {
    setShowNewChat(false);
    setSelectedUser(null);
    setSubject("");
  };

  if (!currentUser) {
    return <div>Loading user...</div>;
  }

  return (
    <div className="flex h-full w-full bg-gray-50">
      {/* New Chat Modal */}
      <NewChatModal
        open={showNewChat}
        onClose={handleCloseNewChat}
        onCreate={handleCreateChat}
        users={users}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
        subject={subject}
        setSubject={setSubject}
        loading={usersLoading}
        error={usersError}
      />

      {/* Sidebar: Chat List */}
      <div className={`border-r bg-white h-full ${mobileView && selected ? "hidden" : "block"} w-full md:w-1/3 lg:w-1/4`}>
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <MessageCircle className="w-6 h-6" />
            {t('Messages')}
          </h1>
          <button
            className="px-3 py-1 bg-blue-600 text-white rounded"
            onClick={handleNewChat}
          >
            {t('New Chat')}
          </button>
        </div>
        <div className="p-3">
          <input
            className="w-full border rounded px-2 py-1"
            placeholder={t('Search conversations')}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <ChatList
          conversations={filtered}
          selected={selected}
          onSelect={handleSelect}
          unreadCounts={unreadCounts}
        />
      </div>

      {/* Main: Chat Page */}
      <div className={`flex-1 h-full ${mobileView && !selected ? "hidden" : "flex"} flex-col`}>
        {selected ? (
          <ChatPage
            conversation={selected}
            onSend={handleSend}
            newMessage={newMessage}
            onInputChange={handleInputChange}
            isMobile={mobileView}
            onBack={() => setSelected(null)}
            isTyping={isTyping}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <MessageCircle className="w-16 h-16 mb-4" />
            <p className="text-lg">{t('Select a conversation or start a new chat')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
