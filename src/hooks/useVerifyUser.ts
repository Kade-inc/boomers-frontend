import { useMutation, UseMutationResult } from "@tanstack/react-query";
import APIClient from "../services/apiClient";
import { UserVerificationModel } from "../entities/UserVerificationModel";

const apiClient = new APIClient("/api/users/verify");

const useVerifyUser = (): UseMutationResult<
  any,
  Error,
  UserVerificationModel,
  unknown
> => {
  return useMutation({
    mutationFn: (data: UserVerificationModel) => apiClient.verifyUser(data),
  });
};

export default useVerifyUser;
