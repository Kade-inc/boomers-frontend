import { useMutation, useQueryClient } from "@tanstack/react-query";
import APIClient from "../../services/apiClient";

const apiClient = new APIClient("/api/chats");

interface CreateChatParams {
  members: string[];
}

interface CreateChatResponse {
  _id: string;
  members: string[];
  isGroup: boolean;
  createdAt: string;
  updatedAt: string;
}

export const useCreateChat = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateChatResponse, Error, CreateChatParams>({
    mutationFn: ({ members }) => apiClient.createChat(members),
    onSuccess: () => {
      // Invalidate chats list to refetch
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
  });
};

export default useCreateChat;
