import Comment from "./Comment";

export interface ChallengeStep {
  _id: string;
  user_id: string;
  solution_id: string;
  challenge_id: string;
  comments: Comment[];
  description: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
