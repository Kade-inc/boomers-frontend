import { useInfiniteQuery } from "@tanstack/react-query";
import APIClient from "../../services/apiClient";

interface SearchResult {
  _id: string;
  name: string;
  type: string;
  domain?: string;
  subdomain?: string;
  subdomainTopics?: string[];
  teamColor?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  profile_picture?: string;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalResults: number;
}

interface SearchResponse {
  results: SearchResult[];
  pagination: PaginationInfo;
}

const useSearchUserAndTeams = (
  enabled: boolean,
  query: string,
  pageSize: number,
) => {
  const apiClient = new APIClient();
  return useInfiniteQuery<SearchResponse>({
    queryKey: ["search-users-and-teams", query],
    queryFn: ({ pageParam = 1 }) =>
      apiClient.searchUsersAndTeams(query, pageParam as number, pageSize),
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.currentPage < lastPage.pagination.totalPages) {
        return lastPage.pagination.currentPage + 1;
      }
      return undefined;
    },
    enabled,
    initialPageParam: 1,
  });
};

export default useSearchUserAndTeams;
