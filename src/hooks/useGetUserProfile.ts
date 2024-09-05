import { useQuery, UseQueryResult } from "@tanstack/react-query";
import APIClient from "../services/apiClient";
import UserProfile from "../entities/UserProfile";

const apiClient = new APIClient("/api/users");

const useGetUserProfile = (): UseQueryResult<UserProfile, Error> => {
  return useQuery({
    queryKey: ["userProfile"],
    queryFn: () => apiClient.getUserProfile(),
    staleTime: 24 * 60 * 60 * 10000, //24h
    refetchOnWindowFocus: false,
  });
};

export default useGetUserProfile;
