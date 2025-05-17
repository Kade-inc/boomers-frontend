import { useQuery, UseQueryResult } from "@tanstack/react-query";
import APIClient from "../../services/apiClient";
import { SearchResult } from "../../entities/SearchResults";

// Initialize APIClient
const apiClient = new APIClient("/api/search");

const useSearchResults = (
  query: string,
): UseQueryResult<SearchResult, Error> => {
  return useQuery({
    queryKey: ["searchResult", query],
    queryFn: () => apiClient.getSearchResults(query),
    staleTime: 1000 * 60 * 5, // 5 mins
    refetchOnWindowFocus: false,
    enabled: query.length > 0, // Only fetch if query is not empty
  });
};

export default useSearchResults;
