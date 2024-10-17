/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import APIClient from "../services/apiClient";
import Team from "../entities/Team";

const apiClient = new APIClient("/api/teams");

const useTeams = (): UseQueryResult<Error, Team[]> => {
  return useQuery({
    queryKey: ["teams"],
    queryFn: () => apiClient.getTeams(),
  });
};

export default useTeams;
