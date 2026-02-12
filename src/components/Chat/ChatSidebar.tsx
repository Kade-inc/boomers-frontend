import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { useGetChats } from "../../hooks/Chats/useGetChats";
import { useDeleteChat } from "../../hooks/Chats/useDeleteChat";
import useAuthStore from "../../stores/useAuthStore";
import ChatListItem from "./ChatListItem";
import DeleteChatModal from "../Modals/DeleteChatModal";
import { Chat } from "../../entities/Chat";
import UserProfile from "../../entities/UserProfile";

interface ChatSidebarProps {
  onNewChatClick: () => void;
  userProfiles: Map<string, UserProfile>;
}

const ChatSidebar = ({ onNewChatClick, userProfiles }: ChatSidebarProps) => {
  const { user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<{
    chatId: string;
    name: string;
    isGroup: boolean;
  } | null>(null);

  const {
    data: chats,
    isLoading,
    isError,
    refetch,
  } = useGetChats(user?.user_id || "");

  const deleteChatMutation = useDeleteChat();

  const filteredChats = chats?.filter((chat: Chat) => {
    if (!searchQuery) return true;

    // Get the other member's name
    const otherMemberId = chat.members.find((id) => id !== user?.user_id);
    if (chat.isGroup && chat.groupName) {
      return chat.groupName.toLowerCase().includes(searchQuery.toLowerCase());
    }
    if (otherMemberId) {
      const profile = userProfiles.get(otherMemberId);
      if (profile) {
        const fullName =
          `${profile.firstName} ${profile.lastName}`.toLowerCase();
        return fullName.includes(searchQuery.toLowerCase());
      }
    }
    return false;
  });

  const getChatDisplayInfo = (chat: Chat) => {
    if (chat.isGroup) {
      return {
        name: chat.groupName || "Group Chat",
        avatarUrl: undefined,
        isGroup: true,
        groupColor: chat.teamColor || "#6366f1", // use team color if available, fallback to default
      };
    }

    const otherMemberId = chat.members.find((id) => id !== user?.user_id);
    const profile = otherMemberId ? userProfiles.get(otherMemberId) : undefined;

    // Use firstName + lastName if available, otherwise fallback to username
    let displayName = "Unknown User";
    if (profile) {
      if (profile.firstName || profile.lastName) {
        displayName =
          `${profile.firstName || ""} ${profile.lastName || ""}`.trim();
      } else if (profile.username) {
        displayName = profile.username;
      }
    }

    return {
      name: displayName,
      avatarUrl: profile?.profile_picture ?? undefined,
      isGroup: false,
      groupColor: undefined,
    };
  };

  const canDeleteChat = (chat: Chat): boolean => {
    if (!user?.user_id) return false;
    // Individual chats: any member can delete (soft-delete)
    if (!chat.isGroup) return true;
    // Group chats: only the admin (team owner) can delete
    return chat.admin === user.user_id;
  };

  const handleDeleteRequest = (chatId: string) => {
    const chat = chats?.find((c: Chat) => c._id === chatId);
    if (!chat) return;
    const displayInfo = getChatDisplayInfo(chat);
    setDeleteTarget({
      chatId,
      name: displayInfo.name,
      isGroup: chat.isGroup,
    });
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    deleteChatMutation.mutate(deleteTarget.chatId, {
      onSettled: () => {
        setDeleteTarget(null);
      },
    });
  };

  return (
    <>
      <div className="flex flex-col h-full bg-base-100 rounded-lg shadow-md shadow-base-content/10 overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-base-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-base-content hidden md:block">
              Messages
            </h2>
            <button
              onClick={onNewChatClick}
              className="btn btn-sm bg-yellow text-darkgrey hover:bg-yellow/80 gap-1"
            >
              <PlusIcon className="w-4 h-4" />
              <span className="hidden lg:inline">New</span>
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/50" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input input-bordered w-full pl-10 bg-grey text-sm"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto p-2">
          {isLoading && (
            <div className="flex justify-center py-8">
              <span className="loading loading-dots loading-md"></span>
            </div>
          )}

          {isError && (
            <div className="text-center py-8">
              <p className="text-error mb-2">Error loading chats</p>
              <button
                onClick={() => refetch()}
                className="btn btn-sm bg-yellow text-darkgrey"
              >
                Retry
              </button>
            </div>
          )}

          {!isLoading && !isError && filteredChats?.length === 0 && (
            <div className="text-center py-8 text-base-content/60">
              {searchQuery ? "No chats found" : "No conversations yet"}
            </div>
          )}

          {filteredChats?.map((chat: Chat) => {
            const displayInfo = getChatDisplayInfo(chat);
            return (
              <ChatListItem
                key={chat._id}
                chatId={chat._id}
                name={displayInfo.name}
                avatarUrl={displayInfo.avatarUrl}
                isGroup={displayInfo.isGroup}
                groupColor={displayInfo.groupColor}
                lastMessage={chat.lastMessage?.text}
                lastMessageTime={chat.lastMessage?.createdAt || chat.updatedAt}
                unreadCount={chat.unreadCount || 0}
                canDelete={canDeleteChat(chat)}
                onDelete={handleDeleteRequest}
              />
            );
          })}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteChatModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        isGroup={deleteTarget?.isGroup || false}
        chatName={deleteTarget?.name || ""}
        isLoading={deleteChatMutation.isPending}
      />
    </>
  );
};

export default ChatSidebar;
