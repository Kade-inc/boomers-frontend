/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import APIClient from "../../services/apiClient";

const apiClient = new APIClient("/api/challenges");

const useDeleteComment = (): UseMutationResult<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any,
  Error,
  {
    challengeId: string;
    commentId: string;
  },
  unknown
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["delete-comment"],
    mutationFn: ({ challengeId, commentId }) =>
      apiClient.deleteChallengeComment(challengeId, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
  });
};

export default useDeleteComment;
