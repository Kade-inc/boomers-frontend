import { UserCircleIcon } from "@heroicons/react/24/solid";
import { format, isToday, isYesterday, isThisWeek } from "date-fns";
import useAuthStore from "../../stores/useAuthStore";

interface ChatMessageProps {
  messageId: string;
  senderId: string;
  text: string;
  createdAt: string;
  senderName?: string;
  senderAvatar?: string;
  isRead?: boolean;
}

const ChatMessage = ({
  senderId,
  text,
  createdAt,
  senderName,
  senderAvatar,
  isRead = false,
}: ChatMessageProps) => {
  const { user } = useAuthStore();
  const isOwn = senderId === user?.user_id;

  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "HH:mm");
    } catch {
      return "";
    }
  };

  return (
    <div
      className={`flex gap-2 mb-4 ${isOwn ? "flex-row-reverse" : "flex-row"}`}
    >
      {/* Avatar - only show for incoming messages */}
      {!isOwn && (
        <div className="flex-shrink-0 self-end">
          {senderAvatar ? (
            <img
              src={senderAvatar}
              alt={senderName || "User"}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <UserCircleIcon className="w-8 h-8 text-base-content/50" />
          )}
        </div>
      )}

      {/* Message Bubble */}
      <div className={`max-w-[70%] ${isOwn ? "items-end" : "items-start"}`}>
        <div
          className={`px-4 py-2 rounded-2xl ${
            isOwn
              ? "bg-teal-500 text-white rounded-br-sm"
              : "bg-base-content/10 text-base-content rounded-bl-sm"
          }`}
        >
          <p className="text-sm whitespace-pre-wrap break-words">{text}</p>
        </div>

        {/* Timestamp and Read Receipt */}
        <div
          className={`flex items-center gap-1 mt-1 text-xs text-base-content/50 ${
            isOwn ? "justify-end" : "justify-start"
          }`}
        >
          <span>{formatTime(createdAt)}</span>
          {isOwn && (
            <span className="ml-1">
              {isRead ? (
                <svg
                  className="w-4 h-4 text-blue-500"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M18 7l-1.41-1.41-6.34 6.34 1.41 1.41L18 7zm4.24-1.41L11.66 16.17 7.48 12l-1.41 1.41L11.66 19l12-12-1.42-1.41zM.41 13.41L6 19l1.41-1.41L1.83 12 .41 13.41z" />
                </svg>
              ) : (
                <svg
                  className="w-4 h-4 text-base-content/40"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

// Date separator component
export const DateSeparator = ({ date }: { date: string }) => {
  const formatDate = (dateString: string) => {
    try {
      const dateObj = new Date(dateString);
      if (isToday(dateObj)) return "Today";
      if (isYesterday(dateObj)) return "Yesterday";
      if (isThisWeek(dateObj)) return format(dateObj, "EEEE"); // Day name
      return format(dateObj, "MMMM do"); // e.g., "January 22nd"
    } catch {
      return "";
    }
  };

  return (
    <div className="flex items-center justify-center my-4">
      <span className="px-4 py-1 bg-base-200 rounded-full text-xs text-base-content/60">
        {formatDate(date)}
      </span>
    </div>
  );
};

export default ChatMessage;
