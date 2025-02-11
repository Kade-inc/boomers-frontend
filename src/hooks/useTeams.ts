/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import APIClient from "../services/apiClient";
import Team from "../entities/Team";

const apiClient = new APIClient("/api/teams");

const useTeams = (
  userId: string = "",
  page: number = 1,
): UseQueryResult<any, Team[]> => {
  return useQuery({
    queryKey: ["teams", userId, page],
    queryFn: () => apiClient.getTeams(userId, page),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export default useTeams;
