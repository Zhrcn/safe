"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { conversations as mockConversations } from "@/mockdata/conversations";
import ChatList from "@/components/messaging/ChatList";
import ChatPage from "@/components/messaging/ChatPage";

export default function DoctorMessagingPage() {
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
    // Placeholder for new chat logic
    alert("Start a new chat (not implemented)");
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