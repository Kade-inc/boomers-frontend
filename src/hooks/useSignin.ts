import { useMutation, UseMutationResult } from "@tanstack/react-query";
import User from "../entities/User";
import APIClient from "../services/apiClient";

const apiClient = new APIClient("/api/users/login");

const useSignin = (): UseMutationResult<any, Error, User, unknown> => {
  return useMutation({
    mutationFn: (data: User) => apiClient.signin(data),
  });
};

export default useSignin;
