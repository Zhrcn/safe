 "use client";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchConversations,
  createConversation,
  sendMessage,
  clearError,
  addMessageToConversation,
  setCurrentConversation,
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
import { doctors } from '@/mockdata/doctors';
import { pharmacists } from '@/mockdata/pharmacists';
import toast from 'react-hot-toast';

export default function PatientMessagingPage() {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation('common');
  const isRtl = i18n.language === 'ar';
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
  const currentConversation = useSelector(state => state.conversations.currentConversation);
  const currentUser = useSelector(state => state.user?.user);

  useEffect(() => {
    dispatch(fetchConversations());
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
      if (selected && conversationId === selected._id && userId !== currentUser.id) {
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
    }
  }, [selected]);

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
    if (selected) {
      sendTyping({ conversationId: selected._id, userId: currentUser.id });
    }
  };

  const filtered = conversations.filter(conv =>
    (conv.title || "Untitled Conversation").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = conv => {
    setSelected(conv);
  };

  const handleSend = async () => {
    if (!newMessage.trim() || !selected) return;
    const message = {
      content: newMessage,
      sender: currentUser?.id,
      timestamp: new Date(),
      read: false,
    };
    await dispatch(sendMessage({ conversationId: selected._id, message }));
    setNewMessage("");
  };

  const handleCreateChat = async () => {
    if (!selectedUser) return;
    const participants = [selectedUser.id, currentUser.id];
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

  const NewChatModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-card p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">{t('patient.medications.messages.start_new_chat')}</h2>
        <div className="mb-2 font-semibold">{t('patient.medications.messages.select_user')}</div>
        <div className="max-h-40 overflow-y-auto mb-4">
          {[...doctors, ...pharmacists].map(user => (
            <div
              key={user.id}
              className={`p-2 rounded cursor-pointer flex items-center gap-2 ${selectedUser?.id === user.id ? 'bg-primary/10' : ''}`}
              onClick={() => setSelectedUser(user)}
            >
              <img src={user.user?.profileImage || user.profileImage} alt={user.user?.name || user.name} className="w-8 h-8 rounded-full" />
              <span>{user.user?.name || user.name}</span>
              <span className="text-xs text-muted-foreground ml-2">({user.user?.role || user.role})</span>
            </div>
          ))}
        </div>
        <input
          type="text"
          className="input input-bordered w-full mb-4"
          placeholder={t('patient.medications.messages.subject_placeholder')}
          value={subject}
          onChange={e => setSubject(e.target.value)}
        />
        <div className="flex justify-end gap-2">
          <button className="btn btn-secondary" onClick={() => setShowNewChat(false)}>{t('common.cancel')}</button>
          <button className="btn btn-primary" onClick={handleCreateChat} disabled={!selectedUser}>{t('patient.medications.messages.start_chat')}</button>
        </div>
      </div>
    </div>
  );

  if (mobileView) {
    if (!selected) {
      return (
        <div className="min-h-screen bg-background flex flex-col">
          <div className="mb-4 px-4 pt-4">
            <h1 className="text-2xl font-bold text-foreground">{t('patient.medications.messages.title')}</h1>
            <p className="text-muted-foreground text-sm">{t('patient.medications.messages.select_conversation')}</p>
          </div>
          <div className="flex-1">
            <ChatList
              conversations={filtered}
              selectedId={selected?._id}
              onSelect={handleSelect}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              onNewChat={handleNewChat}
              isTyping={isTyping}
              unreadCounts={unreadCounts}
            />
          </div>
        </div>
      );
    } else {
      return (
        <div className="min-h-screen bg-background flex flex-col">
          <div className="flex-1">
            <ChatPage
              conversation={selected}
              messages={selected.messages || []}
              onSend={handleSend}
              newMessage={newMessage}
              setNewMessage={setNewMessage}
              isMobile={true}
              onBack={() => setSelected(null)}
              isTyping={isTyping}
              onInputChange={handleInputChange}
            />
          </div>
        </div>
      );
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {showNewChat && <NewChatModal />}
      <div className="max-w-6xl mx-auto flex flex-1 gap-4 h-[calc(100vh-40px)] p-4">
        <div className="hidden md:flex flex-col w-full max-w-xs h-full rounded-2xl bg-muted/40 shadow-lg">
          <ChatList
            conversations={filtered}
            selectedId={selected?._id}
            onSelect={handleSelect}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onNewChat={handleNewChat}
            isTyping={isTyping}
            unreadCounts={unreadCounts}
          />
        </div>
        <div className="flex-1 flex flex-col h-full rounded-2xl bg-background shadow-lg">
          {selected ? (
            <ChatPage
              conversation={selected}
              messages={selected.messages || []}
              onSend={handleSend}
              newMessage={newMessage}
              setNewMessage={setNewMessage}
              isMobile={false}
              onBack={() => setSelected(null)}
              isTyping={isTyping}
              onInputChange={handleInputChange}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-lg">
              <MessageCircle className="w-12 h-12 mb-4 text-primary/60" />
              <div className="font-semibold mb-1">{t('patient.medications.messages.no_conversation_selected')}</div>
              <div className="text-sm text-muted-foreground">{t('patient.medications.messages.select_conversation')}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 