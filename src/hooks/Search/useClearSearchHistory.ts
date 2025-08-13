import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import APIClient from "../../services/apiClient";

const apiClient = new APIClient("/api/search/history");

const useClearSearchHistory = (): UseMutationResult<
  void,
  Error,
  void,
  unknown
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => apiClient.clearSearchHistory(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["searchHistory"] });
    },
  });
};

export default useClearSearchHistory;
