import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Check, CheckCheck } from "lucide-react";

export default function MessageBubble({ message, isOwn, showAvatar }) {
  const time = new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return (
    <div className={`flex items-end gap-2 mb-2 ${isOwn ? "justify-end" : "justify-start"}`}>
      {!isOwn && showAvatar && (
        <Avatar className="h-7 w-7">
          <AvatarImage src={message.avatar} alt={message.sender} />
          <AvatarFallback className="bg-primary/10 text-primary font-bold">{message.sender?.[0]}</AvatarFallback>
        </Avatar>
      )}
      <div className={`max-w-[75%] px-2 flex flex-col ${isOwn ? "items-end" : "items-start"}`}>
        <div className={`px-5 py-2 ${isOwn ? "rounded-3xl rounded-br-md bg-primary text-primary-foreground shadow-lg" : "rounded-2xl rounded-bl-md bg-muted/70 text-foreground border border-border"} animate-fade-in`}>
          <span className="text-sm break-words whitespace-pre-line leading-relaxed">{message.content}</span>
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