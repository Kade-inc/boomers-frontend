import { useQuery, UseQueryResult } from "@tanstack/react-query";
import APIClient from "../../services/apiClient";
import { ExpandedChallengeSolution } from "../../entities/ExpandedChallengeSolution";

const apiClient = new APIClient("/api/challenges");

const useGetSolution = (
  challengeId: string,
  solutionId: string,
): UseQueryResult<ExpandedChallengeSolution, Error> => {
  return useQuery<ExpandedChallengeSolution, Error>({
    queryKey: ["challenge-solution", challengeId, solutionId],
    queryFn: () => apiClient.getSolution(challengeId, solutionId),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export default useGetSolution;
