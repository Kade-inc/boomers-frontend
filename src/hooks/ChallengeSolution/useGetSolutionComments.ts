import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { SolutionComment } from "../../entities/SolutionComment";
import APIClient from "../../services/apiClient";

interface UseGetSolutionCommentsParams {
  challengeId: string;
  solutionId: string;
}

const apiClient = new APIClient("/api/challenges");

export const useGetSolutionComments = ({
  challengeId,
  solutionId,
}: UseGetSolutionCommentsParams): UseQueryResult<SolutionComment[], Error> => {
  return useQuery<SolutionComment[], Error>({
    queryKey: ["solution-comments", challengeId, solutionId],
    queryFn: () => apiClient.getSolutionComments(challengeId, solutionId),
    enabled: Boolean(challengeId && solutionId),
  });
};
