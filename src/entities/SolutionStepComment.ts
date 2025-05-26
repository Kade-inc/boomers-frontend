export interface SolutionStepComment {
  _id: string;
  step_id: string;
  comment: string;
  user: User | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface User {
  _id: string;
  profile: Profile;
}

interface Profile {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  profile_picture: string;
}