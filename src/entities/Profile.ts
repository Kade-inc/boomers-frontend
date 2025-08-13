export default interface Profile {
  _id: string;
  user_id: string;
  email: string;
  username: string;
  firstName: string | null;
  lastName: string | null;
  bio: string | null;
  job: string | null;
  location: string | null;
  phoneNumber: string | null;
  interests: string | null;
  gender: string | null;
  profile_picture: string | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
  website?: string | null;
}
