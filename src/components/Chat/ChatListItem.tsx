import { UserCircleIcon } from "@heroicons/react/24/solid";
import { EllipsisVerticalIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useNavigate, useParams } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { useState, useRef, useEffect } from "react";

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
  canDelete?: boolean;
  onDelete?: (chatId: string) => void;
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
  canDelete = false,
  onDelete,
}: ChatListItemProps) => {
  const navigate = useNavigate();
  const { chatId: activeChatId } = useParams();
  const isSelected = activeChatId === chatId;
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(false);
    onDelete?.(chatId);
  };

  return (
    <div
      onClick={handleClick}
      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors group relative ${
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
          <div className="flex items-center gap-1 flex-shrink-0 ml-2">
            <span className="text-xs text-base-content/60">
              {formatTime(lastMessageTime)}
            </span>

            {/* Three-dot menu */}
            {canDelete && (
              <div ref={menuRef} className="relative">
                <button
                  onClick={handleMenuClick}
                  className="p-1 rounded-full opacity-0 group-hover:opacity-100 hover:bg-base-300 transition-opacity"
                  title="Chat options"
                >
                  <EllipsisVerticalIcon className="w-4 h-4 text-base-content/60" />
                </button>

                {/* Dropdown menu */}
                {showMenu && (
                  <div className="absolute right-0 top-full mt-1 bg-base-100 rounded-lg shadow-lg border border-base-200 py-1 z-50 min-w-[140px]">
                    <button
                      onClick={handleDeleteClick}
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-error hover:bg-base-200 transition-colors"
                    >
                      <TrashIcon className="w-4 h-4" />
                      Delete Chat
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
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
