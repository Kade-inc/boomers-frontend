export default interface SubDomain {
  _id: string;
  name: string;
  commonName: string;
  parentDomain: {
    _id: string;
    name: string;
    commonName: string;
  };
  createdAt: string;
  updatedAt: string;
  __v: number;
}
