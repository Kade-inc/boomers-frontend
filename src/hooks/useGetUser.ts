import { useQuery, UseQueryResult } from "@tanstack/react-query";
import APIClient from "../services/apiClient";
import UpdatedUserProfile from "../entities/UpdatedUserProfile";

const apiClient = new APIClient("/api/users");

const useGetUser = (
  userId: string,
): UseQueryResult<UpdatedUserProfile, Error> => {
  return useQuery({
    queryKey: ["userProfileById", userId],
    queryFn: () => apiClient.getUserProfileById(userId),
    enabled: !!userId,
    staleTime: 24 * 60 * 60 * 10000, // 24h
  });
};

export default useGetUser;
