import { useMutation } from "@tanstack/react-query";
import APIClient from "../services/apiClient";

const apiClient = new APIClient("/api/domains");

export const useDeleteSubdomain = () => {
  return useMutation({
    mutationKey: ["delete-subdomain"],
    mutationFn: (id: string) => apiClient.deleteSubdomain(id),
  });
};
