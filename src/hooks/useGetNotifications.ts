import { useQuery, UseQueryResult } from "@tanstack/react-query";
import APIClient from "../services/apiClient";
import Notification from "../entities/Notification";

// Initialize APIClient
const apiClient = new APIClient("/api/notifications");

const useGetNotifications = (
  isAuthenticated: boolean,
): UseQueryResult<Notification[], Error> => {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: () => apiClient.getNotifications(),
    staleTime: 1000, // 1s
    refetchOnWindowFocus: false,
    enabled: isAuthenticated,
  });
};

export default useGetNotifications;
