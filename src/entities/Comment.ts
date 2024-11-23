import User from "./User";

export default interface Comment {
  challenge_id: string;
  comment: string;
  user: User;
  createdAt: string;
  updatedAt: string;
  __v: number;
  _id: string;
}
