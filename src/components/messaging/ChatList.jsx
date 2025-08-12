import React, { useEffect, useState } from "react";
import axiosInstance from "@/store/services/axiosInstance";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Avatar, AvatarFallback, AvatarImage, getInitialsFromName, getImageUrl } from "@/components/ui/Avatar";
import { Search, MessageCircle, Dot } from "lucide-react";
import { useTranslation } from 'react-i18next';

export default function ChatList({ conversations, selectedId, onSelect, searchTerm, setSearchTerm, onNewChat, isTyping, unreadCounts, currentUser }) {
  const { t } = useTranslation('common');
  const [userImages, setUserImages] = useState({});

  useEffect(() => {
    const ids = new Set();
    conversations.forEach(conv => {
      if (conv.participants) {
        conv.participants.forEach(p => {
          if (p && (p._id || p.id)) {
            ids.add(p._id || p.id);
          }
        });
      }
    });
    const missingIds = Array.from(ids).filter(id => !userImages[id]);
    if (missingIds.length > 0) {
      Promise.all(
        missingIds.map(id =>
          axiosInstance.get(`/users/${id}`).then(res => ({ id, data: res.data.data })).catch(() => null)
        )
      ).then(results => {
        const newImages = {};
        results.forEach(r => {
          if (r && r.id && r.data) newImages[r.id] = r.data;
        });
        setUserImages(prev => ({ ...prev, ...newImages }));
      });
    }
  }, [conversations]);

  return (
    <div className="h-full flex flex-col bg-card">
      <div className="p-4 pb-2 bg-card flex-shrink-0">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder={t('patient.medications.messages.search_placeholder')}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-12 pr-4 py-2 rounded-full bg-background border border-border focus:ring-2 focus:ring-primary text-base shadow-sm"
          />
        </div>
      </div>
      <div className="h-1 w-full bg-gradient-to-r from-primary/10 to-secondary/10 mx-4" />
      <div className="flex-1 overflow-y-auto px-2 pb-4 chat-scroll">
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
              let senderName = "User";
              if (lastMsg.sender === "You") {
                senderName = "You";
              } else if (typeof lastMsg.sender === "string") {
                if (currentUser && lastMsg.sender === currentUser._id) {
                  senderName = "You";
                } else {
                  senderName = lastMsg.sender.split(" ")[0];
                }
              } else if (lastMsg.sender && typeof lastMsg.sender === "object") {
                if (currentUser && lastMsg.sender._id === currentUser._id) {
                  senderName = "You";
                } else {
                  senderName = lastMsg.sender.firstName || lastMsg.sender.name || "User";
                }
              }
              lastMsgPrefix = `${senderName}: `;
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
                  {(() => {
                    let img = null;
                    let initials = '';
                    let other = null;
                    if (conv.participants && Array.isArray(conv.participants)) {
                      const currentId = currentUser?._id || currentUser?.id;
                      other = conv.participants.find(p => (p._id || p.id) && (p._id || p.id) !== currentId);
                    }
                    let userProfile = other && userImages[other._id || other.id];
                    if (userProfile && (userProfile.profileImage || userProfile.avatar)) {
                      img = userProfile.profileImage ? getImageUrl(userProfile.profileImage) : getImageUrl(userProfile.avatar);
                      initials = getInitialsFromName(userProfile.firstName || userProfile.name || conv.title);
                    } else if (other && (other.profileImage || other.avatar)) {
                      img = other.profileImage ? getImageUrl(other.profileImage) : getImageUrl(other.avatar);
                      initials = getInitialsFromName(other.firstName || other.name || conv.title);
                    } else if (conv.avatar) {
                      img = getImageUrl(conv.avatar);
                      initials = getInitialsFromName(conv.title);
                    } else {
                      initials = getInitialsFromName(conv.title);
                    }
                    return img ? (
                      <AvatarImage src={img} alt={other ? (other.firstName || other.name || conv.title) : conv.title} />
                    ) : (
                      <AvatarFallback className="bg-primary/10 text-primary font-bold">
                        {initials || "U"}
                      </AvatarFallback>
                    );
                  })()}
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className={`font-semibold truncate text-base ${isUnread ? "text-foreground" : "text-muted-foreground"}`}>{conv.title || "Unknown"}</span>
                    <span className="text-xs text-muted-foreground ml-2 whitespace-nowrap">{lastTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`truncate text-sm ${isUnread ? "font-medium text-foreground" : "text-muted-foreground"}`}>
                      <span className="text-xs text-muted-foreground">{lastMsgPrefix}</span>
                      {typeof conv.lastMessage === 'string' 
                        ? conv.lastMessage 
                        : (conv.lastMessage?.content || t('patient.medications.messages.no_messages'))}
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

    </div>
  );
} 