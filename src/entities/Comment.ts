export default interface Comment {
  challenge_id: string;
  comment: string;
  user: CommentUser;
  createdAt: string;
  updatedAt: string;
  __v: number;
  _id: string;
}

interface CommentUser {
  _id: string;
  email: string;
  profile: UserProfile;
  username: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface UserProfile {
  _id: string;
  firstName: string;
  lastName: string;
  bio: string | null;
  profile_picture: string;
}
