import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import APIClient from "../../services/apiClient";

interface DeleteSolutionCommentParams {
  challengeId: string;
  solutionId: string;
  commentId: string;
}

const apiClient = new APIClient("/api/challenges");

export const useDeleteSolutionComment = (): UseMutationResult<
  void,
  Error,
  DeleteSolutionCommentParams
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["delete-solution-comment"],
    mutationFn: ({
      challengeId,
      solutionId,
      commentId,
    }: DeleteSolutionCommentParams) =>
      apiClient.deleteSolutionComment(challengeId, solutionId, commentId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [
          "solution-comments",
          variables.challengeId,
          variables.solutionId,
        ],
      });
    },
  });
};
