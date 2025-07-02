"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from 'react-redux';
import { fetchConversations, createConversation } from '@/store/slices/patient/conversationsSlice';
import ChatList from "@/components/messaging/ChatList";
import ChatPage from "@/components/messaging/ChatPage";
import { MessageCircle } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { getSocket } from "@/utils/socket";
import { doctors } from '@/mockdata/doctors';
import { pharmacists } from '@/mockdata/pharmacists';
import { useGetDoctorsQuery } from '@/store/services/doctor/doctorApi';

export default function PatientMessagingPage() {
  const [conversations, setConversations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [mobileView, setMobileView] = useState(false);
  const router = useRouter();
  const { t, i18n } = useTranslation('common');
  const isRtl = i18n.language === 'ar';
  const dispatch = useDispatch();
  const [socket, setSocket] = useState(null);
  const [showNewChat, setShowNewChat] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [subject, setSubject] = useState("");
  const { conversations: reduxConversations, loading, error } = useSelector(state => state.conversations);
  const currentUser = useSelector(state => state.user?.user); // adjust as needed

  useEffect(() => {
    dispatch(fetchConversations());
  }, [dispatch]);

  useEffect(() => {
    function handleResize() {
      setMobileView(window.innerWidth < 768);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const sock = getSocket();
    sock.connect();
    setSocket(sock);
    // Optionally: sock.emit("join", { userId: ... });
    return () => {
      sock.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;
    // Listen for incoming messages
    const handleReceive = (data) => {
      setConversations((prevConvs) => {
        return prevConvs.map((conv) =>
          conv.id === data.conversationId
            ? { ...conv, messages: [...conv.messages, data.message] }
            : conv
        );
      });
      if (selected && selected.id === data.conversationId) {
        setSelected((prev) => ({
          ...prev,
          messages: [...prev.messages, data.message],
        }));
      }
    };
    socket.on("receive_message", handleReceive);
    return () => {
      socket.off("receive_message", handleReceive);
    };
  }, [socket, selected]);

  // Join conversation room when selected
  useEffect(() => {
    if (!socket || !selected) return;
    socket.emit("join_conversation", { conversationId: selected.id });
    return () => {
      socket.emit("leave_conversation", { conversationId: selected.id });
    };
  }, [socket, selected]);

  const filtered = reduxConversations.filter(conv =>
    conv.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = conv => {
    setSelected(conv);
  };

  const handleSend = () => {
    if (!newMessage.trim() || !selected) return;
    const message = {
      id: Date.now(),
      content: newMessage,
      timestamp: new Date(),
      sender: "You", // Replace with actual user info
      read: false,
    };
    if (socket) {
      socket.emit("send_message", {
        conversationId: selected.id,
        message,
      });
    }
    setSelected((prev) => ({
      ...prev,
      messages: [...prev.messages, message],
    }));
    setConversations((prev) =>
      prev.map((c) =>
        c.id === selected.id
          ? { ...c, messages: [...c.messages, message] }
          : c
      )
    );
    setNewMessage("");
  };

  // New chat handler
  const handleCreateChat = async () => {
    if (!selectedUser) return;
    const participants = [currentUser?.id, selectedUser.user?.id || selectedUser.id];
    const result = await dispatch(createConversation({ participants, subject })).unwrap();
    setShowNewChat(false);
    setSelected(result);
    setSubject("");
    setSelectedUser(null);
  };

  const handleNewChat = () => {
    setShowNewChat(true);
  };

  // User picker modal
  const NewChatModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-card p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">{t('messages.start_new_chat')}</h2>
        <div className="mb-2 font-semibold">{t('messages.select_user')}</div>
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
          placeholder={t('messages.subject_placeholder')}
          value={subject}
          onChange={e => setSubject(e.target.value)}
        />
        <div className="flex justify-end gap-2">
          <button className="btn btn-secondary" onClick={() => setShowNewChat(false)}>{t('common.cancel')}</button>
          <button className="btn btn-primary" onClick={handleCreateChat} disabled={!selectedUser}>{t('messages.start_chat')}</button>
        </div>
      </div>
    </div>
  );

  if (mobileView) {
    if (!selected) {
      return (
        <div className="min-h-screen bg-background p-2">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground">{t('messages.title')}</h1>
            <p className="text-muted-foreground text-sm">{t('messages.select_conversation')}</p>
          </div>
          <ChatList
            conversations={filtered}
            selectedId={selected?.id}
            onSelect={handleSelect}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onNewChat={handleNewChat}
          />
        </div>
      );
    } else {
      return (
        <div className="min-h-screen bg-background p-2">
          <ChatPage
            conversation={selected}
            onSend={handleSend}
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            isMobile={true}
            onBack={() => setSelected(null)}
          />
        </div>
      );
    }
  }

  return (
    <div className="min-h-screen bg-background p-4">
      {showNewChat && <NewChatModal />}
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">{t('messages.title')}</h1>
          <p className="text-muted-foreground text-base">{t('messages.chat_securely')}</p>
        </div>
        <div className="container mx-auto grid grid-cols-12 gap-4 h-[calc(100vh-180px)]">
          <div className="col-span-12 md:col-span-4 lg:col-span-3 h-full">
            <ChatList
              conversations={filtered}
              selectedId={selected?.id}
              onSelect={handleSelect}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              onNewChat={handleNewChat}
            />
          </div>
          <div className="col-span-12 md:col-span-8 lg:col-span-9 h-full">
            <div className="h-full flex flex-col bg-card/80 rounded-2xl shadow-lg p-6">
              {selected ? (
                <ChatPage
                  conversation={selected}
                  onSend={handleSend}
                  newMessage={newMessage}
                  setNewMessage={setNewMessage}
                  isMobile={false}
                  onBack={() => setSelected(null)}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-lg">
                  <MessageCircle className="w-12 h-12 mb-4 text-primary/60" />
                  <div className="font-semibold mb-1">{t('messages.no_conversation_selected')}</div>
                  <div className="text-sm text-muted-foreground">{t('messages.select_conversation')}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 