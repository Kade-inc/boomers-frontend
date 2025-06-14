import { useMutation } from "@tanstack/react-query";
import APIClient from "../services/apiClient";

const apiClient = new APIClient("/api/domains");

export const useUpdateDomainTopic = () => {
  return useMutation({
    mutationKey: ["update-domain-topic"],
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      apiClient.updateDomainTopic(id, name),
  });
};
