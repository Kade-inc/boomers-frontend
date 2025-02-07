export default interface UpdatedUserProfile {
  id: string;
  userId: string;
  email: string;
  phoneNumber: number | null;
  firstName: string | null;
  lastName: string | null;
  bio: string | null;
  interests: Interests | null;
  username: string;
  gender: string | null;
  profilePicture: string | null;
  createdAt: string;
  updatedAt: string;
}

interface Interests {
  domain: string[];
  subdomain: string[];
  domainTopics: string[];
}
