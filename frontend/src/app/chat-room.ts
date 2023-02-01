import { ChatMessage } from './chat-message';
import { User } from './user';

export interface ChatRoom
{
	id: string,
	name: string,
	user: User[],
	admin: User[],
	history: ChatMessage[],
	password: string
	isPrivate: Boolean,
}
// TODO: continue adding stuff.
// TODO: is id a String or a Number? 
// TODO: implement history: ChatMessage[]
