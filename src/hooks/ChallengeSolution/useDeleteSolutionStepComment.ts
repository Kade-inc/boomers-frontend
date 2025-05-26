import { useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query';
import APIClient from '../../services/apiClient';

interface DeleteSolutionStepCommentParams {
  challengeId: string;
  stepId: string;
  solutionId: string;
  commentId: string;
}

const apiClient = new APIClient("/api/challenges");

export const useDeleteSolutionStepComment = (): UseMutationResult<
  void,
  Error,
  DeleteSolutionStepCommentParams
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["delete-solution-step-comment"],
    mutationFn: ({ challengeId, stepId, solutionId, commentId }: DeleteSolutionStepCommentParams) =>
      apiClient.deleteSolutionStepComment(challengeId, stepId, solutionId, commentId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["solution-step-comments", variables.challengeId, variables.stepId, variables.solutionId] });
    },
  });
};
