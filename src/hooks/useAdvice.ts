/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import APIClient from "../services/apiClient";

const apiClient = new APIClient("/api/advice");

const useAdvice = (): UseQueryResult<string, Error> => {
  return useQuery({
    queryKey: ["advice"],
    queryFn: () => apiClient.getAdvice(),
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
};

export default useAdvice;
