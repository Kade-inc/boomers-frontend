import { useMutation } from "@tanstack/react-query";
import APIClient from "../services/apiClient";

const apiClient = new APIClient("/api/domains");

export const useAddDomain = () => {
  return useMutation({
    mutationKey: ["add-domain"],
    mutationFn: (domain: string) => apiClient.addDomain(domain),
  });
};
