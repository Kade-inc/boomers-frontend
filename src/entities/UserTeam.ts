export default interface UserTeam {
  _id: string;
  owner_id: string;
  name: string;
  teamUsername: string;
  domain: string;
  subdomain: string;
  subdomainTopics: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  teamColor?: string;
  members: Member;
}

interface Member {
  _id: string;
  username: string;
  email: string;
  profile: string;
  profile_picture: string | null;
}
