import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import APIClient from "../../services/apiClient";
import Challenge from "../../entities/Challenge";

type ExtendedChallengeInterface = Challenge & {
  teamName?: string;
};

const apiClient = new APIClient("/api/teams");

const useUpdateChallenge = (): UseMutationResult<
  ExtendedChallengeInterface,
  Error,
  {
    teamId: string;
    challengeId: string;
    payload: Partial<ExtendedChallengeInterface>;
    userId?: string;
  },
  unknown
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["update-challenge"],
    mutationFn: ({ teamId, challengeId, payload }) =>
      apiClient.updateChallenge(teamId, challengeId, payload),
    onSuccess: (data, { challengeId, userId }) => {
      if (data.valid) {
        queryClient.invalidateQueries({
          queryKey: ["challenge", challengeId],
        });

        queryClient.invalidateQueries({
          queryKey: ["challenges", userId, "valid", true],
        });
        queryClient.invalidateQueries({
          queryKey: ["team-challenges"],
        });
      }
    },
  });
};

export default useUpdateChallenge;
