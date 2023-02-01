import { Component, ViewChild, ElementRef } from '@angular/core';
import { ChatMessageService } from '../chat-message.service';
import { ChatMessage } from '../chat-message';
import { UserService } from '../user.service';
import { User } from '../user';

@Component({
  selector: 'app-chat-input',
  templateUrl: './chat-input.component.html',
  styleUrls: ['./chat-input.component.css']
})
export class ChatInputComponent {
	message: String = "";
	user: User = {} as User;
	textArea: HTMLElement | null = null;
	chatBox: HTMLElement | null = null;
	constructor(
		public chatMessageService: ChatMessageService,
		public userService: UserService
	) {}
	ngOnInit(): void {
		this.getUser();
		this.textArea = document.getElementById('chat-input-text');
		this.chatBox = document.getElementById('chatBox');
		this.textArea && this.textArea.focus();
	}
	getUser(): void {
		this.userService.getLoggedUser()
			.subscribe(user => this.user = user );
	}
	send(event: Event)
	{
		event.preventDefault();
		this.blink('send-button');
		if (!this.message) return ;
		var newMessage!: ChatMessage;
		newMessage = 
		{
			user: this.user,
			message: this.message
		};
		this.chatMessageService.add(newMessage);
		this.message = "";
		this.textArea && this.textArea.focus();
		if (this.chatBox) {
			this.chatBox.scrollTo({ left: 0, top: 2000, behavior: 'smooth' });
		}
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
