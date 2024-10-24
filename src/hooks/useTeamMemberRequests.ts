/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import APIClient from "../services/apiClient";
import TeamMember from "../entities/TeamMember";

const apiClient = new APIClient("/api/team-member");

const useTeamMemberRequests = (
  teamId: string,
): UseQueryResult<any, TeamMember[]> => {
  return useQuery({
    queryKey: ["team-member-requests", teamId],
    queryFn: () => apiClient.getTeamMemberRequests(teamId),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export default useTeamMemberRequests;
