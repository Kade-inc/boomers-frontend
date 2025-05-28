import { useMutation, UseMutationResult } from "@tanstack/react-query";
import APIClient from "../../services/apiClient";
import { SolutionRating } from "../../entities/Rating";

const apiClient = new APIClient("/api/challenges");

const useUpdateSolutionRating = (): UseMutationResult<
  SolutionRating,
  Error,
  {
    challengeId: string;
    solutionId: string;
    ratingId: string;
    rating: number;
    feedback: string;
  },
  unknown
> => {
  return useMutation({
    mutationKey: ["update-solution-rating"],
    mutationFn: ({ challengeId, solutionId, ratingId, rating }) =>
      apiClient.updateSolutionRating(challengeId, solutionId, ratingId, rating),
  });
};

export default useUpdateSolutionRating;
