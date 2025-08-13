import { useMutation } from "@tanstack/react-query";
import APIClient from "../services/apiClient";

const apiClient = new APIClient("/api/domains");

export const useUpdateSubdomain = () => {
  return useMutation({
    mutationKey: ["update-subdomain"],
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      apiClient.updateSubdomain(id, name),
  });
};
