import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import APIClient from "../../services/apiClient";

const apiClient = new APIClient("/api/notifications/read-all");

interface MarkAllReadResponse {
  acknowledged: boolean;
  modifiedCount: number;
  upsertedId: null;
  upsertedCount: number;
  matchedCount: number;
}
const useMarkAllNotificationsRead = (): UseMutationResult<
  MarkAllReadResponse,
  Error,
  object,
  unknown
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["mark-all-read"],
    mutationFn: () => apiClient.markAllNotificationsAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};

export default useMarkAllNotificationsRead;
