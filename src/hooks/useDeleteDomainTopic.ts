import { useMutation } from "@tanstack/react-query";
import APIClient from "../services/apiClient";

const apiClient = new APIClient("/api/domains");

export const useDeleteDomainTopic = () => {
  return useMutation({
    mutationKey: ["delete-domain-topic"],
    mutationFn: (id: string) => apiClient.deleteDomainTopic(id),
  });
};
