import { ChatMessage } from './chat-message';

export interface ChatRoom
{
	id: string,
	name: string,
	user: string[],
	admin: string[],
	blocked: string[],
	history: ChatMessage[],
	password: string,
	isPrivate: boolean
}
// TODO: continue adding stuff.
// TODO: is id a string or a Number? 
// TODO: implement history: ChatMessage[]
