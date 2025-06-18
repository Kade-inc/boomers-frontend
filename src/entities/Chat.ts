export interface Chat {
  _id: string;
  members: string[];
  isGroup: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  groupName?: string;
  admin?: string;
}
