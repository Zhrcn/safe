"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { conversations as mockConversations } from "@/mockdata/conversations";
import ChatList from "@/components/messaging/ChatList";
import ChatPage from "@/components/messaging/ChatPage";

function getUnreadCount(messages) {
  return messages.filter(m => !m.read && m.sender !== "You").length;
}

function sortConversations(convs) {
  return [...convs].sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime));
}

export default function PharmacistMessagingPage() {
  const [conversations, setConversations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [mobileView, setMobileView] = useState(false);
  const [typing, setTyping] = useState(false);
  const router = useRouter();
  const typingTimeout = useRef(null);

  useEffect(() => {
    // Add unreadCount to each conversation
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

  // Mark messages as read when opening a chat
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

  // Mock: show typing indicator after 2s of opening a chat, hide after 3s
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
    // Add new message to selected conversation
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
    // Simulate a reply after 1.5s
    setTimeout(() => {
      const reply = {
        id: Date.now() + 1,
        content: "This is an automated reply!",
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
    // Mock: add a new conversation
    const newId = Date.now();
    const newConv = {
      id: newId,
      title: `New Contact ${newId % 1000}`,
      subtitle: "New chat started",
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
        <div className="min-h-screen bg-background p-2">
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
            typing={typing}
          />
        </div>
      );
    }
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto grid grid-cols-12 gap-4 h-[calc(100vh-120px)]">
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
            <div className="flex items-center justify-center h-full text-muted-foreground text-lg">
              Select a conversation to start chatting.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
