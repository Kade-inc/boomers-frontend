/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
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
//   const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["deleteProfilePicture"],
    mutationFn: ({ userId }) =>
      apiClient.deleteProfilePicture(userId),
    // onSuccess: () => {
    //   queryClient.invalidateQueries({ queryKey: ["team-challenges"] });
    // },
  });
};

export default useDeleteProfilePicture;
