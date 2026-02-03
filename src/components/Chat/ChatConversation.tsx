import { useEffect, useRef, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeftIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import { useQueryClient } from "@tanstack/react-query";
import ChatMessage, { DateSeparator } from "./ChatMessage";
import ChatInput from "./ChatInput";
import ChatDetailsPanel from "./ChatDetailsPanel";
import { useGetMessages } from "../../hooks/Chats/useGetMessages";
import { useSendMessage } from "../../hooks/Chats/useSendMessage";
import { useSendFirstMessage } from "../../hooks/Chats/useSendFirstMessage";
import { useChatSocket } from "../../hooks/Chats/useChatSocket";
import useAuthStore from "../../stores/useAuthStore";
import { ChatMessage as ChatMessageType } from "../../entities/ChatMessage";
import { format } from "date-fns";

interface UserProfile {
  user_id: string;
  firstName: string;
  lastName: string;
  profile_picture?: string;
  role?: string;
  username?: string;
}

interface DetailsProfile {
  userId?: string;
  name: string;
  avatarUrl?: string;
  role?: string;
  isGroup?: boolean;
  groupColor?: string;
}

interface ChatConversationProps {
  chatId: string;
  otherMemberId?: string;
  otherMemberProfile?: UserProfile;
  isGroup?: boolean;
  groupName?: string;
  groupColor?: string;
  onShowDetails?: (show: boolean) => void;
  onSetDetailsProfile?: (profile: DetailsProfile | null) => void;
  isDraft?: boolean;
  draftOtherUserId?: string;
}

const ChatConversation = ({
  chatId,
  otherMemberId,
  otherMemberProfile,
  isGroup = false,
  groupName,
  groupColor,
  onShowDetails,
  onSetDetailsProfile,
  isDraft = false,
  draftOtherUserId,
}: ChatConversationProps) => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [isOtherUserTyping, setIsOtherUserTyping] = useState(false);

  // Only fetch messages if not a draft (drafts have no messages yet)
  const {
    data: messages,
    isLoading,
    isError,
    refetch,
  } = useGetMessages(isDraft ? "" : chatId);

  const { mutate: sendMessage, isPending: isSending } = useSendMessage();
  const { mutate: sendFirstMessage, isPending: isSendingFirst } =
    useSendFirstMessage();

  // Handle new messages from socket
  const handleNewMessage = useCallback(
    (newMessage: ChatMessageType) => {
      // Add new message to cache if not already there
      queryClient.setQueryData<ChatMessageType[]>(
        ["messages", chatId],
        (oldMessages) => {
          if (!oldMessages) return [newMessage];
          const exists = oldMessages.some((msg) => msg._id === newMessage._id);
          if (exists) return oldMessages;
          return [...oldMessages, newMessage];
        },
      );
      // Hide typing indicator when message is received
      setIsOtherUserTyping(false);
    },
    [queryClient, chatId],
  );

  // Handle typing indicator
  const handleUserTyping = useCallback(
    (userId: string) => {
      if (userId !== user?.user_id) {
        setIsOtherUserTyping(true);
      }
    },
    [user?.user_id],
  );

  const handleUserStoppedTyping = useCallback(
    (userId: string) => {
      if (userId !== user?.user_id) {
        setIsOtherUserTyping(false);
      }
    },
    [user?.user_id],
  );

  // Setup socket connection for this chat
  const { emitTyping, emitStopTyping } = useChatSocket({
    chatId,
    onNewMessage: handleNewMessage,
    onUserTyping: handleUserTyping,
    onUserStoppedTyping: handleUserStoppedTyping,
  });

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (text: string) => {
    // For draft chats, create the chat and send the first message atomically
    if (isDraft && draftOtherUserId) {
      sendFirstMessage(
        { recipientId: draftOtherUserId, text },
        {
          onSuccess: (data) => {
            // Navigate to the actual chat after creation
            navigate(`/chat/${data.chat._id}`, { replace: true });
          },
        },
      );
      return;
    }

    // Regular message sending for existing chats
    if (!chatId) return;
    sendMessage({ chatId, text });
  };

  const handleTyping = () => {
    if (user?.user_id) emitTyping(user.user_id);
  };

  const handleStopTyping = () => {
    if (user?.user_id) emitStopTyping(user.user_id);
  };

  const handleBack = () => {
    navigate("/chat");
  };

  // Get display name and avatar
  let displayName = "Unknown User";
  if (isGroup) {
    displayName = groupName || "Group Chat";
  } else if (otherMemberProfile) {
    if (otherMemberProfile.firstName || otherMemberProfile.lastName) {
      displayName =
        `${otherMemberProfile.firstName || ""} ${otherMemberProfile.lastName || ""}`.trim();
    } else if (otherMemberProfile.username) {
      displayName = otherMemberProfile.username;
    }
  }

  const displayAvatar = isGroup
    ? undefined
    : otherMemberProfile?.profile_picture;

  // Handle details button click - desktop uses parent sidebar, mobile uses local modal
  const handleDetailsClick = () => {
    if (onShowDetails && onSetDetailsProfile) {
      // Desktop: update parent state to show sidebar
      onSetDetailsProfile({
        userId: otherMemberId,
        name: displayName,
        avatarUrl: displayAvatar,
        role: otherMemberProfile?.role,
        isGroup,
        groupColor,
      });
      onShowDetails(true);
    } else {
      // Mobile: use local state for modal
      setShowDetails(true);
    }
  };

  // Group messages by date
  const groupedMessages = messages?.reduce(
    (groups: { date: string; messages: ChatMessageType[] }[], message) => {
      const messageDate = format(new Date(message.createdAt), "yyyy-MM-dd");
      const existingGroup = groups.find((g) => g.date === messageDate);
      if (existingGroup) {
        existingGroup.messages.push(message);
      } else {
        groups.push({ date: messageDate, messages: [message] });
      }
      return groups;
    },
    [],
  );

  return (
    <div className="flex flex-col h-full bg-base-100 md:rounded-lg md:shadow-md md:shadow-base-content/10 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-base-200">
        {/* Back button (mobile) */}
        <button
          onClick={handleBack}
          className="md:hidden btn btn-ghost btn-sm btn-circle"
        >
          <ArrowLeftIcon className="w-5 h-5" />
        </button>

        {/* Avatar */}
        <div className="flex-shrink-0">
          {displayAvatar ? (
            <img
              src={displayAvatar}
              alt={displayName}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : isGroup && groupColor ? (
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
              style={{ backgroundColor: groupColor }}
            >
              {displayName.charAt(0).toUpperCase()}
            </div>
          ) : (
            <UserCircleIcon className="w-10 h-10 text-base-content/50" />
          )}
        </div>

        {/* Name */}
        <div className="flex-1">
          <h2 className="font-semibold text-base-content">{displayName}</h2>
        </div>

        {/* Details button */}
        <button
          onClick={handleDetailsClick}
          className="btn btn-ghost btn-sm text-base-content/60 hover:text-base-content"
        >
          <span className="hidden md:inline mr-1">Details</span>
          <InformationCircleIcon className="w-5 h-5 md:hidden" />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Only show loading on initial load when there's no cached data */}
        {isLoading && !messages && (
          <div className="flex justify-center py-8">
            <span className="loading loading-dots loading-md"></span>
          </div>
        )}

        {isError && (
          <div className="text-center py-8">
            <p className="text-error mb-2">Error loading messages</p>
            <button
              onClick={() => refetch()}
              className="btn btn-sm bg-yellow text-darkgrey"
            >
              Retry
            </button>
          </div>
        )}

        {!isLoading && !isError && messages?.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-base-content/50">
            <p>No messages yet</p>
            <p className="text-sm">Send a message to start the conversation</p>
          </div>
        )}

        {groupedMessages?.map((group) => (
          <div key={group.date}>
            <DateSeparator date={group.messages[0].createdAt} />
            {group.messages.map((message) => (
              <ChatMessage
                key={message._id}
                messageId={message._id}
                senderId={message.senderId}
                text={message.text}
                createdAt={message.createdAt}
                senderName={
                  message.senderId === user?.user_id
                    ? "You"
                    : otherMemberProfile
                      ? `${otherMemberProfile.firstName} ${otherMemberProfile.lastName}`
                      : "Unknown"
                }
                senderAvatar={
                  message.senderId === user?.user_id
                    ? (user?.profile_picture ?? undefined)
                    : otherMemberProfile?.profile_picture
                }
              />
            ))}
          </div>
        ))}

        {/* Typing Indicator */}
        {isOtherUserTyping && (
          <div className="flex items-center gap-2 mb-4">
            <div className="flex-shrink-0">
              {otherMemberProfile?.profile_picture ? (
                <img
                  src={otherMemberProfile.profile_picture}
                  alt=""
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-base-300 flex items-center justify-center">
                  <span className="text-xs text-white">
                    {displayName.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <div className="px-4 py-2 bg-base-content/10 rounded-2xl rounded-bl-sm">
              <div className="flex items-center gap-1">
                <span className="text-sm text-base-content/60 italic">
                  typing
                </span>
                <span className="flex gap-1">
                  <span
                    className="w-1.5 h-1.5 bg-base-content/40 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></span>
                  <span
                    className="w-1.5 h-1.5 bg-base-content/40 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></span>
                  <span
                    className="w-1.5 h-1.5 bg-base-content/40 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></span>
                </span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <ChatInput
        onSendMessage={handleSendMessage}
        onTyping={handleTyping}
        onStopTyping={handleStopTyping}
        disabled={isSending || isSendingFirst}
      />

      {/* Details Panel (Mobile Only - Desktop uses sidebar in ChatLayout) */}
      <ChatDetailsPanel
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
        userId={otherMemberId}
        name={displayName}
        avatarUrl={displayAvatar}
        role={otherMemberProfile?.role}
        isGroup={isGroup}
        groupColor={groupColor}
        mobileOnly={true}
      />
    </div>
  );
};

export default ChatConversation;
