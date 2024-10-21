import TeamMember from "./TeamMember";

export default interface Request {
  _id: string;
  owner_id: string;
  team_id: string;
  user_id: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  userProfile: TeamMember;
}
