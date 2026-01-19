import { useParams, useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";
import ChatConversation from "./Chat/ChatConversation";
import useAuthStore from "../stores/useAuthStore";
import { useGetChats } from "../hooks/Chats/useGetChats";
import { Chat as ChatType } from "../entities/Chat";
import APIClient from "../services/apiClient";

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

const apiClient = new APIClient("/api/users");

const Chat = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const { user } = useAuthStore();
  const context = useOutletContext<OutletContext>();
  const userProfiles = context?.userProfiles || new Map();
  const setShowDetailsPanel = context?.setShowDetailsPanel;
  const setDetailsProfile = context?.setDetailsProfile;

  const { data: chats } = useGetChats(user?.user_id || "");
  const [currentChat, setCurrentChat] = useState<ChatType | null>(null);
  const [otherMemberProfile, setOtherMemberProfile] = useState<
    UserProfile | undefined
  >();

  // Find the current chat
  useEffect(() => {
    if (chats && chatId) {
      const chat = chats.find((c: ChatType) => c._id === chatId);
      setCurrentChat(chat || null);
    }
  }, [chats, chatId]);

  // Get other member's profile
  useEffect(() => {
    const fetchOtherMemberProfile = async () => {
      if (!currentChat || !user?.user_id) return;

      const otherMemberId = currentChat.members.find(
        (id) => id !== user.user_id,
      );

      if (otherMemberId) {
        // Check cache first
        const cachedProfile = userProfiles.get(otherMemberId);
        if (cachedProfile) {
          setOtherMemberProfile(cachedProfile);
          return;
        }

        // Fetch from API
        try {
          const profile = await apiClient.getUserProfileById(otherMemberId);
          if (profile) {
            setOtherMemberProfile(profile);
          }
        } catch (error) {
          console.error("Failed to fetch other member profile:", error);
        }
      }
    };

    fetchOtherMemberProfile();
  }, [currentChat, user?.user_id, userProfiles]);

  if (!chatId) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-base-content/60">No chat selected</p>
      </div>
    );
  }

  const otherMemberId = currentChat?.members.find((id) => id !== user?.user_id);

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
