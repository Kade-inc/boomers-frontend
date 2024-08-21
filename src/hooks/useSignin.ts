import { useMutation, UseMutationResult } from "@tanstack/react-query";
import User from "../entities/User";
import APIClient from "../services/apiClient";

const apiClient = new APIClient("/api/users/login");

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const useSignin = (): UseMutationResult<any, Error, User, unknown> => {
  return useMutation({
    mutationFn: (data: User) => apiClient.signin(data),
  });
};

export default useSignin;
