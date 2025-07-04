"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { conversations as mockConversations } from "@/mockdata/conversations";
import ChatList from "@/components/messaging/ChatList";
import ChatPage from "@/components/messaging/ChatPage";
import { Card, CardContent } from '@/components/ui/Card';
import { useTranslation } from 'react-i18next';

export default function DoctorMessagingPage() {
  const { t } = useTranslation();
  const [conversations, setConversations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [mobileView, setMobileView] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setConversations(mockConversations);
  }, []);

  useEffect(() => {
    function handleResize() {
      setMobileView(window.innerWidth < 768);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const filtered = conversations.filter(conv =>
    conv.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = conv => {
    setSelected(conv);
  };

  const handleSend = () => {
    if (!newMessage.trim() || !selected) return;
    const updated = {
      ...selected,
      messages: [
        ...selected.messages,
        {
          id: Date.now(),
          content: newMessage,
          timestamp: new Date(),
          sender: "You",
          read: false,
        },
      ],
      lastMessage: newMessage,
      lastMessageTime: new Date(),
    };
    setSelected(updated);
    setConversations(conversations.map(c => (c.id === updated.id ? updated : c)));
    setNewMessage("");
  };

  const handleNewChat = () => {
    alert(t('doctor.messaging.startNewChat', 'Start a new chat (not implemented)'));
  };

  if (mobileView) {
    if (!selected) {
      return (
        <div className="min-h-screen bg-background flex flex-col">
          <div className="mb-4 px-4 pt-4">
            <h1 className="text-2xl font-bold text-foreground">{t('doctor.messaging.title', 'Messages')}</h1>
            <p className="text-muted-foreground text-sm">{t('doctor.messaging.selectConversation', 'Select a conversation to start chatting.')}</p>
          </div>
          <div className="flex-1">
            <ChatList
              conversations={filtered}
              selectedId={selected?.id}
              onSelect={handleSelect}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              onNewChat={handleNewChat}
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
              onSend={handleSend}
              newMessage={newMessage}
              setNewMessage={setNewMessage}
              isMobile={true}
              onBack={() => setSelected(null)}
            />
          </div>
        </div>
      );
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="max-w-6xl mx-auto flex flex-1 gap-4 h-[calc(100vh-40px)] p-4">
        <div className="hidden md:flex flex-col w-full max-w-xs h-full rounded-2xl bg-muted/40 shadow-lg">
          <ChatList
            conversations={filtered}
            selectedId={selected?.id}
            onSelect={handleSelect}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onNewChat={handleNewChat}
          />
        </div>
        <div className="flex-1 flex flex-col h-full rounded-2xl bg-background shadow-lg">
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
              {t('doctor.messaging.selectConversation', 'Select a conversation to start chatting.')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}