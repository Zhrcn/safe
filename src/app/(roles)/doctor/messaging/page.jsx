"use client";
import React, { useState, useEffect } from "react";
import { useChat } from '@/hooks/useChat';
import ChatList from "@/components/messaging/ChatList";
import ChatPage from "@/components/messaging/ChatPage";
import { MessageCircle } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { getPatients } from '@/store/services/doctor/patientsApi';
import { getNonDoctorUsers } from '@/store/services/user/userApi';
import toast from 'react-hot-toast';
import { useSearchParams } from 'next/navigation';

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
      <div className="bg-card rounded-lg shadow-lg p-6 w-full max-w-md border border-border">
        <h2 className="text-lg font-semibold mb-4 text-foreground">{t('Start New Chat')}</h2>
        <label className="block mb-2 text-sm font-medium text-foreground">{t('Select User')}</label>
        <select
          className="w-full border border-border rounded-lg px-3 py-2 mb-4 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          value={selectedUser ? selectedUser.id : ""}
          onChange={e => {
            const user = allUsers.find(u => u.id === e.target.value);
            setSelectedUser(user || null);
          }}
        >
          <option key="" value="">{t('Choose a user')}</option>
          {allUsers.map(user => (
            <option key={user.id} value={user.id}>
              {user.displayName} {user.type === 'patient' ? t('(Patient)') : user.type === 'pharmacist' ? t('(Pharmacist)') : user.type === 'admin' ? t('(Admin)') : ''}
            </option>
          ))}
        </select>
        <label className="block mb-2 text-sm font-medium text-foreground">{t('Subject')}</label>
        <input
          className="w-full border border-border rounded-lg px-3 py-2 mb-4 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          value={subject}
          onChange={e => setSubject(e.target.value)}
          placeholder={t('Enter subject')}
        />
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors"
            onClick={onClose}
          >
            {t('Cancel')}
          </button>
          <button
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
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

export default function DoctorMessagingPage() {
  const { t } = useTranslation('common');
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [mobileView, setMobileView] = useState(false);
  const [showNewChat, setShowNewChat] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [subject, setSubject] = useState("");

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

  const [patients, setPatients] = useState([]);
  const [patientsLoading, setPatientsLoading] = useState(true);
  const [patientsError, setPatientsError] = useState(null);
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState(null);

  useEffect(() => {
    setPatientsLoading(true);
    setPatientsError(null);
    getPatients()
      .then(data => setPatients(data))
      .catch(err => setPatientsError(err.message || t('failedToFetchPatients')))
      .finally(() => setPatientsLoading(false));
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
    getNonDoctorUsers()
      .then(data => setUsers(data))
      .catch(err => setUsersError(err.message || t('failedToFetchUsers')))
      .finally(() => setUsersLoading(false));
  }, []);

  useEffect(() => {
    if (searchParams && searchParams.get('newChat') === '1') {
      setShowNewChat(true);
    }
  }, [searchParams]);

  const handleInputChange = (e) => {
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
    setNewMessage(""); 
    
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
    <div className="flex h-screen w-full bg-background overflow-hidden">
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

      <div className={`border-r border-border bg-card h-full ${mobileView && selectedConversation ? "hidden" : "block"} w-full md:w-1/3 lg:w-1/4 flex flex-col`}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card flex-shrink-0">
          <h1 className="text-xl font-bold flex items-center gap-2 text-foreground">
            <MessageCircle className="w-6 h-6 text-primary" />
            {t('Messages')}
          </h1>
          <button
            className="px-3 py-1 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            onClick={handleNewChat}
          >
            {t('New Chat')}
          </button>
        </div>
        <div className="p-3 flex-shrink-0">
          <input
            className="w-full border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground placeholder:text-muted-foreground"
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

      <div className={`flex-1 h-full bg-background ${mobileView && !selectedConversation ? "hidden" : "block"}`}>
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