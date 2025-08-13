import { useQuery } from "@tanstack/react-query";
import SearchHistory from "../../entities/SearchHistory";
import APIClient from "../../services/apiClient";

// Initialize APIClient
const apiClient = new APIClient("/api/search/history");

const useSearchHistory = (enabled: boolean = false) => {
  return useQuery<SearchHistory[]>({
    queryKey: ["searchHistory"],
    queryFn: async () => {
      const response = await apiClient.getSearchHistory();
      return response;
    },
    enabled,
  });
};

export default useSearchHistory;
