import { useMutation, useQueryClient } from "@tanstack/react-query";
import APIClient from "../services/apiClient";
import * as Sentry from "@sentry/react";

const apiClient = new APIClient("/api/team-member/create");

const useAddTeamMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["add-team-member"],
    mutationFn: async ({
      payload,
    }: {
      payload: { team_id: string; username: string };
    }) => {
      return apiClient.addTeamMember(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team-member-requests"] });
      queryClient.invalidateQueries({ queryKey: ["team"] });
    },
    onError: (error: unknown) => {
      Sentry.captureException(error, {
        extra: { context: "Failed to add team member" },
      });
    },
  });
};

export default useAddTeamMember;

// Georgecl00ney!
// Bern1eM@c
// BradP1tt!
// C@ptainBubb11ez!
