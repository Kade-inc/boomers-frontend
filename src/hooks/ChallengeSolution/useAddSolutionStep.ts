import { useMutation, UseMutationResult } from "@tanstack/react-query";
import APIClient from "../../services/apiClient";
import Challenge from "../../entities/Challenge";

const apiClient = new APIClient("/api/challenges");

const useAddSolutionStep = (): UseMutationResult<
  Challenge,
  Error,
  {
    challengeId: string;
    solutionId: string;
    description: string;
  },
  unknown
> => {
  return useMutation({
    mutationKey: ["post-solution"],
    mutationFn: ({ challengeId, solutionId, description }) =>
      apiClient.addSolutionStep(challengeId, solutionId, description),
    //   onSuccess: ({ challenge_id }) => {
    //     // Invalidate the 'challenge-solutions' query
    //     queryClient.invalidateQueries({
    //       queryKey: ["challenge-solutions", challenge_id], // Explicitly specify the query key
    //     });
    //   },
  });
};

export default useAddSolutionStep;
