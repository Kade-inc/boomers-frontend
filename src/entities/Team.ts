export default interface Team {
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
}
