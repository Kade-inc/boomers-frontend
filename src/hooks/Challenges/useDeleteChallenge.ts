/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import APIClient from "../../services/apiClient";

const apiClient = new APIClient("/api/teams");

const useDeleteChallenge = (): UseMutationResult<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any,
  Error,
  {
    teamId: string;
    challengeId: string;
  },
  unknown
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["delete-challenge"],
    mutationFn: ({ teamId, challengeId }) =>
      apiClient.deleteChallenge(teamId, challengeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["challenges"] });
    },
  });
};

export default useDeleteChallenge;
