import { useQuery, UseQueryResult } from "@tanstack/react-query";
import APIClient from "../../services/apiClient";
import { ExtendedChallengeInterface } from "../../entities/Challenge";

const apiClient = new APIClient("/api/challenges");

const useChallenge = (
  challengeId: string,
): UseQueryResult<ExtendedChallengeInterface, Error> => {
  return useQuery<ExtendedChallengeInterface, Error>({
    queryKey: ["challenge", challengeId],
    queryFn: () => apiClient.getChallenge(challengeId),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export default useChallenge;
