import { useMutation, useQueryClient } from "@tanstack/react-query";
import APIClient from "../../services/apiClient";
import { ChatMessage } from "../../entities/ChatMessage";

const apiClient = new APIClient("/api/messages");

interface SendMessageParams {
  chatId: string;
  text: string;
}

export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation<ChatMessage, Error, SendMessageParams>({
    mutationFn: ({ chatId, text }) => apiClient.sendMessage(chatId, text),
    onSuccess: (newMessage) => {
      // Optimistically update the messages cache
      queryClient.setQueryData<ChatMessage[]>(
        ["messages", newMessage.chatId],
        (oldMessages) => {
          if (!oldMessages) return [newMessage];
          // Check if message already exists (from socket)
          const exists = oldMessages.some((msg) => msg._id === newMessage._id);
          if (exists) return oldMessages;
          return [...oldMessages, newMessage];
        },
      );
      // Invalidate chats to update last message preview
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
  });
};

export default useSendMessage;
