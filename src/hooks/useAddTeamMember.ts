/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import APIClient from "../services/apiClient";

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
    onError: (error: any) => {
      console.error("Failed to update request status:", error);
    },
  });
};

export default useAddTeamMember;
