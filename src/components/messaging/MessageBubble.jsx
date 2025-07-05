import React, { useState, useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Check, CheckCheck, MoreVertical, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function MessageBubble({ message, isOwn, showAvatar, onDeleteMessage }) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);
  const time = new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return (
    <div className={`flex items-end gap-2 mb-2 ${isOwn ? "justify-end" : "justify-start"}`}>
      {!isOwn && showAvatar && (
        <Avatar className="h-7 w-7">
          <AvatarImage src={message.avatar} alt={message.sender} />
          <AvatarFallback className="bg-primary/10 text-primary font-bold">{message.sender?.[0]}</AvatarFallback>
        </Avatar>
      )}
      <div className={`max-w-[75%] px-2 flex flex-col ${isOwn ? "items-end" : "items-start"} relative group`}>
        <div className={`px-5 py-2 ${isOwn ? "rounded-3xl rounded-br-md bg-primary text-primary-foreground shadow-lg" : "rounded-2xl rounded-bl-md bg-muted/70 text-foreground border border-border"} animate-fade-in relative`}>
          <span className="text-sm break-words whitespace-pre-line leading-relaxed">{message.content}</span>
          
          {/* Message menu for own messages */}
          {isOwn && (
            <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6 text-muted-foreground hover:text-destructive"
                onClick={() => setShowMenu(!showMenu)}
              >
                <MoreVertical className="w-3 h-3" />
              </Button>
              
              {showMenu && (
                <div ref={menuRef} className="absolute right-0 top-8 bg-background border border-border rounded-lg shadow-lg z-10 min-w-[120px]">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => {
                      if (onDeleteMessage && window.confirm('Are you sure you want to delete this message?')) {
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