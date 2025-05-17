export interface SearchResult {
  teams: Teams;
  profiles: Profiles;
  challenges: Challenges;
}

interface Challenges {
  results: Result3[];
  hasMore: boolean;
}

interface Result3 {
  _id: string;
  challenge_name: string;
}

interface Profiles {
  results: Result2[];
  hasMore: boolean;
}

interface Result2 {
  _id: string;
  firstName: null | string;
  lastName: null | string;
  username: string;
  profile_picture: null | string;
}

interface Teams {
  results: Result[];
  hasMore: boolean;
}

interface Result {
  _id: string;
  name: string;
  teamColor?: string;
}
