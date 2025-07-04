import React, { useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Paperclip, Smile, Send } from "lucide-react";
import { useTranslation } from 'react-i18next';

export default function MessageInput({ value, onChange = () => {}, onSend, disabled }) {
  const { t } = useTranslation('common');
  const textareaRef = useRef(null);

  const handleInput = e => {
    onChange(e.target.value);
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
  };

  const handleKeyDown = e => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <form
      onSubmit={e => { e.preventDefault(); onSend(); }}
      className="flex items-end gap-2 p-4 border-t border-border bg-background sticky bottom-0 z-20 shadow-md"
      aria-label="Message input area"
    >
      <Button type="button" size="icon" variant="ghost" className="text-muted-foreground" aria-label={t('patient.medications.messages.attach_file', 'Attach file')}>
        <Paperclip className="w-5 h-5" />
      </Button>
      <Button type="button" size="icon" variant="ghost" className="text-muted-foreground" aria-label={t('patient.medications.messages.emoji_picker', 'Emoji picker')}>
        <Smile className="w-5 h-5" />
      </Button>
      <textarea
        ref={textareaRef}
        rows={1}
        placeholder="Type a message..."
        value={value}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        className="flex-1 rounded-full border border-border focus:border-primary focus:ring-primary/20 resize-none bg-muted/60 px-5 py-2 text-base min-h-[44px] max-h-32 shadow-sm"
        aria-label="Type a message"
      />
      <Button type="submit" size="icon" disabled={disabled} className="bg-primary text-primary-foreground rounded-full" aria-label="Send message">
        <Send className="w-5 h-5" />
      </Button>
    </form>
  );
} 