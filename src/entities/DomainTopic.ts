export default interface DomainTopic {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  parentSubdomain?: {
    _id: string;
    name: string;
    commonName: string;
  };
}
