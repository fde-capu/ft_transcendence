export interface ChatRoom {
  id: string;
  name: string;
  user: string[];
  admin: string[];
  blocked?: string[];
  muted?: string[];
  password?: string;
  isPrivate: boolean;
}
