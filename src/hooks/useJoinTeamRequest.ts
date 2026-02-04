import { useMutation, useQueryClient } from "@tanstack/react-query";
import APIClient from "../services/apiClient";
import * as Sentry from "@sentry/react";

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
      Sentry.captureException(error, {
        extra: { context: "Failed to update team join request status" },
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["joinRequests"] });
    },
  });
};

export default useJoinTeamRequest;
