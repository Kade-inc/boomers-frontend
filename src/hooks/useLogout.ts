import { useMutation, UseMutationResult } from "@tanstack/react-query";
import APIClient from "../services/apiClient";

const apiClient = new APIClient("/api/users/logout");

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const useLogout = (): UseMutationResult<any, Error, void, unknown> => {
  return useMutation({
    mutationKey: ["logout"],
    mutationFn: () => apiClient.logout(),
  });
};

export default useLogout;
