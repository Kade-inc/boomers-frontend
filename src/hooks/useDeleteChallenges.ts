/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import APIClient from "../services/apiClient";

const apiClient = new APIClient("/api/challenges");

const useDeleteChallenges = (): UseMutationResult<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any,
  Error,
  { challengeIds: string[] },
  unknown
> => {
  return useMutation({
    mutationKey: ["delete-challenges"],
    mutationFn: (payload) => apiClient.deleteChallenges(payload),
  });
};

export default useDeleteChallenges;
