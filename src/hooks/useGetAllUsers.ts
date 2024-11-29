import { useQuery, UseQueryResult } from "@tanstack/react-query";
import APIClient from "../services/apiClient";
import User from "../entities/User";

// Initialize APIClient
const apiClient = new APIClient("/api/users");

const useGetAllUsers = (
  searchQuery?: string,
): UseQueryResult<User[], Error> => {
  return useQuery({
    queryKey: ["users", searchQuery],
    queryFn: () => apiClient.getUsers(searchQuery),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
    refetchOnWindowFocus: false,
  });
};

export default useGetAllUsers;
