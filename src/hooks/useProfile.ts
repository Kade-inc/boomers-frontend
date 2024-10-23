/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import APIClient from "../services/apiClient";
import Team from "../entities/Team";

const apiClient = new APIClient("/api/users");

const useProfile = (): UseQueryResult<Error, Team[]> => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: () => apiClient.getUserProfile(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export default useProfile;
