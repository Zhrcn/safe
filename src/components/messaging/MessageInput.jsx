import React, { useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Paperclip, Smile, Send } from "lucide-react";

export default function MessageInput({ value, onChange, onSend, disabled }) {
  const textareaRef = useRef(null);

  // Auto-grow textarea
  const handleInput = e => {
    onChange(e.target.value);
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
  };

  // Send on Enter, new line on Shift+Enter
  const handleKeyDown = e => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <form
      onSubmit={e => { e.preventDefault(); onSend(); }}
      className="flex items-end gap-2 p-3 border-t border-border bg-background sticky bottom-0 z-10"
      aria-label="Message input area"
    >
      <Button type="button" size="icon" variant="ghost" className="text-muted-foreground" aria-label="Attach file">
        <Paperclip className="w-5 h-5" />
      </Button>
      <Button type="button" size="icon" variant="ghost" className="text-muted-foreground" aria-label="Emoji picker">
        <Smile className="w-5 h-5" />
      </Button>
      <textarea
        ref={textareaRef}
        rows={1}
        placeholder="Type your message..."
        value={value}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        className="flex-1 rounded-full border-border focus:border-primary focus:ring-primary/20 resize-none bg-muted/40 px-4 py-2 text-sm min-h-[40px] max-h-32"
        aria-label="Type a message"
      />
      <Button type="submit" size="icon" disabled={disabled} className="bg-primary text-primary-foreground rounded-full" aria-label="Send message">
        <Send className="w-5 h-5" />
      </Button>
    </form>
  );
} 