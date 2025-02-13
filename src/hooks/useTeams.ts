/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import APIClient from "../services/apiClient";
import Team from "../entities/Team";
import DomainTopic from "../entities/DomainTopic";

const apiClient = new APIClient("/api/teams");

interface TeamFilters {
  userId?: string;
  page?: number;
  limit?: number;
  domain?: string | { _id: string; name: string };
  subdomain?: string;
  subdomainTopics?: DomainTopic[]; // We'll convert this to a comma-separated string.
  name?: string;
}

const useTeams = (filters: TeamFilters = {}): UseQueryResult<any, Team[]> => {
  const {
    userId = "",
    page = 1,
    limit = 10,
    domain,
    subdomain,
    subdomainTopics,
    name,
  } = filters;

  const domainQuery =
    domain && typeof domain === "object" ? domain.name : domain;

  // Convert the topics array into a comma-separated string, if it exists.
  const topicsQuery =
    subdomainTopics && subdomainTopics.length
      ? subdomainTopics.map((topic) => topic.name).join(",")
      : undefined;

  return useQuery({
    queryKey: [
      "teams",
      userId,
      page,
      domainQuery,
      subdomain,
      topicsQuery,
      name,
    ],
    queryFn: () =>
      apiClient.getTeams({
        userId,
        page,
        limit,
        domain: domainQuery,
        subdomain,
        subdomainTopics: topicsQuery,
        name,
      }),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export default useTeams;
