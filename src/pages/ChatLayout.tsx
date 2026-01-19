import { Outlet, useLocation } from "react-router-dom";
import { useGetChats } from "../hooks/Chats/useGetChats";
import useAuthStore from "../stores/useAuthStore";
import { LuMailWarning } from "react-icons/lu";
import { FiInbox, FiMessageSquare } from "react-icons/fi";
import ChatSearchModal from "../components/Modals/ChatSearchModal";
import ChatSidebar from "../components/Chat/ChatSidebar";
import ChatDetailsPanel from "../components/Chat/ChatDetailsPanel";
import { useState, useMemo } from "react";
import { Chat } from "../entities/Chat";
import { useGetUserProfilesById } from "../hooks/useGetUserProfilesById";

// Details profile info passed to sidebar
interface DetailsProfile {
  userId?: string;
  name: string;
  avatarUrl?: string;
  role?: string;
  isGroup?: boolean;
  groupColor?: string;
}

const ChatLayout = () => {
  const { user } = useAuthStore();
  const location = useLocation();
  const isChildRoute = location.pathname !== "/chat";

  const [isChatSearchOpen, setIsChatSearchOpen] = useState(false);
  const [showDetailsPanel, setShowDetailsPanel] = useState(false);
  const [detailsProfile, setDetailsProfile] = useState<DetailsProfile | null>(
    null,
  );

  const {
    data: chats,
    isLoading: isLoadingChats,
    isError: isErrorChats,
    refetch: refetchChats,
  } = useGetChats(user?.user_id || "");

  // Debug logging
  console.log("ChatLayout - user:", user);
  console.log("ChatLayout - user_id:", user?.user_id);
  console.log("ChatLayout - chats:", chats);
  console.log("ChatLayout - isLoading:", isLoadingChats);

  // Derive member IDs that need profile fetching (exclude current user)
  const memberIdsToFetch = useMemo(() => {
    if (!chats || !user?.user_id) return [];

    const memberIds = new Set<string>();
    chats.forEach((chat: Chat) => {
      chat.members.forEach((memberId) => {
        if (memberId !== user.user_id) {
          memberIds.add(memberId);
        }
      });
    });

    return Array.from(memberIds);
  }, [chats, user?.user_id]);

  // Fetch all user profiles in parallel using React Query
  const { profiles: userProfiles } = useGetUserProfilesById(memberIdsToFetch);

  const handleStartNewChat = () => {
    setIsChatSearchOpen(true);
  };

  // Loading state - only on initial load, not during refetches
  if (isLoadingChats && !chats) {
    return (
      <div className="flex items-center justify-center h-screen bg-base-100">
        <div className="loading loading-dots loading-lg"></div>
      </div>
    );
  }

  // Error state
  if (isErrorChats) {
    return (
      <div className="flex items-center justify-center h-screen bg-base-100 flex-col gap-2">
        <LuMailWarning className="text-base-content w-20 h-20" />
        <p className="text-center text-base-content font-semibold">
          Error fetching chats
        </p>
        <button
          onClick={() => refetchChats()}
          className="bg-yellow text-darkgrey font-medium py-2 px-4 rounded-md"
        >
          Retry
        </button>
      </div>
    );
  }

  // Empty state - no chats
  if (chats && chats.length === 0 && !isChildRoute) {
    return (
      <>
        <div className="flex flex-col h-screen bg-base-100 font-body px-4 md:px-10 py-10">
          <div className="flex items-center justify-center h-full flex-col gap-4">
            <FiInbox className="text-base-content w-20 h-20" />
            <p className="text-center text-base-content font-semibold text-lg">
              No messages yet
            </p>
            <p className="text-center text-base-content/60 text-sm">
              Start a conversation with someone
            </p>
            <button
              onClick={handleStartNewChat}
              className="btn bg-yellow text-darkgrey font-medium"
            >
              Start chat
            </button>
          </div>
        </div>
        <ChatSearchModal
          isOpen={isChatSearchOpen}
          onClose={() => setIsChatSearchOpen(false)}
        />
      </>
    );
  }

  return (
    <>
      <div className="flex flex-col md:flex-row h-screen bg-base-100 font-body">
        {/* Mobile View */}
        <div className="md:hidden flex flex-col h-full">
          {isChildRoute ? (
            // Show conversation
            <Outlet context={{ userProfiles }} />
          ) : (
            // Show chat list
            <div className="flex flex-col h-full px-4 py-6">
              <h1 className="text-2xl font-bold text-base-content mb-4">
                Messages
              </h1>
              <ChatSidebar
                onNewChatClick={handleStartNewChat}
                userProfiles={userProfiles}
              />
              {/* Mobile Start Chat Button */}
              <button
                onClick={handleStartNewChat}
                className="btn bg-yellow text-darkgrey font-medium fixed right-4 bottom-20 shadow-lg"
              >
                Start chat
              </button>
            </div>
          )}
        </div>

        {/* Desktop View */}
        <div className="hidden md:flex gap-4 h-full w-full px-10 py-10">
          {/* Sidebar */}
          <div className="w-1/4 min-w-[280px] max-w-[320px]">
            <ChatSidebar
              onNewChatClick={handleStartNewChat}
              userProfiles={userProfiles}
            />
          </div>

          {/* Main Content */}
          <div className={`flex-1 ${showDetailsPanel ? "mr-4" : ""}`}>
            {isChildRoute ? (
              <Outlet
                context={{
                  userProfiles,
                  showDetailsPanel,
                  setShowDetailsPanel,
                  setDetailsProfile,
                }}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full bg-base-100 rounded-lg shadow-md shadow-base-content/10">
                <FiMessageSquare className="text-base-content/30 w-20 h-20 mb-4" />
                <p className="text-base-content/60 text-lg">
                  Select a conversation
                </p>
                <p className="text-base-content/40 text-sm mt-1">
                  or start a new chat
                </p>
                <button
                  onClick={handleStartNewChat}
                  className="btn bg-yellow text-darkgrey font-medium mt-4"
                >
                  New chat
                </button>
              </div>
            )}
          </div>

          {/* Details Panel Sidebar (Desktop Only) */}
          {showDetailsPanel && detailsProfile && (
            <div className="w-1/4 min-w-[250px] max-w-[280px]">
              <ChatDetailsPanel
                isOpen={showDetailsPanel}
                onClose={() => setShowDetailsPanel(false)}
                userId={detailsProfile.userId}
                name={detailsProfile.name}
                avatarUrl={detailsProfile.avatarUrl}
                role={detailsProfile.role}
                isGroup={detailsProfile.isGroup}
                groupColor={detailsProfile.groupColor}
              />
            </div>
          )}
        </div>
      </div>

      <ChatSearchModal
        isOpen={isChatSearchOpen}
        onClose={() => setIsChatSearchOpen(false)}
      />
    </>
  );
};

export default ChatLayout;
