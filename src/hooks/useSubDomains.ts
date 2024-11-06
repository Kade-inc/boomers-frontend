/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import APIClient from "../services/apiClient";
import SubDomain from "../entities/SubDomain";

const apiClient = new APIClient("/api/domains");

const useSubDomains = (
  parentDomain: string | null,
): UseQueryResult<any, SubDomain> => {
  return useQuery({
    queryKey: ["sub-domains"],
    queryFn: () => apiClient.getSubDomains(parentDomain!),
    enabled: !!parentDomain, // Only enable when parentDomain has a value
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
};

export default useSubDomains;
