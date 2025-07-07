import React, { useRef, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { ArrowLeft, MoreVertical, Circle, Trash2 } from "lucide-react";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import { ScrollArea } from "@/components/ui/ScrollArea";
import { useTranslation } from 'react-i18next';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import TypingIndicator from './TypingIndicator';

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

export default function ChatPage({ conversation, onSend, newMessage, onInputChange, isMobile, onBack, isTyping, onDelete, onDeleteMessage, currentUser, loading, error }) {
  const { t } = useTranslation('common');
  const messagesEndRef = useRef(null);
  
  const { isOtherParticipantOnline } = useOnlineStatus(conversation, currentUser?._id);
  
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  if (loading) {
    return (
      <div className="flex flex-col h-full bg-card rounded-2xl shadow-lg overflow-hidden border border-border">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-border bg-gradient-to-r from-primary/10 to-secondary/10 shadow-sm flex-shrink-0">
          {isMobile && (
            <Button size="icon" variant="ghost" onClick={onBack} className="mr-2">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          )}
          <Avatar className="h-12 w-12 border-2 border-primary/20 relative shadow">
            <AvatarImage src={conversation?.avatar} alt={conversation?.title} />
            <AvatarFallback className="bg-primary/10 text-primary font-bold">
              {conversation?.title?.[0] || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg text-foreground truncate">{conversation?.title || "Unknown"}</h3>
            <p className="text-xs text-muted-foreground truncate">Loading messages...</p>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center overflow-hidden bg-background">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-muted-foreground">Loading messages...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-full bg-background rounded-2xl shadow-lg overflow-hidden border border-border">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-border bg-gradient-to-r from-primary/10 to-secondary/10 shadow-sm flex-shrink-0">
          {isMobile && (
            <Button size="icon" variant="ghost" onClick={onBack} className="mr-2">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          )}
          <Avatar className="h-12 w-12 border-2 border-primary/20 relative shadow">
            <AvatarImage src={conversation?.avatar} alt={conversation?.title} />
            <AvatarFallback className="bg-primary/10 text-primary font-bold">
              {conversation?.title?.[0] || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg text-foreground truncate">{conversation?.title || "Unknown"}</h3>
            <p className="text-xs text-red-500 truncate">Error loading messages</p>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center overflow-hidden">
          <div className="text-center">
            <p className="text-red-500 mb-2">Failed to load messages</p>
            <p className="text-muted-foreground text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const grouped = [];
  let lastSender = null;
  let lastDate = null;
  
  if (conversation?.messages && Array.isArray(conversation.messages)) {
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
  }

  return (
    <div className="flex flex-col h-full bg-card rounded-2xl shadow-lg overflow-hidden border border-border">
      {/* Fixed Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-border bg-gradient-to-r from-primary/10 to-secondary/10 shadow-sm flex-shrink-0 z-10">
        {isMobile && (
          <Button size="icon" variant="ghost" onClick={onBack} className="mr-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        )}
        <Avatar className="h-12 w-12 border-2 border-primary/20 relative shadow">
          <AvatarImage src={conversation?.avatar} alt={conversation?.title} />
          <AvatarFallback className="bg-primary/10 text-primary font-bold">
            {conversation?.title?.[0] || "U"}
          </AvatarFallback>
          <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background ${
            isOtherParticipantOnline ? 'bg-green-500' : 'bg-muted-foreground'
          }`} />
        </Avatar>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg text-foreground truncate">{conversation?.title || "Unknown"}</h3>
          <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
            <Circle className={`w-2 h-2 ${
              isOtherParticipantOnline ? 'text-green-500' : 'text-muted-foreground'
            }`} /> 
            {isOtherParticipantOnline 
              ? t('patient.medications.messages.online', 'Online') 
              : t('patient.medications.messages.offline', 'Offline')
            }
          </p>
        </div>
        <Button 
          size="icon" 
          variant="ghost" 
          className="text-destructive hover:bg-destructive/10" 
          onClick={() => {
            if (onDelete) {
              onDelete(conversation._id);
            }
          }} 
          title="Delete Chat"
        >
          <Trash2 className="w-5 h-5" />
        </Button>
      </div>

      {/* Scrollable Messages Area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden chat-scroll bg-background">
        <div className="px-4 py-6">
          <div className="flex flex-col gap-2">
            {grouped.length === 0 ? (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <p>No messages yet. Start the conversation!</p>
              </div>
            ) : (
              grouped.map((item, idx) => {
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
                    <MessageBubble 
                      message={item.msg} 
                      isOwn={
                        item.msg.sender === "You" || 
                        (currentUser && (
                          item.msg.sender === currentUser._id || 
                          (typeof item.msg.sender === 'object' && item.msg.sender._id === currentUser._id)
                        ))
                      } 
                      showAvatar={item.showAvatar}
                      onDeleteMessage={onDeleteMessage}
                    />
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>
          {isTyping && <TypingIndicator />}
        </div>
      </div>

      {/* Fixed Input Area */}
      <div className="flex-shrink-0">
        <MessageInput
          value={newMessage}
          onChange={onInputChange}
          onSend={onSend}
          disabled={!newMessage.trim()}
        />
      </div>
    </div>
  );
} 