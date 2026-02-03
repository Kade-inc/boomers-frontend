import { useState, useRef, KeyboardEvent } from "react";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onTyping?: () => void;
  onStopTyping?: () => void;
  disabled?: boolean;
  placeholder?: string;
}

const ChatInput = ({
  onSendMessage,
  onTyping,
  onStopTyping,
  disabled = false,
  placeholder = "Your message",
}: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage("");
      if (onStopTyping) onStopTyping();
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);

    // Handle typing indicator
    if (onTyping) {
      onTyping();
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing indicator
    if (onStopTyping) {
      typingTimeoutRef.current = setTimeout(() => {
        onStopTyping();
      }, 1000);
    }
  };

  return (
    <div className="flex items-center gap-2 p-4 bg-base-100 border-t border-base-200">
      <div className="flex-1 relative flex items-center">
        <textarea
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          className="textarea textarea-bordered w-full resize-none bg-base-100 focus:outline-none text-base-content min-h-[48px] max-h-[120px] py-3"
          style={{ height: "48px" }}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = "48px";
            target.style.height = `${Math.min(target.scrollHeight, 120)}px`;
          }}
        />
      </div>
      <button
        onClick={handleSend}
        disabled={!message.trim() || disabled}
        className="btn bg-yellow text-darkgrey hover:bg-yellow/80 min-h-[48px] px-4 disabled:opacity-50"
      >
        <span className="hidden md:inline mr-1">Send</span>
        <PaperAirplaneIcon className="w-5 h-5" />
      </button>
    </div>
  );
};

export default ChatInput;
