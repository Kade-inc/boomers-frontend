export default interface Notification {
  _id: string;
  user?: string;
  message: string;
  isRead: boolean;
  reference: string;
  referenceModel: string;
  createdAt: string;
  updatedAt?: string;
  __v?: number;
}
