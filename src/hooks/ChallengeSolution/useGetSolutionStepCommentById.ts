import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { SolutionStepComment } from "../../entities/SolutionStepComment";
import APIClient from "../../services/apiClient";

interface UseGetSolutionStepCommentByIdParams {
  challengeId: string;
  stepId: string;
  solutionId: string;
  commentId: string;
}

const apiClient = new APIClient("/api/challenges");

export const useGetSolutionStepCommentById = ({
  challengeId,
  stepId,
  solutionId,
  commentId,
}: UseGetSolutionStepCommentByIdParams): UseQueryResult<
  SolutionStepComment,
  Error
> => {
  return useQuery<SolutionStepComment, Error>({
    queryKey: [
      "solutionStepComment",
      challengeId,
      stepId,
      solutionId,
      commentId,
    ],
    queryFn: () =>
      apiClient.getSolutionStepCommentById(
        challengeId,
        stepId,
        solutionId,
        commentId,
      ),
    enabled: Boolean(challengeId && stepId && solutionId && commentId),
  });
};
