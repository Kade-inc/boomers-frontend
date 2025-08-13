/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import APIClient from "../services/apiClient";

const apiClient = new APIClient("/api/team-member/leave");

const useLeaveTeam = (): UseMutationResult<any, Error, string, unknown> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["leave-team"],
    mutationFn: (teamId: string) => apiClient.leaveTeam(teamId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team"] });
    },
  });
};
export default useLeaveTeam;
