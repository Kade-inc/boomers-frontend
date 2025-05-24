import { useMutation, UseMutationResult } from "@tanstack/react-query";
import APIClient from "../../services/apiClient";
import { ChallengeSolution } from "../../entities/ChallengeSolution";

const apiClient = new APIClient("/api/challenges");

const useUpdateSolution = (): UseMutationResult<
  ChallengeSolution,
  Error,
  {
    challengeId: string;
    solutionId: string;
    payload: Partial<ChallengeSolution>;
  },
  unknown
> => {
  return useMutation({
    mutationKey: ["update-solution"],
    mutationFn: ({ challengeId, solutionId, payload }) =>
      apiClient.updateSolution(challengeId, solutionId, payload),
  });
};

export default useUpdateSolution;
