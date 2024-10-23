/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import APIClient from "../services/apiClient";
import Advice from "../entities/Advice";

const apiClient = new APIClient("/api/advice");

const useAdvice = (): UseQueryResult<any, Advice> => {
  return useQuery({
    queryKey: ["advice"],
    queryFn: () => apiClient.getAdvice(),
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
};

export default useAdvice;
