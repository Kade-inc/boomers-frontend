import { UserCircleIcon } from "@heroicons/react/24/solid";
import { useNavigate, useParams } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

interface ChatListItemProps {
  chatId: string;
  name: string;
  avatarUrl?: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
  isRead?: boolean;
  isGroup?: boolean;
  groupColor?: string;
}

const ChatListItem = ({
  chatId,
  name,
  avatarUrl,
  lastMessage,
  lastMessageTime,
  unreadCount = 0,
  isGroup = false,
  groupColor,
}: ChatListItemProps) => {
  const navigate = useNavigate();
  const { chatId: activeChatId } = useParams();
  const isSelected = activeChatId === chatId;

  const handleClick = () => {
    navigate(`/chat/${chatId}`);
  };

  const formatTime = (dateString?: string) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: false });
    } catch {
      return "";
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
        isSelected
          ? "bg-yellow/20 border-l-4 border-yellow"
          : "hover:bg-base-200"
      }`}
    >
      {/* Avatar */}
      <div className="flex-shrink-0">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={name}
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : isGroup ? (
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold"
            style={{ background: groupColor || "#6366f1" }}
          >
            {name.charAt(0).toUpperCase()}
          </div>
        ) : (
          <UserCircleIcon className="w-12 h-12 text-base-content/50" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-base-content truncate">
            {name}
          </span>
          <span className="text-xs text-base-content/60 flex-shrink-0 ml-2">
            {formatTime(lastMessageTime)}
          </span>
        </div>
        <div className="flex items-center justify-between mt-1">
          <p className="text-sm text-base-content/60 truncate">
            {lastMessage || "No messages yet"}
          </p>
          <div className="flex items-center gap-1 flex-shrink-0 ml-2">
            {unreadCount > 0 ? (
              <span className="bg-yellow text-darkgrey text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            ) : lastMessage ? (
              <svg
                className="w-4 h-4 text-base-content/40"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatListItem;
