import { useMutation } from "@tanstack/react-query";
import APIClient from "../services/apiClient";

const apiClient = new APIClient("api/users");

const useDeleteAccount = (userId: string) => {
  return useMutation({
    mutationKey: ["deleteAccount", userId],
    mutationFn: () => apiClient.deleteAccount(userId),
  });
};

export default useDeleteAccount;
