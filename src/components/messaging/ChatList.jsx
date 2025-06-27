import React from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Search, Plus, MessageCircle } from "lucide-react";

export default function ChatList({ conversations, selectedId, onSelect, searchTerm, setSearchTerm, onNewChat }) {
  return (
    <div className="relative h-full flex flex-col">
      <div className="p-4 pb-2 bg-background sticky top-0 z-10">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search chats..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-10 rounded-full bg-muted/60 border-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-1">
        {conversations.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <MessageCircle className="w-10 h-10 mb-2" />
            <span className="font-medium">No conversations found</span>
            <span className="text-xs mt-1">Start a new chat to connect with someone!</span>
          </div>
        )}
        {conversations.map(conv => {
          const lastTime = conv.lastMessageTime ? new Date(conv.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "";
          let lastMsgPrefix = "";
          if (conv.lastMessage) {
            if (conv.messages && conv.messages.length > 0) {
              const lastMsg = conv.messages[conv.messages.length - 1];
              lastMsgPrefix = lastMsg.sender === "You" ? "You: " : `${lastMsg.sender.split(" ")[0]}: `;
            }
          }
          return (
            <Card
              key={conv.id}
              className={`group flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer transition-all border-2 shadow-none hover:shadow-md hover:border-primary/60 ${selectedId === conv.id ? "border-primary bg-accent/80 shadow-lg" : "border-transparent bg-transparent"}`}
              onClick={() => onSelect(conv)}
            >
              <Avatar className="h-11 w-11">
                <AvatarImage src={conv.avatar} alt={conv.title} />
                <AvatarFallback className="bg-primary text-primary font-bold">
                  {conv.title.split(" ").map(w => w[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className={`font-semibold truncate ${conv.unreadCount > 0 ? "text-foreground" : "text-muted-foreground"}`}>{conv.title}</span>
                  <span className="text-xs text-muted-foreground ml-2">{lastTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`truncate text-sm ${conv.unreadCount > 0 ? "font-medium text-foreground" : "text-muted-foreground"}`}>
                    <span className="text-xs text-muted-foreground">{lastMsgPrefix}</span>{conv.lastMessage || "No messages"}
                  </span>
                  {conv.unreadCount > 0 && (
                    <span className="ml-2 min-w-[20px] h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center px-2 font-bold">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
      <button
        onClick={onNewChat}
        className="hidden md:flex items-center justify-center fixed bottom-8 right-8 z-20 w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition"
        aria-label="New chat"
        type="button"
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
} 