import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import { SolutionComment } from "../../entities/SolutionComment";
import APIClient from "../../services/apiClient";

interface AddSolutionCommentParams {
  challengeId: string;
  solutionId: string;
  comment: string;
}

const apiClient = new APIClient("/api/challenges");

export const useAddSolutionComment = (): UseMutationResult<
  SolutionComment,
  Error,
  AddSolutionCommentParams
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["add-solution-comment"],
    mutationFn: ({
      challengeId,
      solutionId,
      comment,
    }: AddSolutionCommentParams) =>
      apiClient.postSolutionComment(challengeId, solutionId, comment),
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
