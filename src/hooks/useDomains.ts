/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import APIClient from "../services/apiClient";
import Domain from "../entities/Domain";

const apiClient = new APIClient("/api/domains");

const useDomains = (): UseQueryResult<any, Domain> => {
  return useQuery({
    queryKey: ["domains"],
    queryFn: () => apiClient.getDomains(),
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
};

export default useDomains;
