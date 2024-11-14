import Reward from "./Reward";

export default interface Challenge {
  _id: string;
  owner_id?: string;
  team_id?: string;
  challenge_name?: string;
  due_date?: string;
  difficulty?: number;
  description?: string;
  resources?: string;
  comments?: Comment;
  image_url?: string;
  valid?: boolean;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
  reward?: Reward;
}

export type ExtendedChallengeInterface = Challenge & {
  teamName?: string;
};
