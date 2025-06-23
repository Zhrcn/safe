"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { conversations as mockConversations } from "@/mockdata/conversations";
import ChatList from "@/components/messaging/ChatList";
import ChatPage from "@/components/messaging/ChatPage";
import { MessageCircle } from "lucide-react";

export default function PatientMessagingPage() {
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
    alert("Start a new chat (not implemented)");
  };

  if (mobileView) {
    if (!selected) {
      return (
        <div className="min-h-screen bg-background p-2">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground">Messages</h1>
            <p className="text-muted-foreground text-sm">Select a conversation to start chatting.</p>
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
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Messages</h1>
          <p className="text-muted-foreground text-base">Chat securely with your healthcare providers.</p>
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
                  <div className="font-semibold mb-1">No conversation selected</div>
                  <div className="text-sm text-muted-foreground">Select a conversation from the list to start chatting.</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 