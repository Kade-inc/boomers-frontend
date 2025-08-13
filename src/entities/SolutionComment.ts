export interface SolutionComment {
  _id: string;
  solution_id: string;
  comment: string;
  user: User;
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
