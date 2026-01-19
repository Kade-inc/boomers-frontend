import { useQuery, UseQueryResult } from "@tanstack/react-query";
import APIClient from "../services/apiClient";
import UserProfile from "../entities/UserProfile";

const apiClient = new APIClient("/api/users");

/**
 * Fetches a user profile by their ID using React Query.
 * @param userId - The ID of the user to fetch
 * @returns Query result with the user profile data
 */
export const useGetUserProfileById = (
  userId: string | undefined,
): UseQueryResult<UserProfile, Error> => {
  return useQuery({
    queryKey: ["userProfile", userId],
    queryFn: () => apiClient.getUserProfileById(userId!),
    enabled: !!userId, // Only run query if userId is provided
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    refetchOnWindowFocus: false,
  });
};

export default useGetUserProfileById;
