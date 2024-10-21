/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import APIClient from "../services/apiClient";
import Team from "../entities/Team";

const apiClient = new APIClient("/api/teams/recommendations");

const useTeamRecommendations = (): UseQueryResult<Error, Team[]> => {
  return useQuery({
    queryKey: ["team-recommendations"],
    queryFn: () => apiClient.getTeamRecommendations(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export default useTeamRecommendations;
