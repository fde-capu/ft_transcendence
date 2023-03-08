export interface ChatRoomDTO
{
	id: string,
	name: string,
	user: string[],
	admin: string[],
	blocked: string[],
	password: string,
	isPrivate: boolean
}
