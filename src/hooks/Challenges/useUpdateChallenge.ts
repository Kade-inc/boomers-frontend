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
    onSuccess: (data, { challengeId, userId, teamId }) => {
      queryClient.invalidateQueries({
        queryKey: ["challenge", challengeId],
      });
      queryClient.invalidateQueries({
        queryKey: ["team-challenges"],
      });
      queryClient.invalidateQueries({
        queryKey: ["team-challenges", teamId],
      });
      queryClient.invalidateQueries({
        queryKey: ["challenges", userId, "valid", false],
      }); // This needs to be fixed. The userId being passed in here from the challengeforms is coming in as null and doesn't invalidate the queries
      if (data.valid) {
        queryClient.invalidateQueries({
          queryKey: ["challenges", userId, "valid", true],
        });
      }
    },
  });
};

export default useUpdateChallenge;
