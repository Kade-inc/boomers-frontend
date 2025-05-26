import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { SolutionStepComment } from "../../entities/SolutionStepComment";
import APIClient from "../../services/apiClient";

interface UseGetSolutionStepCommentsParams {
  challengeId: string;
  stepId: string;
  solutionId: string;
}

const apiClient = new APIClient("/api/challenges");

export const useGetSolutionStepComments = ({
  challengeId,
  stepId,
  solutionId,
}: UseGetSolutionStepCommentsParams): UseQueryResult<
  SolutionStepComment[],
  Error
> => {
  return useQuery<SolutionStepComment[], Error>({
    queryKey: ["solutionStepComments", challengeId, stepId, solutionId],
    queryFn: () =>
      apiClient.getSolutionStepComments(challengeId, stepId, solutionId),
    enabled: Boolean(challengeId && stepId && solutionId),
  });
};
