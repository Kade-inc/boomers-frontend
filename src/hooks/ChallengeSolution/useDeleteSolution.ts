import { useMutation, UseMutationResult } from "@tanstack/react-query";
import APIClient from "../../services/apiClient";

interface DeleteSolutionParams {
  challengeId: string;
  solutionId: string;
}

const apiClient = new APIClient("/api/challenges");

export const useDeleteSolution = (): UseMutationResult<
  void,
  Error,
  DeleteSolutionParams
> => {
  return useMutation({
    mutationKey: ["delete-solution"],
    mutationFn: ({ challengeId, solutionId }: DeleteSolutionParams) =>
      apiClient.deleteChallengeSolution(challengeId, solutionId),
  });
};
