import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import { SolutionComment } from "../../entities/SolutionComment";
import APIClient from "../../services/apiClient";

interface UpdateSolutionCommentParams {
  challengeId: string;
  solutionId: string;
  commentId: string;
  comment: string;
}

const apiClient = new APIClient("/api/challenges");

export const useUpdateSolutionComment = (): UseMutationResult<
  SolutionComment,
  Error,
  UpdateSolutionCommentParams
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["update-solution-comment"],
    mutationFn: ({
      challengeId,
      solutionId,
      commentId,
      comment,
    }: UpdateSolutionCommentParams) =>
      apiClient.updateSolutionComment(
        challengeId,
        solutionId,
        commentId,
        comment,
      ),
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
