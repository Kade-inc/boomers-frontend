import { useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query';
import { SolutionStepComment } from '../../entities/SolutionStepComment';
import APIClient from '../../services/apiClient';

interface UpdateSolutionStepCommentParams {
  challengeId: string;
  stepId: string;
  solutionId: string;
  commentId: string;
comment: string;
}

const apiClient = new APIClient("/api/challenges");

export const useUpdateSolutionStepComment = (): UseMutationResult<
  SolutionStepComment,
  Error,
  UpdateSolutionStepCommentParams
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["update-solution-step-comment"],
    mutationFn: ({ challengeId, stepId, solutionId, commentId, comment }: UpdateSolutionStepCommentParams) =>
      apiClient.updateSolutionStepComment(challengeId, stepId, solutionId, commentId, comment),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["solution-step-comments", variables.challengeId, variables.stepId, variables.solutionId] });
    },
  });
};
