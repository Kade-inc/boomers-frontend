/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import APIClient from "../services/apiClient";
import UserTeam from "../entities/UserTeam";

const apiClient = new APIClient("/api/teams");

const useTeam = (teamId: string): UseQueryResult<Error, UserTeam> => {
  return useQuery({
    queryKey: ["team", teamId],
    queryFn: () => apiClient.getTeamDetails(teamId),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export default useTeam;
