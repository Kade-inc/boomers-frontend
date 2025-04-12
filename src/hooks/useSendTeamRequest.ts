/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import APIClient from "../services/apiClient";

const apiClient = new APIClient("/api/team-member/join");

const useSendTeamRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["add-team-member"],
    mutationFn: async ({ payload }: { payload: { team_id: string } }) => {
      return apiClient.addTeamRequest(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team-member-requests"] });
      queryClient.invalidateQueries({ queryKey: ["joinRequests"] });
    },
    onError: (error: any) => {
      console.error("Failed to update request status:", error);
    },
  });
};

export default useSendTeamRequest;
