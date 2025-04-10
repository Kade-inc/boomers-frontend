/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import APIClient from "../services/apiClient";

const apiClient = new APIClient("/api/users");

const useDeleteProfilePicture = (): UseMutationResult<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any,
  Error,
  {
    userId: string;
  },
  unknown
> => {
  return useMutation({
    mutationKey: ["deleteProfilePicture"],
    mutationFn: ({ userId }) => apiClient.deleteProfilePicture(userId),
  });
};

export default useDeleteProfilePicture;
