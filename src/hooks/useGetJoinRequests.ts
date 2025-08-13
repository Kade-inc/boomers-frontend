import { useQuery, UseQueryResult } from "@tanstack/react-query";
import APIClient from "../services/apiClient";
import JoinRequest from "../entities/JoinRequest";

const apiClient = new APIClient("/api/user-requests");

const useGetJoinRequests = (): UseQueryResult<JoinRequest[], Error> => {
  return useQuery({
    queryKey: ["joinRequests"],
    queryFn: () => apiClient.getAllJoinRequests(),
    staleTime: 24 * 60 * 60 * 1000,
  });
};

export default useGetJoinRequests;
