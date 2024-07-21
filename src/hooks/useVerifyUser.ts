import { useMutation, UseMutationResult, useQuery } from "@tanstack/react-query";
import APIClient from "../services/apiClient";
import verifyUser from "../entities/verifyUser";

const apiClient = new APIClient("/api/users/verify");

const useVerifyUser  = (): UseMutationResult<any, Error, verifyUser, unknown> => {
    return useMutation({
      mutationFn: (data:verifyUser) => apiClient.verifyUser(data)
    });
  };

export default useVerifyUser;