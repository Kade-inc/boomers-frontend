import { useMutation, UseMutationResult } from "@tanstack/react-query";
import APIClient from "../../services/apiClient";
import { ChallengeStep } from "../../entities/ChallengeStep";

const apiClient = new APIClient("/api/challenges");

const useUpdateSolutionStep = (): UseMutationResult<
  ChallengeStep,
  Error,
  {
    challengeId: string;
    solutionId: string;
    stepId: string;
    description: string;
  },
  unknown
> => {
  return useMutation({
    mutationKey: ["update-solution-step"],
    mutationFn: ({ challengeId, solutionId, stepId, description }) =>
      apiClient.updateSolutionStep(
        challengeId,
        solutionId,
        stepId,
        description,
      ),
  });
};

export default useUpdateSolutionStep;
