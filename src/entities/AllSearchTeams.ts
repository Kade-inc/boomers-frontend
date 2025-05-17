interface Team {
  _id: string;
  owner_id: string;
  name: string;
  teamUsername: string;
  domain: string;
  subdomain: string;
  subdomainTopics: string[];
  teamColor: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface AllSearchTeamsResponse {
  results: Team[];
  page: number;
  totalPages: number;
  total: number;
}
