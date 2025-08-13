import { useQuery, UseQueryResult } from "@tanstack/react-query";
import APIClient from "../../services/apiClient";
import { AllSearchTeamsResponse } from "../../entities/AllSearchTeams";

// Initialize APIClient
const apiClient = new APIClient("/api/search/teams");

const useAllSearchTeams = (
  query: string,
  page: string,
): UseQueryResult<AllSearchTeamsResponse, Error> => {
  return useQuery({
    queryKey: ["allSearchTeams", query, page],
    queryFn: () => apiClient.getAllSearchTeams(query, page),
    staleTime: 1000 * 60 * 5, // 5 mins
    refetchOnWindowFocus: false, // Only fetch if query is not empty
  });
};

export default useAllSearchTeams;
