/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import APIClient from "../services/apiClient";
import DomainTopic from "../entities/DomainTopic";

const apiClient = new APIClient("/api/domains/domainTopics");

const useDomainTopics = (): UseQueryResult<DomainTopic[], Error> => {
  return useQuery({
    queryKey: ["domain-topics"],
    queryFn: () => apiClient.getDomainTopics(),
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
};

export default useDomainTopics;
