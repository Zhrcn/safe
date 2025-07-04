import React, { useRef, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { ArrowLeft, MoreVertical, Circle } from "lucide-react";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import { ScrollArea } from "@/components/ui/ScrollArea";
import { useTranslation } from 'react-i18next';

function formatDate(date, t) {
  const today = new Date();
  if (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  ) {
    return t('patient.medications.messages.today', 'Today');
  }
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
  ) {
    return 'Yesterday';
  }
  return date.toLocaleDateString();
}

export default function ChatPage({ conversation, onSend, newMessage, onInputChange, isMobile, onBack, isTyping }) {
  const { t } = useTranslation('common');
  const messagesEndRef = useRef(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  const grouped = [];
  let lastSender = null;
  let lastDate = null;
  conversation.messages.forEach((msg, idx) => {
    const msgDate = new Date(msg.timestamp);
    const dateStr = formatDate(msgDate, t);
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
    <div className="flex flex-col h-full bg-background rounded-2xl shadow-lg overflow-hidden border border-border">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-border sticky top-0 z-10 bg-gradient-to-r from-primary/10 to-secondary/10 shadow-sm">
        {isMobile && (
          <Button size="icon" variant="ghost" onClick={onBack} className="mr-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        )}
        <Avatar className="h-12 w-12 border-2 border-primary/20 relative shadow">
          <AvatarImage src={conversation.avatar} alt={conversation.title} />
          <AvatarFallback className="bg-primary/10 text-primary font-bold">
            {conversation.title?.[0] || "U"}
          </AvatarFallback>
          <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-background" />
        </Avatar>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg text-foreground truncate">{conversation.title || "Unknown"}</h3>
          <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
            <Circle className="w-2 h-2 text-green-500" /> {t('patient.medications.messages.online', 'Online')}
          </p>
        </div>
        <Button size="icon" variant="ghost" className="text-primary hover:bg-primary/10">
          <MoreVertical className="w-5 h-5" />
        </Button>
      </div>
      <ScrollArea className="flex-1 px-4 py-6 bg-background">
        <div className="flex flex-col gap-2">
          {grouped.map((item, idx) => {
            if (item.type === "date") {
              return (
                <div key={item.key} className="flex justify-center my-4">
                  <span className="px-4 py-1 rounded-full bg-muted text-xs text-muted-foreground shadow-sm">
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
        {isTyping && (
          <div className="text-xs text-muted-foreground px-4 pb-2">Someone is typing...</div>
        )}
      </ScrollArea>
      <MessageInput
        value={newMessage}
        onChange={onInputChange}
        onSend={onSend}
        disabled={!newMessage.trim()}
      />
    </div>
  );
} 