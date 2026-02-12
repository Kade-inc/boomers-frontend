import { ChatMessage } from "./ChatMessage";

export interface Chat {
  _id: string;
  members: string[];
  isGroup: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  groupName?: string;
  admin?: string;
  teamId?: string;
  teamColor?: string;
  lastMessage?: ChatMessage | null;
  unreadCount?: number;
}
