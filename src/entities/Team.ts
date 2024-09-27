export default interface Team {
  _id: string;
  owner_id: string;
  name: string;
  teamUsername: string;
  domain: string;
  subdomain: string;
  subDomainTopics: string[];
  createdAt: string;
  updatedAt: string;
  _v: number;
}
export default interface UserTeamsResponse {
  message: string;
  data: Team[];
}
