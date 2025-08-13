import { useQuery, UseQueryResult } from "@tanstack/react-query";
import APIClient from "../../services/apiClient";
import { ChallengeSolution } from "../../entities/ChallengeSolution";

const apiClient = new APIClient("/api/challenges");

const useGetAllChallengeSolutions = (
  challengeId: string,
): UseQueryResult<ChallengeSolution[], Error> => {
  return useQuery<ChallengeSolution[], Error>({
    queryKey: ["challenge-solutions", challengeId],
    queryFn: () => apiClient.getAllChallengeSolutions(challengeId),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export default useGetAllChallengeSolutions;
