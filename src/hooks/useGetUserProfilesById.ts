import { useQueries } from "@tanstack/react-query";
import APIClient from "../services/apiClient";
import UserProfile from "../entities/UserProfile";

const apiClient = new APIClient("/api/users");

/**
 * Fetches multiple user profiles by their IDs in parallel using React Query.
 * Each profile is cached individually under its own query key.
 * @param userIds - Array of user IDs to fetch profiles for
 * @returns Object containing a Map of profiles and loading state
 */
export const useGetUserProfilesById = (userIds: string[]) => {
  const queries = useQueries({
    queries: userIds.map((userId) => ({
      queryKey: ["userProfile", userId],
      queryFn: () => apiClient.getUserProfileById(userId),
      staleTime: 5 * 60 * 1000, // Cache for 5 minutes
      refetchOnWindowFocus: false,
      enabled: !!userId,
    })),
  });

  // Build a Map of userId -> profile for easy lookup
  const profilesMap = new Map<string, UserProfile>();
  queries.forEach((query, index) => {
    if (query.data) {
      profilesMap.set(userIds[index], query.data);
    }
  });

  const isLoading = queries.some((q) => q.isLoading);
  const hasErrors = queries.some((q) => q.isError);

  return {
    profiles: profilesMap,
    isLoading,
    hasErrors,
    queries, // Expose individual query results if needed
  };
};

export default useGetUserProfilesById;
