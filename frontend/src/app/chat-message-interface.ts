import { User } from './user-interface';

export interface ChatMessage {
	user: User;
	message: string;
}
