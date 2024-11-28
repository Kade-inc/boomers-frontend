/* eslint-disable @typescript-eslint/no-explicit-any */
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
    }) => {
      return apiClient.joinTeamRequest(requestId, payload);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team-requests"] });
    },
    onError: (error: any) => {
      console.error("Failed to update request status:", error);
    },
  });
};

export default useJoinTeamRequest;
