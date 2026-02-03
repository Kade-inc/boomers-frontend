import { useMutation, useQueryClient } from "@tanstack/react-query";
import APIClient from "../services/apiClient";

const apiClient = new APIClient("/api/team-member/join");

const useJoinTeamRequest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["update-request-status"],
    mutationFn: async ({
      requestId,
      payload,
    }: {
      requestId: string;
      payload: { status: string; comment: string };
    }) => apiClient.joinTeamRequest(requestId, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team-member-requests"] });
      queryClient.invalidateQueries({ queryKey: ["team"] });
      queryClient.invalidateQueries({ queryKey: ["joinRequests"] });
    },

    onError: (error) => {
      console.error("Failed to update request status:", error);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["joinRequests"] });
    },
  });
};

export default useJoinTeamRequest;
