import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import APIClient from "../../services/apiClient";

const apiClient = new APIClient("/api/challenges");

interface PostCommentPayload {
  challengeId: string;
  comment: string;
}

interface PostCommentResponse {
  challenge_id: string;
  comment: string;
  user: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const usePostChallengeComment = (): UseMutationResult<
  PostCommentResponse,
  Error,
  PostCommentPayload,
  unknown
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["post-comment"],
    mutationFn: ({ challengeId, comment }) =>
      apiClient.postChallengeComment(challengeId, comment),
    onSuccess: () => {
      // Invalidate the 'comments' query
      queryClient.invalidateQueries({
        queryKey: ["comments"], // Explicitly specify the query key
      });
    },
  });
};

export default usePostChallengeComment;
