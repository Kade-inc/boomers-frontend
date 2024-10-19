/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import ms from "ms";
import APIClient from "../services/apiClient";
import Team from "../entities/Team";

const apiClient = new APIClient("/api/teams");

const useTeams = (userId: string): UseQueryResult<Team, Error> => {
  return useQuery({
    queryKey: ["userTeams", userId],
    queryFn: () => apiClient.getUserTeams(userId),
    staleTime: ms("24h"), // 24h
  });
};

export default useTeams;
