import { useMutation, UseMutationResult } from "@tanstack/react-query";
import APIClient from "../services/apiClient";

const apiClient = new APIClient("/api/users/forgot-password");

const useForgotPassword = (): UseMutationResult<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any,
  Error,
  string,
  unknown
> => {
  return useMutation({
    mutationKey: ["forgot-password"],
    mutationFn: (email: string) => apiClient.forgotPassword(email),
  });
};

export default useForgotPassword;
