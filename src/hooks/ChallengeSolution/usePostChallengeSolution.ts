import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import APIClient from "../../services/apiClient";
import Challenge from "../../entities/Challenge";

const apiClient = new APIClient("/api/challenges");

const usePostChallengeSolution = (): UseMutationResult<
  Challenge,
  Error,
  {
    challengeId: string;
  },
  unknown
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["post-solution"],
    mutationFn: ({ challengeId }) =>
      apiClient.postChallengeSolution(challengeId),
    onSuccess: ({ challenge_id }) => {
      // Invalidate the 'challenge-solutions' query
      queryClient.invalidateQueries({
        queryKey: ["challenge-solutions", challenge_id], // Explicitly specify the query key
      });
    },
  });
};

export default usePostChallengeSolution;
