import { useQuery, UseQueryResult } from "@tanstack/react-query";
import APIClient from "../../services/apiClient";
import Comment from "../../entities/Comment";

const apiClient = new APIClient("/api/challenges");

const useChallengeComments = (
  challengeId: string,
): UseQueryResult<Comment[], Error> => {
  return useQuery<Comment[], Error>({
    queryKey: ["comments", challengeId],
    queryFn: () => apiClient.getChallengeComments(challengeId),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export default useChallengeComments;
