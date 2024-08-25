/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import User from "../entities/User";
import APIClient from "../services/apiClient";

const apiClient = new APIClient("/api/users/register");

const useSignup = (): UseMutationResult<any, Error, User, unknown> => {
  return useMutation({
    mutationFn: (data: User) => apiClient.signup(data),
  });
};

export default useSignup;
