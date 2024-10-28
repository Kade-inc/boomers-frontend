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
  profile_picture?: string;
  updatedAt?: string;
  user_id?: string;
  _v?: string;
  _id?: string;
}

interface Interest {
  domain: string;
  subdomain: string;
  subdomainTopics: string[];
}
