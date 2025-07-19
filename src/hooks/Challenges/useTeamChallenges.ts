/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import APIClient from "../../services/apiClient";
import Challenge from "../../entities/Challenge";

const apiClient = new APIClient("/api/teams");

const useTeamChallenges = (
  teamId: string,
  isLoggedIn: boolean,
): UseQueryResult<any, Challenge[]> => {
  return useQuery({
    queryKey: ["team-challenges", teamId],
    queryFn: () => apiClient.getTeamChallenges(teamId),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
    enabled: isLoggedIn,
  });
};

export default useTeamChallenges;
