export interface ChallengeSolution {
  _id: string;
  challenge_id: string;
  status: number;
  steps: Step[];
  valid: boolean;
  percentageCompleted: number;
  completedDate: string;
  demo_url: string;
  solution: string;
  owner_rating: null;
  overall_rating: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
  id: string;
  user: User;
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

interface Step {
  user_id: string;
  solution_id: string;
  challenge_id: string;
  description: string;
  completed: boolean;
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  id: string;
}
