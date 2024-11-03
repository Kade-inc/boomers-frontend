/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import APIClient from "../services/apiClient";
import Challenge from "../entities/Challenge";

const apiClient = new APIClient("/api/challenges");

const useChallenges = (userId: string): UseQueryResult<any, Challenge[]> => {
  return useQuery({
    queryKey: ["challenges", userId],
    queryFn: () => apiClient.getAllChallenges(userId),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export default useChallenges;
