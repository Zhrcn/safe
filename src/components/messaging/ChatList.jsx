import React from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Search, Plus, MessageCircle, Dot } from "lucide-react";
import { useTranslation } from 'react-i18next';

export default function ChatList({ conversations, selectedId, onSelect, searchTerm, setSearchTerm, onNewChat, isTyping, unreadCounts }) {
  const { t } = useTranslation('common');
  return (
    <div className="relative h-full flex flex-col bg-background rounded-2xl shadow-lg overflow-hidden">
      <div className="p-4 pb-2 bg-background sticky top-0 z-10">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder={t('patient.medications.messages.search_placeholder')}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-12 pr-4 py-2 rounded-full bg-muted/70 border border-border focus:ring-2 focus:ring-primary text-base shadow-sm"
          />
        </div>
      </div>
      <div className="h-1 w-full bg-gradient-to-r from-primary/10 to-secondary/10 my-1" />
      <div className="flex-1 overflow-y-auto px-2 pb-4">
        {conversations.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <MessageCircle className="w-10 h-10 mb-2" />
            <span className="font-medium">No conversations yet</span>
            <span className="text-xs mt-1">{t('patient.medications.messages.start_new_chat')}</span>
          </div>
        )}
        {conversations.map((conv, idx) => {
          const conversationId = conv._id || conv.id;
          const lastTime = conv.lastMessageTime ? new Date(conv.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "";
          let lastMsgPrefix = "";
          if (conv.lastMessage) {
            if (conv.messages && conv.messages.length > 0) {
              const lastMsg = conv.messages[conv.messages.length - 1];
              lastMsgPrefix = lastMsg.sender === "You" ? "You: " : `${lastMsg.sender?.split(" ")[0] || "User"}: `;
            }
          }
          const isSelected = selectedId === conversationId;
          const isUnread = (unreadCounts && unreadCounts[conversationId]) || conv.unreadCount > 0;
          return (
            <React.Fragment key={conversationId}>
              <div
                className={`group flex items-center gap-4 px-4 py-3 cursor-pointer transition-all ${isSelected ? "bg-primary/10 shadow-lg" : "hover:bg-muted/60"} ${isUnread && !isSelected ? "ring-2 ring-primary/30" : ""}`}
                style={{ borderRadius: isSelected ? 16 : 0 }}
                onClick={() => onSelect(conv)}
              >
                <Avatar className={`h-12 w-12 shadow ${isUnread ? "ring-2 ring-primary/60" : ""}`}>
                  <AvatarImage src={conv.avatar} alt={conv.title} />
                  <AvatarFallback className="bg-primary/10 text-primary font-bold">
                    {conv.title?.split(" ").map(w => w[0]).join("") || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className={`font-semibold truncate text-base ${isUnread ? "text-foreground" : "text-muted-foreground"}`}>{conv.title || "Unknown"}</span>
                    <span className="text-xs text-muted-foreground ml-2 whitespace-nowrap">{lastTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`truncate text-sm ${isUnread ? "font-medium text-foreground" : "text-muted-foreground"}`}>
                      <span className="text-xs text-muted-foreground">{lastMsgPrefix}</span>{conv.lastMessage || t('patient.medications.messages.no_messages')}
                    </span>
                    {isUnread && (
                      <span className="ml-2 min-w-[22px] h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center px-2 font-bold shadow">
                        {(unreadCounts && unreadCounts[conversationId]) || conv.unreadCount}
                      </span>
                    )}
                    {isTyping && isSelected && (
                      <span className="ml-2 flex items-center text-xs text-primary animate-pulse"><Dot className="w-5 h-5" /> typing...</span>
                    )}
                  </div>
                </div>
              </div>
              {idx < conversations.length - 1 && (
                <div className="mx-4 border-b border-border opacity-60" />
              )}
            </React.Fragment>
          );
        })}
      </div>
      <button
        onClick={onNewChat}
        className="flex items-center justify-center fixed bottom-8 right-8 z-20 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-xl hover:bg-primary/90 transition border-4 border-background"
        aria-label={t('patient.medications.messages.start_new_chat')}
        type="button"
      >
        <Plus className="w-7 h-7" />
      </button>
    </div>
  );
} 