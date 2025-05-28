import { useQuery, UseQueryResult } from "@tanstack/react-query";
import APIClient from "../../services/apiClient";
import { SolutionRating } from "../../entities/Rating";

const apiClient = new APIClient("/api/challenges");

const useGetAllSolutionRatings = (
  challengeId: string,
  solutionId: string,
): UseQueryResult<SolutionRating[], Error> => {
  return useQuery<SolutionRating[], Error>({
    queryKey: ["solution-ratings", challengeId, solutionId],
    queryFn: () => apiClient.getSolutionRatings(challengeId, solutionId),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export default useGetAllSolutionRatings;
