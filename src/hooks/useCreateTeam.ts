/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import APIClient from "../services/apiClient";
import Team from "../entities/Team";

const apiClient = new APIClient("/api/teams");

const useCreateTeam = (): UseMutationResult<any, Error, Team, unknown> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["create-team"],
    mutationFn: (data: Team) => apiClient.createTeam(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });
    },
  });
};

export default useCreateTeam;
