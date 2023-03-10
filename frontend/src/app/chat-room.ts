import { ChatMessage } from './chat-message';

export interface ChatRoom
{
	id: string,
	name: string,
	user: string[],
	admin: string[],
	blocked: string[],
	muted: string[],
	history: ChatMessage[],
	password: string,
	isPrivate: boolean
}
