import Comment from "./Comment";

export interface ExpandedChallengeSolution {
  _id: string;
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
  challenge: Challenge;
}

interface Challenge {
  _id: string;
  owner_id: string;
  team_id: string;
  comments: Comment[];
  valid: boolean;
  createdAt: string;
  updatedAt: string;
  challenge_name: string;
  difficulty: number;
  due_date: string;
  description: string;
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
