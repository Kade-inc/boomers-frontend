import { useQuery, UseQueryResult } from "@tanstack/react-query";
import APIClient from "../../services/apiClient";
import { AllSearchChallengesResponse } from "../../entities/AllSearchChallenges";

// Initialize APIClient
const apiClient = new APIClient("/api/search/challenges");

const useAllSearchChallenges = (
  query: string,
  page: string,
): UseQueryResult<AllSearchChallengesResponse, Error> => {
  return useQuery({
    queryKey: ["allSearchChallenges", query, page],
    queryFn: () => apiClient.getAllSearchChallenges(query, page),
    staleTime: 1000 * 60 * 5, // 5 mins
    refetchOnWindowFocus: false, // Only fetch if query is not empty
  });
};

export default useAllSearchChallenges;
