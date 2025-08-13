import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
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
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["update-solution"],
    mutationFn: ({ challengeId, solutionId, payload }) =>
      apiClient.updateSolution(challengeId, solutionId, payload),
    onSuccess: ({ challengeId }) => {
      queryClient.invalidateQueries({
        queryKey: ["challenge-solutions", challengeId],
      });
    },
  });
};

export default useUpdateSolution;
