import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import APIClient from "../../services/apiClient";

interface DeleteSolutionRatingParams {
  challengeId: string;
  solutionId: string;
  ratingId: string;
}

const apiClient = new APIClient("/api/challenges");

export const useDeleteSolutionRating = (): UseMutationResult<
  void,
  Error,
  DeleteSolutionRatingParams
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["delete-solution-rating"],
    mutationFn: ({
      challengeId,
      solutionId,
      ratingId,
    }: DeleteSolutionRatingParams) =>
      apiClient.deleteSolutionRating(challengeId, solutionId, ratingId),
    onSuccess: ({ challengeId, solutionId }) => {
      queryClient.invalidateQueries({
        queryKey: ["solution-ratings", challengeId, solutionId],
      });
    },
  });
};
