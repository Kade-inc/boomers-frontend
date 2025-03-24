import Team from "./Team";
import User from "./User";

export default interface JoinRequest {
  _id: string;
  owner_id: User;
  team_id: Team;
  user_id: User;
  status: "PENDING" | "APPROVED" | "DECLINED";
  createdAt: string;
  updatedAt: string;
  __v: number;
}
