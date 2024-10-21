import { useMutation, UseMutationResult } from "@tanstack/react-query";
import APIClient from "../services/apiClient";

const apiClient = new APIClient("/api/users/reset-password");

interface ResetPasswordParams {
  userId: string;
  password: string;
  token: string;
}

const useResetPassword = (): UseMutationResult<
  string,
  Error,
  ResetPasswordParams,
  unknown
> => {
  return useMutation({
    mutationFn: ({ userId, password, token }: ResetPasswordParams) =>
      apiClient.resetPassword(userId, password, token),
  });
};

export default useResetPassword;
