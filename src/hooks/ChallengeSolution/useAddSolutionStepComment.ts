import { useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query';
import { SolutionStepComment } from '../../entities/SolutionStepComment';
import APIClient from '../../services/apiClient';

interface AddSolutionStepCommentParams {
  challengeId: string;
  stepId: string;
  solutionId: string;
  comment: string;
}

const apiClient = new APIClient("/api/challenges");

export const useAddSolutionStepComment = (): UseMutationResult<
  SolutionStepComment,
  Error,
  AddSolutionStepCommentParams
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["add-solution-step-comment"],
    mutationFn: ({ challengeId, stepId, solutionId, comment }: AddSolutionStepCommentParams) =>
      apiClient.postSolutionStepComment(challengeId, stepId, solutionId, comment),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["solution-step-comments", variables.challengeId, variables.stepId, variables.solutionId] });
    },
  });
};
