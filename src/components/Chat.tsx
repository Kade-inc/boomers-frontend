import { useParams, useOutletContext } from "react-router-dom";
import { useMemo } from "react";
import ChatConversation from "./Chat/ChatConversation";
import useAuthStore from "../stores/useAuthStore";
import { useGetChats } from "../hooks/Chats/useGetChats";
import { Chat as ChatType } from "../entities/Chat";
import { useGetUserProfileById } from "../hooks/useGetUserProfileById";

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

interface OutletContext {
  userProfiles: Map<string, UserProfile>;
  showDetailsPanel: boolean;
  setShowDetailsPanel: (show: boolean) => void;
  setDetailsProfile: (profile: DetailsProfile | null) => void;
}

const Chat = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const { user } = useAuthStore();
  const context = useOutletContext<OutletContext>();
  const userProfiles = context?.userProfiles || new Map();
  const setShowDetailsPanel = context?.setShowDetailsPanel;
  const setDetailsProfile = context?.setDetailsProfile;

  const { data: chats } = useGetChats(user?.user_id || "");

  // Derive current chat using useMemo (no state needed for derived data)
  const currentChat = useMemo(() => {
    if (!chats || !chatId) return null;
    return chats.find((c: ChatType) => c._id === chatId) || null;
  }, [chats, chatId]);

  // Derive other member ID
  const otherMemberId = useMemo(() => {
    if (!currentChat || !user?.user_id) return undefined;
    return currentChat.members.find((id) => id !== user.user_id);
  }, [currentChat, user?.user_id]);

  // Check cache first for the profile
  const cachedProfile = otherMemberId
    ? userProfiles.get(otherMemberId)
    : undefined;

  // Use React Query to fetch profile if not in cache
  const { data: fetchedProfile } = useGetUserProfileById(
    cachedProfile ? undefined : otherMemberId
  );

  // Use cached profile if available, otherwise use fetched profile
  // Type assertion needed because entity UserProfile differs from local interface
  const otherMemberProfile = cachedProfile || (fetchedProfile as UserProfile | undefined);

  if (!chatId) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-base-content/60">No chat selected</p>
      </div>
    );
  }

  return (
    <div className="h-full">
      <ChatConversation
        chatId={chatId}
        otherMemberId={otherMemberId}
        otherMemberProfile={otherMemberProfile}
        isGroup={currentChat?.isGroup}
        groupName={currentChat?.groupName}
        onShowDetails={setShowDetailsPanel}
        onSetDetailsProfile={setDetailsProfile}
      />
    </div>
  );
};

export default Chat;
