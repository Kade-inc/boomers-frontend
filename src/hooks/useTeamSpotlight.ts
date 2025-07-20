/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import APIClient from "../services/apiClient";
import Team from "../entities/Team";

const apiClient = new APIClient("/api/teams/spotlight");

const useTeamSpotlight = (): UseQueryResult<any, Team> => {
  return useQuery({
    queryKey: ["spotlight"],
    queryFn: () => apiClient.getTeamSpotlight(),
    staleTime: 1000 * 60 * 1, // 5 minutes
    enabled: false,
  });
};

export default useTeamSpotlight;
