export default interface UserProfile {
  successful: boolean;
  profile_picture: string | null;
  firstName: string | null;
  lastName: string | null;
  _id?: string;
  username?: string;
  profile: {
    id: string;
    userId: string;
    email: string;
    phoneNumber: number | null;
    firstName: string | null;
    lastName: string | null;
    bio: string | null;
    interests: Interest;
    username: string;
    gender: string | null;
    profilePicture: string | null;
    createdAt: string;
    updatedAt: string;
  };
}
interface Interest {
  domain: string[];
  subdomain: string[];
  subdomainTopics: string[];
}
