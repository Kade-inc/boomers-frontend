import { useMutation, UseMutationResult } from "@tanstack/react-query";
import APIClient from "../services/apiClient";

const apiClient = new APIClient("/api/users/forgot-password");

const useForgotPassword = (): UseMutationResult<
  any,
  Error,
  string,
  unknown
> => {
  return useMutation({
    mutationFn: (email: string) => apiClient.forgotPassword(email),
  });
};

export default useForgotPassword;
