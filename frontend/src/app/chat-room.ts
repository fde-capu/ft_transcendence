import { ChatMessage } from './chat-message';
import { User } from './user';

export interface ChatRoom {
  id: string;
  name: string;
  user: User[];
  admin: User[];
  blocked: User[];
  history: ChatMessage[];
  password: string;
  isPrivate: boolean;
}
// TODO: continue adding stuff.
// TODO: is id a string or a Number?
// TODO: implement history: ChatMessage[]
