import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
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
  },
  unknown
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["update-solution-rating"],
    mutationFn: ({ challengeId, solutionId, ratingId, rating }) =>
      apiClient.updateSolutionRating(challengeId, solutionId, ratingId, rating),
    onSuccess: ({ challenge_id, solution_id }) => {
      queryClient.invalidateQueries({
        queryKey: ["solution-ratings", challenge_id, solution_id],
      });
    },
  });
};

export default useUpdateSolutionRating;
