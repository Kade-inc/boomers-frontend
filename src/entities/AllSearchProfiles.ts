import Profile from "./Profile";

export interface AllSearchProfilesResponse {
  results: Profile[];
  page: number;
  totalPages: number;
  total: number;
}
