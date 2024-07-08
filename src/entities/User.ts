export default interface User {
  email: string;
  phoneNumber?: string;
  password: string;
  isVerified?: boolean;
  username: string;
}
