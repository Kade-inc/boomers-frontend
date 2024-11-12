import { useMutation, UseMutationResult } from "@tanstack/react-query";
import APIClient from "../../services/apiClient";
import Challenge from "../../entities/Challenge";

type ExtendedChallengeInterface = Challenge & {
  teamName?: string;
};
const apiClient = new APIClient("/api/teams");

const useCreateChallenge = (): UseMutationResult<
  ExtendedChallengeInterface,
  Error,
  string,
  unknown
> => {
  return useMutation({
    mutationKey: ["create-challenge"],
    mutationFn: (teamId) => apiClient.createChallenge(teamId),
  });
};

export default useCreateChallenge;
