import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
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
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["post-solution-rating"],
    mutationFn: ({ challengeId, solutionId, rating }) =>
      apiClient.postSolutionRating(challengeId, solutionId, rating),
    onSuccess: ({ challenge_id, solution_id }) => {
      queryClient.invalidateQueries({
        queryKey: ["solution-ratings", challenge_id, solution_id],
      });
    },
  });
};

export default usePostSolutionRating;
