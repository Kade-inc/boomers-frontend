import { useMutation, useQueryClient } from "@tanstack/react-query";
import APIClient from "../../services/apiClient";
import { useNavigate, useParams } from "react-router-dom";

const apiClient = new APIClient("/api/chats");

export const useDeleteChat = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { chatId: activeChatId } = useParams();

  return useMutation({
    mutationFn: (chatId: string) => apiClient.deleteChat(chatId),
    onSuccess: (_data, chatId) => {
      // Invalidate chats query to refresh the sidebar
      queryClient.invalidateQueries({ queryKey: ["chats"] });

      // If the deleted chat was the active one, navigate back to chat list
      if (activeChatId === chatId) {
        navigate("/chat");
      }
    },
  });
};
