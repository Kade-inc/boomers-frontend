import { useQuery, UseQueryResult } from "@tanstack/react-query";
import APIClient from "../../services/apiClient";
import { Chat } from "../../entities/Chat";

const apiClient = new APIClient("/api/chats");

export const useGetChats = (userId: string): UseQueryResult<Chat[], Error> => {
  return useQuery({
    queryKey: ["chats", userId],
    queryFn: () => apiClient.getChats(userId),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
