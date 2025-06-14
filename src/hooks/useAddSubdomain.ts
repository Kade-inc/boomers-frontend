/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import APIClient from "../services/apiClient";

const apiClient = new APIClient("/api/domains");

export const useAddSubdomain = (): UseMutationResult<
  any,
  Error,
  { subdomain: string; parentId: string },
  unknown
> => {
  return useMutation({
    mutationKey: ["add-subdomain"],
    mutationFn: (data: { subdomain: string; parentId: string }) =>
      apiClient.addSubdomain(data.subdomain, data.parentId),
  });
};
