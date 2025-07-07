import React from 'react';

export default function TypingIndicator({ message = "Someone is typing..." }) {
  return (
    <div className="flex items-center gap-2 px-4 py-2">
      <div className="typing-indicator">
        <div className="typing-dot"></div>
        <div className="typing-dot"></div>
        <div className="typing-dot"></div>
      </div>
      <span className="text-xs text-muted-foreground">{message}</span>
    </div>
  );
} 