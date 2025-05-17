import { useQuery, UseQueryResult } from "@tanstack/react-query";
import APIClient from "../../services/apiClient";
import { AllSearchProfilesResponse } from "../../entities/AllSearchProfiles";

// Initialize APIClient
const apiClient = new APIClient("/api/search/profiles");

const useAllSearchProfiles = (
  query: string,
  page: string,
): UseQueryResult<AllSearchProfilesResponse, Error> => {
  return useQuery({
    queryKey: ["allSearchProfiles", query, page],
    queryFn: () => apiClient.getAllSearchProfiles(query, page),
    staleTime: 1000 * 60 * 5, // 5 mins
    refetchOnWindowFocus: false, // Only fetch if query is not empty
  });
};

export default useAllSearchProfiles;
