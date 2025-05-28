import { useQuery, UseQueryResult } from "@tanstack/react-query";
import APIClient from "../../services/apiClient";
import { SolutionRating } from "../../entities/Rating";

const apiClient = new APIClient("/api/challenges");

const useGetSolutionRating = (
  challengeId: string,
  solutionId: string,
  ratingId: string,
): UseQueryResult<SolutionRating, Error> => {
  return useQuery<SolutionRating, Error>({
    queryKey: ["solution-rating", challengeId, solutionId, ratingId],
    queryFn: () =>
      apiClient.getSolutionRatingById(challengeId, solutionId, ratingId),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export default useGetSolutionRating;
