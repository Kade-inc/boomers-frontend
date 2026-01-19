import { useQuery, UseQueryResult } from "@tanstack/react-query";
import APIClient from "../../services/apiClient";
import { ChatMessage } from "../../entities/ChatMessage";

const apiClient = new APIClient("/api/messages");

export const useGetMessages = (
  chatId: string | undefined,
): UseQueryResult<ChatMessage[], Error> => {
  return useQuery({
    queryKey: ["messages", chatId],
    queryFn: () => apiClient.getMessages(chatId!),
    enabled: !!chatId,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export default useGetMessages;
