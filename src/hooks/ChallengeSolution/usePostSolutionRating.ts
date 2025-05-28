import { useMutation, UseMutationResult } from "@tanstack/react-query";
import APIClient from "../../services/apiClient";
import Challenge from "../../entities/Challenge";

const apiClient = new APIClient("/api/challenges");

const usePostSolutionRating = (): UseMutationResult<
  Challenge,
  Error,
  {
    challengeId: string;
    solutionId: string;
    rating: number;
  },
  unknown
> => {
  return useMutation({
    mutationKey: ["post-solution-rating"],
    mutationFn: ({ challengeId, solutionId, rating }) =>
      apiClient.postSolutionRating(challengeId, solutionId, rating),
  });
};

export default usePostSolutionRating;
