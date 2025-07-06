"use client";
import React, { useState, useEffect } from "react";
import { useChat } from '@/hooks/useChat';
import ChatList from "@/components/messaging/ChatList";
import ChatPage from "@/components/messaging/ChatPage";
import { MessageCircle } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { getNonPatientUsers } from '@/store/services/user/userApi';
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
  const { t } = useTranslation('common');
  const [searchTerm, setSearchTerm] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [mobileView, setMobileView] = useState(false);
  const [showNewChat, setShowNewChat] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [subject, setSubject] = useState("");

  // Use the chat hook
  const {
    conversations,
    selectedConversation,
    messages,
    loadingMessages,
    messagesError,
    isTyping,
    currentUser,
    selectConversation,
    sendMessage,
    deleteMessage,
    deleteConversation,
    createConversation,
    sendTyping
  } = useChat();

  const [doctors, setDoctors] = useState([]);
  const [doctorsLoading, setDoctorsLoading] = useState(true);
  const [doctorsError, setDoctorsError] = useState(null);
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState(null);

  useEffect(() => {
    setDoctorsLoading(true);
    setDoctorsError(null);
    getDoctors()
      .then(data => setDoctors(data))
      .catch(err => setDoctorsError(err.message || t('failedToFetchDoctors')))
      .finally(() => setDoctorsLoading(false));
  }, []);

  useEffect(() => {
    function handleResize() {
      setMobileView(window.innerWidth < 768);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setUsersLoading(true);
    setUsersError(null);
    getNonPatientUsers()
      .then(data => setUsers(data))
      .catch(err => setUsersError(err.message || t('failedToFetchUsers')))
      .finally(() => setUsersLoading(false));
  }, []);

  const handleInputChange = (e) => {
    // Handle both event objects and direct values
    const value = e && e.target ? e.target.value : e;
    setNewMessage(value);
    if (selectedConversation && currentUser && currentUser._id) {
      sendTyping(selectedConversation._id);
    }
  };

  const filtered = conversations.filter(conv =>
    (conv.title || "Untitled Conversation").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = conv => {
    selectConversation(conv);
  };

  const handleSend = async () => {
    if (!newMessage.trim()) return;
    
    const messageContent = newMessage.trim();
    setNewMessage(""); // Clear input immediately
    
    await sendMessage(messageContent);
  };

  const handleCreateChat = async () => {
    if (!selectedUser) return;
    if (!currentUser || !currentUser._id) {
      toast.error(t('userNotLoaded'));
      return;
    }
    const participants = [selectedUser.id, currentUser._id];
    const result = await createConversation(participants, subject);
    if (result && result._id) {
      selectConversation(result);
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

  const handleDeleteChat = async (conversationId) => {
    await deleteConversation(conversationId);
  };

  const handleDeleteMessage = async (messageId) => {
    await deleteMessage(messageId);
  };

  if (!currentUser) {
    return <div>{t('loadingUser')}</div>;
  }

  return (
    <div className="flex h-screen w-full bg-gray-50 overflow-hidden">
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
      <div className={`border-r bg-white h-full ${mobileView && selectedConversation ? "hidden" : "block"} w-full md:w-1/3 lg:w-1/4 flex flex-col`}>
        <div className="flex items-center justify-between px-4 py-3 border-b flex-shrink-0">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <MessageCircle className="w-6 h-6" />
            {t('Messages')}
          </h1>
          <button
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            onClick={handleNewChat}
          >
            {t('New Chat')}
          </button>
        </div>
        <div className="p-3 flex-shrink-0">
          <input
            className="w-full border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={t('Search conversations')}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex-1 overflow-y-auto chat-scroll">
          <ChatList
            conversations={filtered}
            selectedId={selectedConversation?._id}
            onSelect={handleSelect}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onNewChat={handleNewChat}
            isTyping={isTyping}
            currentUser={currentUser}
          />
        </div>
      </div>

      {/* Main: Chat Page */}
      <div className={`flex-1 h-full ${mobileView && !selectedConversation ? "hidden" : "block"}`}>
        {selectedConversation ? (
          <ChatPage
            conversation={{ ...selectedConversation, messages }}
            onSend={handleSend}
            newMessage={newMessage}
            onInputChange={handleInputChange}
            isMobile={mobileView}
            onBack={() => selectConversation(null)}
            isTyping={isTyping}
            onDelete={handleDeleteChat}
            onDeleteMessage={handleDeleteMessage}
            currentUser={currentUser}
            loading={loadingMessages}
            error={messagesError}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <span>{t('Select a conversation to start chatting')}</span>
          </div>
        )}
      </div>
    </div>
  );
}
