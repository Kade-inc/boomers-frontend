import { useMutation } from "@tanstack/react-query";
import APIClient from "../services/apiClient";

const apiClient = new APIClient("/api/users");

const useUpdateUser = (userId: string) => {
  return useMutation({
    mutationKey: ["update-user", userId],
    mutationFn: (updatedProfile: FormData) =>
      apiClient.updateUserProfile(userId, updatedProfile),
  });
};

export default useUpdateUser;
