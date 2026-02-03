import { useMutation, useQueryClient } from "@tanstack/react-query";
import APIClient from "../../services/apiClient";
import { ChatMessage } from "../../entities/ChatMessage";
import { Chat } from "../../entities/Chat";

const apiClient = new APIClient("/api/messages");

interface SendFirstMessageParams {
  recipientId: string;
  text: string;
}

interface SendFirstMessageResponse {
  chat: Chat;
  message: ChatMessage;
  isNewChat: boolean;
}

export const useSendFirstMessage = () => {
  const queryClient = useQueryClient();

  return useMutation<SendFirstMessageResponse, Error, SendFirstMessageParams>({
    mutationFn: ({ recipientId, text }) =>
      apiClient.createChatAndSendMessage(recipientId, text),
    onSuccess: (data) => {
      // Add the new message to the cache
      queryClient.setQueryData<ChatMessage[]>(
        ["messages", data.chat._id],
        (oldMessages) => {
          if (!oldMessages) return [data.message];
          return [...oldMessages, data.message];
        },
      );
      // Invalidate chats to update the chat list
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
  });
};

export default useSendFirstMessage;
