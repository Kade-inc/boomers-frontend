import { useMutation, useQueryClient } from "@tanstack/react-query";
import APIClient from "../services/apiClient";
import * as Sentry from "@sentry/react";

const apiClient = new APIClient("/api/team-member/join");

const useSendTeamRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["add-team-member"],
    mutationFn: async ({
      payload,
    }: {
      payload: { team_id: string; user_id?: string };
    }) => {
      return apiClient.addTeamRequest(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team-member-requests"] });
      queryClient.invalidateQueries({ queryKey: ["joinRequests"] });
    },
    onError: (error: unknown) => {
      Sentry.captureException(error, {
        extra: { context: "Failed to send team request" },
      });
    },
  });
};

export default useSendTeamRequest;
