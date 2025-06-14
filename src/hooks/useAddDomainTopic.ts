/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import APIClient from "../services/apiClient";

const apiClient = new APIClient("/api/domains");

export const useAddDomainTopic = (): UseMutationResult<
  any,
  Error,
  { topic: string; parentId: string },
  unknown
> => {
  return useMutation({
    mutationKey: ["add-domain-topic"],
    mutationFn: (data: { topic: string; parentId: string }) =>
      apiClient.addDomainTopic(data.topic, data.parentId),
  });
};
