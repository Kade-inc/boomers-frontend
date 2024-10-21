export default interface TeamMember {
  _id: string;
  username: string;
  email: string;
  profile: string;
  profile_picture: string | null;
  firstName: string | null;
  lastName: string | null;
}
