import { useQuery, UseQueryResult } from "@tanstack/react-query";
import APIClient from "../../services/apiClient";
import { ExpandedChallengeSolution } from "../../entities/ExpandedChallengeSolution";
import { AxiosError } from "axios";

const apiClient = new APIClient("/api/challenges");

const useGetSolution = (
  challengeId: string,
  solutionId: string,
): UseQueryResult<ExpandedChallengeSolution, Error> => {
  return useQuery<ExpandedChallengeSolution, Error>({
    queryKey: ["challenge-solution", challengeId, solutionId],
    queryFn: () => apiClient.getSolution(challengeId, solutionId),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: (failureCount, error) => {
      if (error instanceof AxiosError && error.response?.status === 404) {
        return false; // Don't retry on 404
      }
      return failureCount < 3; // Retry up to 3 times for other errors
    },
  });
};

export default useGetSolution;
