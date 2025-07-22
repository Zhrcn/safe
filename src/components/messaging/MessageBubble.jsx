import React, { useState, useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage, getInitialsFromName, getImageUrl } from "@/components/ui/Avatar";
import { Check, CheckCheck, MoreVertical, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function MessageBubble({ message, isOwn, showAvatar, onDeleteMessage, participants }) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  // Helper to get sender object with image from participants if needed
  function getSenderWithImage(sender) {
    if (typeof sender === 'object' && (sender.profileImage || sender.avatar)) return sender;
    if (participants && typeof sender === 'string') {
      return participants.find(p => p._id === sender || p.id === sender) || sender;
    }
    return sender;
  }

  const sender = getSenderWithImage(message.sender);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    if (showMenu && typeof document !== 'undefined') {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      if (typeof document !== 'undefined') {
        document.removeEventListener('mousedown', handleClickOutside);
      }
    };
  }, [showMenu]);
  const time = new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return (
    <div className={`flex items-end gap-2 mb-2 ${isOwn ? "justify-end" : "justify-start"}`}>
      {!isOwn && showAvatar && (
        <Avatar className="h-7 w-7">
          {(() => {
            let img = null;
            let initials = '';
            if (sender && typeof sender === 'object') {
              img = sender.profileImage ? getImageUrl(sender.profileImage) : (sender.avatar ? getImageUrl(sender.avatar) : null);
              initials = getInitialsFromName(sender.firstName || sender.name || '');
            } else {
              img = message.avatar ? getImageUrl(message.avatar) : null;
              initials = getInitialsFromName(sender);
            }
            return img ? (
              <AvatarImage src={img} alt={typeof sender === 'object' ? (sender.firstName || sender.name || '') : sender} />
            ) : (
              <AvatarFallback className="bg-primary/10 text-primary font-bold">{initials}</AvatarFallback>
            );
          })()}
        </Avatar>
      )}
      <div className={`max-w-[75%] px-2 flex flex-col ${isOwn ? "items-end" : "items-start"} relative group`}>
        <div className={`px-5 py-2 ${isOwn ? "rounded-3xl rounded-br-md bg-primary text-primary-foreground shadow-lg" : "rounded-2xl rounded-bl-md bg-muted text-foreground border border-border shadow-sm"} animate-fade-in relative`}>
          <span className="text-sm break-words whitespace-pre-line leading-relaxed">{message.content}</span>
          {isOwn && (
            <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6 text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10"
                onClick={() => setShowMenu(!showMenu)}
              >
                <MoreVertical className="w-3 h-3" />
              </Button>
              {showMenu && (
                <div ref={menuRef} className="absolute right-0 top-8 bg-background border border-border rounded-lg shadow-lg z-10 min-w-[120px]">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-danger hover:text-danger hover:bg-danger/10"
                    onClick={() => {
                      if (onDeleteMessage && typeof window !== 'undefined' && window.confirm('Are you sure you want to delete this message?')) {
                        onDeleteMessage(message._id || message.id);
                      }
                      setShowMenu(false);
                    }}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground opacity-70">
          <span>{time}</span>
          {isOwn && (
            <span className="ml-1">{message.read ? <CheckCheck className="inline w-4 h-4" /> : <Check className="inline w-4 h-4" />}</span>
          )}
        </div>
      </div>
      {!isOwn && !showAvatar && <div className="h-7 w-7" />}
    </div>
  );
}