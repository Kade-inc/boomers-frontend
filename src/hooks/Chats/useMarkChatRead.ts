import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import APIClient from "../../services/apiClient";

const apiClient = new APIClient("/api/chats");

/**
 * Marks a chat as read when the user views it.
 * Automatically calls the API when chatId changes and invalidates
 * the chats query to update unread counts in the sidebar.
 */
export const useMarkChatRead = (chatId: string | undefined) => {
  const queryClient = useQueryClient();
  const lastMarkedChatId = useRef<string | null>(null);

  useEffect(() => {
    if (!chatId || chatId === lastMarkedChatId.current) return;

    lastMarkedChatId.current = chatId;

    apiClient.markChatRead(chatId).then(() => {
      // Invalidate chats to refresh unread counts in the sidebar
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    });
  }, [chatId, queryClient]);
};

export default useMarkChatRead;
