import { useMutation } from "@tanstack/react-query";
import APIClient from "../services/apiClient";

const apiClient = new APIClient("/api/domains");

export const useUpdateDomain = () => {
  return useMutation({
    mutationKey: ["update-domain"],
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      apiClient.updateDomain(id, name),
  });
};
