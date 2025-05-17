export interface SearchResult {
  teams: Teams;
  profiles: Profiles;
  challenges: Challenges;
}

interface Challenges {
  results: ChallengeResult[];
  hasMore: boolean;
}

interface ChallengeResult {
  _id: string;
  challenge_name: string;
}

interface Profiles {
  results: ProfileResult[];
  hasMore: boolean;
}

interface ProfileResult {
  user_id: string;
  firstName: null | string;
  lastName: null | string;
  username: string;
  profile_picture: null | string;
}

interface Teams {
  results: TeamResult[];
  hasMore: boolean;
}

interface TeamResult {
  _id: string;
  name: string;
  teamColor?: string;
}
