import { useMutation } from "@tanstack/react-query";
import APIClient from "../services/apiClient";
import User from "../entities/User";

const apiClient = new APIClient("/api/users");

const useUpdateUser = (userId: string) => {
  return useMutation({
    mutationKey: ["update-user", userId],
    mutationFn: (updatedProfile: User) =>
      apiClient.updateUserProfile(userId, updatedProfile),
  });
};

export default useUpdateUser;
