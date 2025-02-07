/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import APIClient from "../services/apiClient";

const apiClient = new APIClient("/api/team-member");

const useRemoveTeamMember = (): UseMutationResult<
  any,
  Error,
  { teamId: string; userId: string },
  unknown
> => {
  return useMutation({
    mutationKey: ["remove-team-member"],
    mutationFn: ({ teamId, userId }) =>
      apiClient.removeTeamMember(teamId, userId),
  });
};

export default useRemoveTeamMember;
