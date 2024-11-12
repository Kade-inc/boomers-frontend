import { useMutation, UseMutationResult } from "@tanstack/react-query";
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
  },
  unknown
> => {
  return useMutation({
    mutationKey: ["update-challenge"],
    mutationFn: ({ teamId, challengeId, payload }) =>
      apiClient.updateChallenge(teamId, challengeId, payload),
  });
};

export default useUpdateChallenge;
