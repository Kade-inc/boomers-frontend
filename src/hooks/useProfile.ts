import { useQuery, UseQueryResult } from "@tanstack/react-query";
import APIClient from "../services/apiClient";
import UpdatedUserProfile from "../entities/UpdatedUserProfile";

const apiClient = new APIClient("/api/users");

const useProfile = (): UseQueryResult<UpdatedUserProfile, Error> => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: () => apiClient.getUserProfile(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export default useProfile;
