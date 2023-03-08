import { User } from './user';

export interface ChatMessage {
	roomId: string;
	user: User;
	message: string;
}
