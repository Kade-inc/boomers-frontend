/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import APIClient from "../../services/apiClient";

const apiClient = new APIClient("/api/challenges");

const useDeleteSolutionStep = (): UseMutationResult<
  any,
  Error,
  {
    challengeId: string;
    solutionId: string;
    stepId: string;
  },
  unknown
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["delete-solution-step"],
    mutationFn: ({ challengeId, solutionId, stepId }) =>
      apiClient.deleteSolutionStep(challengeId, solutionId, stepId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["solution-steps"] });
    },
  });
};

export default useDeleteSolutionStep;
