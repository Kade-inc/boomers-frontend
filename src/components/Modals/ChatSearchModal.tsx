import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useEffect, useRef, useState, useCallback } from "react";
import Modal from "react-modal";
import useSearchUserAndTeams from "../../hooks/Chats/useSearchUserAndTeams";
import { useNavigate } from "react-router-dom";
import { UserCircleIcon } from "@heroicons/react/24/solid";
import { FiInbox } from "react-icons/fi";
import { IoIosSearch } from "react-icons/io";
import useAuthStore from "../../stores/useAuthStore";
import APIClient from "../../services/apiClient";
import toast from "react-hot-toast";
import * as Sentry from "@sentry/react";

type ModalTriggerProps = {
  isOpen: boolean;
  onClose: () => void;
};

interface SearchResult {
  _id: string;
  name: string;
  type: string;
  domain?: string;
  subdomain?: string;
  subdomainTopics?: string[];
  teamColor?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  profile_picture?: string;
  user_id?: string; // For profile results
}

const apiClient = new APIClient("/api/chats");

const ChatSearchModal = ({ isOpen, onClose }: ModalTriggerProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { data, isLoading, isError, fetchNextPage, hasNextPage } =
    useSearchUserAndTeams(searchQuery.length > 0, searchQuery, 10);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleScroll = useCallback(() => {
    if (!containerRef.current || isLoadingMore) return;

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    if (
      scrollHeight - scrollTop <= clientHeight * 1.5 &&
      !isLoading &&
      hasNextPage
    ) {
      setIsLoadingMore(true);
      fetchNextPage().finally(() => {
        setIsLoadingMore(false);
      });
    }
  }, [isLoading, hasNextPage, fetchNextPage, isLoadingMore]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);

  // Filter out the current user from results (users shouldn't be able to chat with themselves)
  const allResults =
    data?.pages
      .flatMap((page) => page.results)
      .filter((result: SearchResult) => {
        // For profile results, exclude the current user
        if (result.type === "profile") {
          const resultUserId = result.user_id || result._id;
          return resultUserId !== user?.user_id;
        }
        return true;
      }) ?? [];

  const handleResultClick = async (result: SearchResult) => {
    if (!user?.user_id) {
      toast.error("Please log in to start a chat");
      return;
    }

    // Prevent duplicate clicks
    if (isCreatingChat) return;
    setIsCreatingChat(true);

    try {
      // For profiles (users), use lazy chat creation
      if (result.type === "profile") {
        const otherUserId = result.user_id || result._id;
        const members = [user.user_id, otherUserId];

        // First check if a chat already exists
        try {
          const existingChat = await apiClient.findChat(members);
          if (existingChat) {
            // Chat exists, navigate directly to it
            onClose();
            navigate(`/chat/${existingChat._id}`);
            return;
          }
        } catch {
          // No existing chat found, continue to create draft
        }

        // No existing chat - navigate to draft chat view
        // The chat will be created when the first message is sent
        onClose();
        navigate(`/chat/new?userId=${otherUserId}`);
      } else {
        // For teams, create a group chat with all team members (existing behavior)
        try {
          const response = await apiClient.createGroupChat(
            result._id,
            result.name,
            result.teamColor,
          );
          onClose();

          // Navigate to the chat (either newly created or existing)
          const chatId = response.data?._id || response._id;
          if (response.isExisting) {
            toast.success("Opening existing team chat");
          } else {
            toast.success("Team chat created!");
          }
          navigate(`/chat/${chatId}`);
        } catch (error) {
          Sentry.captureException(error, {
            extra: { context: "Error creating group chat" },
          });
          throw error;
        }
      }
    } catch (error) {
      Sentry.captureException(error, {
        extra: { context: "Error creating chat" },
      });
      toast.error("Failed to start chat");
    } finally {
      setIsCreatingChat(false);
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onRequestClose={onClose}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-base-100 rounded-lg py-10 px-2 md:px-8 w-[90%] md:w-[80%] lg:w-[60%] xl:w-[50%]"
        overlayClassName="fixed inset-0 z-50 backdrop-blur-sm bg-[#00000033] bg-opacity-30 flex items-center justify-center"
      >
        <div className="flex flex-col h-[70vh] relative">
          <div className="relative mb-2 mt-2 w-[90%] mx-auto">
            <MagnifyingGlassIcon className="absolute inset-y-0 left-0 flex items-center pl-2 w-8 h-8 top-2.5 " />
            <input
              type="text"
              placeholder="Search"
              className="input w-full rounded-full pl-10 text-[12px] md:text-base font-body bg-grey input-bordered"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>

          <div ref={containerRef} className="flex-1 overflow-y-auto mt-4 px-4">
            {isError && (
              <div className="text-error">
                Error searching for users and teams
              </div>
            )}

            {allResults.map((result: SearchResult) => (
              <div
                key={result._id}
                className={`p-2 hover:bg-base-200 rounded-lg cursor-pointer font-body text-base-content ${isCreatingChat ? "opacity-50 pointer-events-none" : ""}`}
                onClick={() => handleResultClick(result)}
              >
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <div className="font-medium">{result.name}</div>
                    {result.type === "team" && (
                      <div className="text-sm text-base-content">
                        {result.domain} • {result.subdomain}
                      </div>
                    )}
                    {result.type === "profile" && (
                      <div className="text-sm text-base-content">
                        {result.firstName && result.lastName
                          ? result.firstName + " " + result.lastName
                          : result.username}
                      </div>
                    )}
                  </div>
                  <div className="">
                    {result.type === "team" ? (
                      <div
                        className="w-9 h-9 rounded-full"
                        style={{ background: result.teamColor }}
                      />
                    ) : (
                      <>
                        {result.profile_picture ? (
                          <div className="w-8 h-8 rounded-full bg-base-content">
                            <img
                              src={result.profile_picture}
                              alt="Profile"
                              className="w-full h-full rounded-full"
                            />
                          </div>
                        ) : (
                          <UserCircleIcon className="w-8 h-8 text-base-content" />
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isLoading && !isLoadingMore && (
              <div className="flex justify-center py-4">
                <div className="loading loading-spinner loading-md"></div>
              </div>
            )}

            {!isLoading && allResults.length === 0 && (
              <div className="text-center py-4 text-base-content font-body flex flex-col items-center justify-center">
                {searchQuery && (
                  <>
                    <FiInbox className="text-base-content w-20 h-20" />
                    <p className="text-center text-base-content font-body py-4">
                      No results found for &quot;{searchQuery}&quot;
                    </p>
                  </>
                )}
                {!searchQuery && (
                  <>
                    <IoIosSearch className="text-lightgrey w-16 h-16" />
                    <p className="text-center text-base-content font-body py-4">
                      Search for users and teams
                    </p>
                  </>
                )}
              </div>
            )}
          </div>

          {isLoadingMore && (
            <div className="absolute bottom-0 left-0 right-0 flex justify-center py-4 bg-base-100">
              <div className="loading loading-spinner loading-sm"></div>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};

export default ChatSearchModal;
