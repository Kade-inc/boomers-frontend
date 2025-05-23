import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import APIClient from "../services/apiClient";
import Team from "../entities/Team";

const apiClient = new APIClient("/api/teams");

const useUpdateTeam = (): UseMutationResult<
  Team,
  Error,
  {
    teamId: string;
    payload: Partial<Team>;
  },
  unknown
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["update-team"],
    mutationFn: ({ teamId, payload }) => apiClient.updateTeam(teamId, payload),
    onSuccess: ({ teamId }) => {
      queryClient.invalidateQueries({
        queryKey: ["team", teamId],
      });
      queryClient.invalidateQueries({
        queryKey: ["teams"],
      });
    },
  });
};

export default useUpdateTeam;
