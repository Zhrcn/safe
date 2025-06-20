import React, { useRef, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { ArrowLeft, MoreVertical, Circle } from "lucide-react";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import { ScrollArea } from "@/components/ui/ScrollArea";

function formatDate(date) {
  const today = new Date();
  if (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  ) {
    return "Today";
  }
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
  ) {
    return "Yesterday";
  }
  return date.toLocaleDateString();
}

export default function ChatPage({ conversation, onSend, newMessage, setNewMessage, isMobile, onBack, typing }) {
  const messagesEndRef = useRef(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  // Group messages and add date separators
  const grouped = [];
  let lastSender = null;
  let lastDate = null;
  conversation.messages.forEach((msg, idx) => {
    const msgDate = new Date(msg.timestamp);
    const dateStr = formatDate(msgDate);
    if (!lastDate || dateStr !== lastDate) {
      grouped.push({ type: "date", date: dateStr, key: `date-${dateStr}-${idx}` });
      lastDate = dateStr;
    }
    if (msg.sender !== lastSender) {
      grouped.push({ type: "bubble", msg, showAvatar: true, key: msg.id || idx });
      lastSender = msg.sender;
    } else {
      grouped.push({ type: "bubble", msg, showAvatar: false, key: msg.id || idx });
    }
  });

  return (
    <div className="flex flex-col h-full bg-background rounded-2xl shadow-md overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border sticky top-0 z-10 bg-gradient-to-r from-primary/10 to-secondary/10">
        {isMobile && (
          <Button size="icon" variant="ghost" onClick={onBack} className="mr-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        )}
        <Avatar className="h-10 w-10 border-2 border-primary/20 relative">
          <AvatarImage src={conversation.avatar} alt={conversation.title} />
          <AvatarFallback className="bg-primary text-primary">
            {conversation.title[0]}
          </AvatarFallback>
          {/* Online status dot (mocked as online) */}
          <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-background" />
        </Avatar>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground truncate">{conversation.title}</h3>
          <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
            <Circle className="w-2 h-2 text-green-500" /> Online
          </p>
        </div>
        <Button size="icon" variant="ghost" className="text-primary hover:bg-primary/10">
          <MoreVertical className="w-5 h-5" />
        </Button>
      </div>
      {/* Messages */}
      <ScrollArea className="flex-1 px-2 py-4 bg-background">
        <div className="flex flex-col gap-1">
          {grouped.map((item, idx) => {
            if (item.type === "date") {
              return (
                <div key={item.key} className="flex justify-center my-4">
                  <span className="px-3 py-1 rounded-full bg-muted text-xs text-muted-foreground shadow-sm">
                    {item.date}
                  </span>
                </div>
              );
            }
            return (
              <div key={item.key} className="transition-all duration-300 animate-fade-in">
                <MessageBubble message={item.msg} isOwn={item.msg.sender === "You"} showAvatar={item.showAvatar} />
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
        {/* Typing indicator (mocked) */}
        {typing && (
          <div className="flex items-center gap-2 mt-2 px-4">
            <span className="w-2 h-2 rounded-full bg-muted animate-bounce" />
            <span className="w-2 h-2 rounded-full bg-muted animate-bounce delay-100" />
            <span className="w-2 h-2 rounded-full bg-muted animate-bounce delay-200" />
            <span className="text-xs text-muted-foreground ml-2">Someone is typing...</span>
          </div>
        )}
      </ScrollArea>
      {/* Input */}
      <MessageInput
        value={newMessage}
        onChange={setNewMessage}
        onSend={onSend}
        disabled={!newMessage.trim()}
      />
    </div>
  );
} 