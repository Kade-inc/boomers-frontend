import Comment from "./Comment";

export interface ChallengeSolution {
  _id: string;
  challenge_id: string;
  user_id: string;
  status: number;
  steps: Step[];
  valid: boolean;
  comments: Comment[];
  percentageCompleted: number;
  completedDate: null;
  demo_url: null;
  solution: null;
  owner_rating: null;
  overall_rating: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface Step {
  user_id: string;
  solution_id: string;
  challenge_id: string;
  comments: Comment[];
  description: string;
  completed: boolean;
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
