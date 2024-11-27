import { useMutation, useQueryClient } from "@tanstack/react-query";
import APIClient from "../services/apiClient";

const apiClient = new APIClient("/api/users");

const useUpdateUser = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["update-user", userId],
    mutationFn: (updatedProfile: FormData) =>
      apiClient.updateUserProfile(userId, updatedProfile),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
  });
};

export default useUpdateUser;
