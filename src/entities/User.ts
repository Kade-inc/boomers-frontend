import DomainTopic from "./DomainTopic";
import UserProfile from "./UserProfile";

export default interface User {
  email?: string;
  phoneNumber?: string;
  password?: string;
  confirmpassword?: string;
  isVerified?: boolean;
  username?: string;
  accountId?: string;
  bio?: string;
  createdAt?: string;
  firstName?: string;
  gender?: string;
  interests?: Interest | null;
  lastName?: string;
  profile_picture?: string | null;
  profile?: UserProfile;
  updatedAt?: string;
  user_id?: string;
  _v?: string;
  _id?: string;
  job?: string;
  location?: string;
  city?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  locationGeo?: {
    type: "Point";
    coordinates: [number, number]; // [longitude, latitude]
  };
  role?: string;
}

interface Interest {
  domain: string[];
  subdomain: string[];
  domainTopics: DomainTopic[];
}
