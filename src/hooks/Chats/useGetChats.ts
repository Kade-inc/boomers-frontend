import { useQuery, UseQueryResult } from "@tanstack/react-query";
import APIClient from "../../services/apiClient";
import { Chat } from "../../entities/Chat";

const apiClient = new APIClient("/api/chats");

export const useGetChats = (userId: string): UseQueryResult<Chat[], Error> => {
  return useQuery({
    queryKey: ["chats", userId],
    queryFn: () => apiClient.getChats(userId),
    enabled: !!userId, // Only run query if userId is available
    refetchOnWindowFocus: true, // Refetch when user comes back to tab
    staleTime: 1000 * 30, // 30 seconds - refresh more frequently for chat
  });
};
