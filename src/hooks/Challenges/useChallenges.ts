import { useQuery, UseQueryResult } from "@tanstack/react-query";
import APIClient from "../../services/apiClient";
import Challenge from "../../entities/Challenge";

const apiClient = new APIClient("/api/challenges");

const useChallenges = (
  userId: string = "",
  valid: boolean = true,
): UseQueryResult<Challenge[], Error> => {
  return useQuery<Challenge[], Error>({
    queryKey: ["challenges", userId, "valid", valid],
    queryFn: () => apiClient.getAllChallenges(userId, valid),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export default useChallenges;
