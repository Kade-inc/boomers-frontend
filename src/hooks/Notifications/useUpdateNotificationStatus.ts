import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import APIClient from "../../services/apiClient";
import Notification from "../../entities/Notification";

const apiClient = new APIClient("/api/notifications");

const useUpdateNotificationStatus = (
  notificationId: string,
): UseMutationResult<
  Notification,
  Error,
  {
    isRead: boolean;
  },
  unknown
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["update-notification-status", notificationId],
    mutationFn: ({ isRead }) =>
      apiClient.updateNotificationStatus(notificationId, isRead),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};

export default useUpdateNotificationStatus;
