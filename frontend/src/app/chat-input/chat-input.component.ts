import { Component, ViewChild, ElementRef, Input } from '@angular/core';
import { ChatService } from '../chat.service';
import { ChatMessage } from '../chat-message';
import { UserService } from '../user.service';
import { User } from '../user';
import { ChatRoom } from '../chat-room';

@Component({
  selector: 'app-chat-input',
  templateUrl: './chat-input.component.html',
  styleUrls: ['./chat-input.component.css']
})
export class ChatInputComponent {
	@Input() room?: ChatRoom;
	message = "";
	user: User | undefined = undefined;
	textArea: HTMLElement | null = null;
	chatBox: HTMLElement | null = null;
	muted: boolean = false;
	constructor(
		public chatService: ChatService,
		public userService: UserService
	) {}
	ngOnInit(): void {
		this.textArea = document.getElementById('chat-input-text');
		this.chatBox = document.getElementById('chatBox');
		this.textArea && this.textArea.focus();
	}
	ngOnChanges() {
		this.getUser();
		this.muted = this.chatService.loggedUserIsMuted(this.room?.id);
	}
	getUser(): void {
		this.userService.getLoggedUser()
			.subscribe(user => {
				this.user = user;
			});
	}
	send(event: Event)
	{
		event.preventDefault();
		this.blink('send-button');
		if (
			!this.message
		||	!this.room
		) return ;
		let newMessage!: ChatMessage;

		newMessage = 
		{
			roomId: this.room.id,
			user: this.user ? this.user : {} as User,
			message: this.message
		};
		this.chatService.sendMessage(newMessage);
		this.message = "";
		this.textArea && this.textArea.focus();
	}
	blink(el: string)
	{
		const exist = document.getElementById(el);
		if (!exist) return ;
		exist.classList.add('inverted');
		let n: ReturnType<typeof setTimeout>;
		n = setTimeout(function() {
				exist.classList.remove('inverted');
				}, 200);
	}

}
