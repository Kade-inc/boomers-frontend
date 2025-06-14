import { useMutation } from "@tanstack/react-query";
import APIClient from "../services/apiClient";

const apiClient = new APIClient("/api/domains");

export const useDeleteDomain = () => {
  return useMutation({
    mutationKey: ["delete-domain"],
    mutationFn: (id: string) => apiClient.deleteDomain(id),
  });
};
