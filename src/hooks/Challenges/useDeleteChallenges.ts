/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import APIClient from "../../services/apiClient";

const apiClient = new APIClient("/api/challenges");

const useDeleteChallenges = (): UseMutationResult<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any,
  Error,
  { challengeIds: string[] },
  unknown
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["delete-challenges"],
    mutationFn: (payload: { challengeIds: string[] }) =>
      apiClient.deleteChallenges(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team-challenges"] });
    },
  });
};

export default useDeleteChallenges;
