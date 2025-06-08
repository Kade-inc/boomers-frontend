import { useQuery, UseQueryResult } from "@tanstack/react-query";
import APIClient from "../services/apiClient";
import SubDomain from "../entities/SubDomain";

const apiClient = new APIClient("/api/domains");

const useGetAllSubdomains = (): UseQueryResult<SubDomain[], Error> => {
  return useQuery({
    queryKey: ["subdomains"],
    queryFn: () => apiClient.getAllSubDomains(),
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
};

export default useGetAllSubdomains;
