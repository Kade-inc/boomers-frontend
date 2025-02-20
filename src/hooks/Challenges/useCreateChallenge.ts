import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query";
import APIClient from "../../services/apiClient";
import Challenge from "../../entities/Challenge";

type ExtendedChallengeInterface = Challenge & {
  teamName?: string;
};
const apiClient = new APIClient("/api/teams");

const useCreateChallenge = (): UseMutationResult<
  ExtendedChallengeInterface,
  Error,
  {
    teamId: string;
  },
  unknown
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["create-challenge"],
    mutationFn: ({teamId}) => apiClient.createChallenge(teamId),
    onSuccess: (data, {teamId}) => {
      if (data._id) {
        queryClient.invalidateQueries({
          queryKey: ["team-challenges", teamId],
        });
      }
    },
  });
};

export default useCreateChallenge;
