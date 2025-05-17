import Challenge from "./Challenge";

export interface AllSearchChallengesResponse {
  results: Challenge[];
  page: number;
  totalPages: number;
  total: number;
}
