import { Outlet, useLocation } from "react-router-dom";
import { useGetChats } from "../hooks/Chats/useGetChats";
import useAuthStore from "../stores/useAuthStore";
import { LuMailWarning } from "react-icons/lu";
import { FiInbox } from "react-icons/fi";
import ChatSearchModal from "../components/Modals/ChatSearchModal";
import { useState } from "react";

const ChatLayout = () => {
  const { user } = useAuthStore();
  const location = useLocation();
  const isChildRoute = location.pathname !== "/chat";
  console.log(user);
  const {
    data: chats,
    isLoading: isLoadingChats,
    isError: isErrorChats,
    refetch: refetchChats,
    isRefetching: isRefetchingChats,
  } = useGetChats(user?.user_id || "");
  console.log(chats);

  const handleStartNewChat = () => {
    console.log("Start new chat");
    setIsChatSearchOpen(true);
  };

  const [isChatSearchOpen, setIsChatSearchOpen] = useState(false);
  return (
    <>
      <div className="flex flex-col h-screen bg-base-100 font-body px-10 py-10">
        {(isLoadingChats || isRefetchingChats) && (
          <div className="flex items-center justify-center h-screen">
            <div className="loading loading-dots loading-lg"></div>
          </div>
        )}
        {isErrorChats && !isLoadingChats && !isRefetchingChats && (
          <div className="flex items-center justify-center h-screen flex-col gap-2">
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
        )}
        {chats && chats.length === 0 && (
          <>
            {isChildRoute ? (
              <Outlet />
            ) : (
              <div className="flex items-center justify-center h-screen flex-col gap-2">
                <FiInbox className="text-base-content w-20 h-20" />
                <p className="text-center text-base-content font-semibold">
                  No chats found
                </p>
                <button
                  onClick={handleStartNewChat}
                  className="bg-yellow text-darkgrey font-medium py-2 px-4 rounded-md"
                >
                  New chat
                </button>
              </div>
            )}
          </>
        )}
        {chats && chats.length > 0 && (
          <>
            <div className="md:hidden">
              <h2 className="text-base-content font-semibold fixed">
                Messages
              </h2>
              <button
                onClick={handleStartNewChat}
                className="btn bg-yellow text-darkgrey font-medium py-2 px-4 rounded-md fixed right-10 bottom-20"
              >
                New chat
              </button>
            </div>
            <div className="hidden md:flex gap-4">
              <div className="bg-base-100 w-1/4 h-[80vh] rounded-md fixed shadow-md shadow-base-content/10 ">
                Test
              </div>

              {isChildRoute ? (
                <Outlet />
              ) : (
                <div className="w-3/4 flex flex-col items-center justify-center gap-4 h-[80vh] ml-80">
                  <FiInbox className="text-base-content w-20 h-20" />
                  <p className="text-center text-base-content font-semibold">
                    Start New Chat
                  </p>
                  <button
                    onClick={handleStartNewChat}
                    className="btn bg-yellow text-darkgrey font-medium py-2 px-4 rounded-md"
                  >
                    New chat
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
      <ChatSearchModal
        isOpen={isChatSearchOpen}
        onClose={() => setIsChatSearchOpen(false)}
      />
    </>
  );
};

export default ChatLayout;
