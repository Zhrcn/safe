"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { conversations as mockConversations } from "@/mockdata/conversations";
import ChatList from "@/components/messaging/ChatList";
import ChatPage from "@/components/messaging/ChatPage";
import { useTranslation } from "next-i18next";

function getUnreadCount(messages) {
  return messages.filter(m => !m.read && m.sender !== "You").length;
}

function sortConversations(convs) {
  return [...convs].sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime));
}

export default function PharmacistMessagingPage() {
  const { t } = useTranslation();
  const [conversations, setConversations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [mobileView, setMobileView] = useState(false);
  const [typing, setTyping] = useState(false);
  const router = useRouter();
  const typingTimeout = useRef(null);

  useEffect(() => {
    const withUnread = mockConversations.map(conv => ({
      ...conv,
      unreadCount: getUnreadCount(conv.messages || []),
    }));
    setConversations(sortConversations(withUnread));
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
    if (!selected) return;
    const updated = conversations.map(conv => {
      if (conv.id === selected.id) {
        const updatedMessages = conv.messages.map(m =>
          m.sender !== "You" ? { ...m, read: true } : m
        );
        return {
          ...conv,
          messages: updatedMessages,
          unreadCount: 0,
        };
      }
      return conv;
    });
    setConversations(sortConversations(updated));
  }, [selected?.id]);

  useEffect(() => {
    if (!selected) return;
    setTyping(false);
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      setTyping(true);
      typingTimeout.current = setTimeout(() => setTyping(false), 3000);
    }, 2000);
    return () => clearTimeout(typingTimeout.current);
  }, [selected?.id]);

  const filtered = conversations.filter(conv =>
    conv.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = conv => {
    setSelected(conv);
  };

  const handleSend = () => {
    if (!newMessage.trim() || !selected) return;
    const updatedConv = {
      ...selected,
      messages: [
        ...selected.messages,
        {
          id: Date.now(),
          content: newMessage,
          timestamp: new Date(),
          sender: "You",
          read: true,
        },
      ],
      lastMessage: newMessage,
      lastMessageTime: new Date(),
      unreadCount: 0,
    };
    setTimeout(() => {
      const reply = {
        id: Date.now() + 1,
        content: t('automatedReply'),
        timestamp: new Date(),
        sender: updatedConv.title,
        avatar: updatedConv.avatar,
        read: false,
      };
      setConversations(prev => sortConversations(prev.map(c =>
        c.id === updatedConv.id
          ? {
              ...c,
              messages: [...c.messages, reply],
              lastMessage: reply.content,
              lastMessageTime: reply.timestamp,
              unreadCount: (c.unreadCount || 0) + 1,
            }
          : c
      )));
    }, 1500);
    setSelected(updatedConv);
    setConversations(prev => sortConversations(prev.map(c => c.id === updatedConv.id ? updatedConv : c)));
    setNewMessage("");
  };

  const handleNewChat = () => {
    const newId = Date.now();
    const newConv = {
      id: newId,
      title: `${t('newContact')} ${newId % 1000}`,
      subtitle: t('newChatStarted'),
      avatar: undefined,
      lastMessage: "",
      lastMessageTime: new Date(),
      unreadCount: 0,
      messages: [],
    };
    setConversations(prev => sortConversations([newConv, ...prev]));
    setSelected(newConv);
  };

  if (mobileView) {
    if (!selected) {
      return (
        <div className="min-h-screen bg-background flex flex-col">
          <div className="mb-4 px-4 pt-4">
            <h1 className="text-2xl font-bold text-foreground">{t('Messages')}</h1>
            <p className="text-muted-foreground text-sm">{t('Select a conversation to start chatting')}</p>
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
              typing={typing}
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
              typing={typing}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-lg">
              {t('Select a conversation to start chatting')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
