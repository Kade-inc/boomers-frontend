/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import APIClient from "../services/apiClient";

const apiClient = new APIClient("/api/team-member/leave");

const useLeaveTeam = (): UseMutationResult<any, Error, string, unknown> => {
  return useMutation({
    mutationKey: ["leave-team"],
    mutationFn: (teamId: string) => apiClient.leaveTeam(teamId),
  });
};
export default useLeaveTeam;
