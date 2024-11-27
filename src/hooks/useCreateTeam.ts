/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import APIClient from "../services/apiClient";
import Team from "../entities/Team";

const apiClient = new APIClient("/api/teams");

const useCreateTeam = (): UseMutationResult<any, Error, Team, unknown> => {
  return useMutation({
    mutationKey: ["create-team"],
    mutationFn: (data: Team) => apiClient.createTeam(data),
  });
};

export default useCreateTeam;
