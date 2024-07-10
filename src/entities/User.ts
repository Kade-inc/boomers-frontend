export default interface User {
  email: string;
  phoneNumber?: string;
  password: string;
  confirmpassword?: string;
  isVerified?: boolean;
  username?: string;
}
