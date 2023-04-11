import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { ChatService } from '../chat.service';
import { ChatMessage } from '../chat-message';
import { UserService } from '../user.service';
import { User } from '../user';
import { ChatRoom } from '../chat-room';

@Component({
  selector: 'app-chat-input',
  templateUrl: './chat-input.component.html',
  styleUrls: ['./chat-input.component.css'],
})
export class ChatInputComponent implements OnInit, OnChanges {
  @Input() room?: ChatRoom;
  message = '';
  user?: User;
  textArea: HTMLElement | null = null;
  chatBox: HTMLElement | null = null;
  muted = false;
  messageTooBig = false;

  constructor(
    public chatService: ChatService,
    public userService: UserService
  ) {}

  ngOnInit(): void {
    this.textArea = document.getElementById('chat-input-text');
    this.chatBox = document.getElementById('chatBox');
    this.textArea && this.textArea.focus();
    this.keepCheckingMessageSize();
  }

  ngOnChanges() {
    this.getUser();
    if (this.room) this.muted = this.chatService.isCurrentUserMuted(this.room);
  }

  getUser(): void {
		this.user = this.userService.getLoggedUser();
  }

  send(event: Event) {
    event.preventDefault();
    this.blink('send-button');
    if (!this.message || !this.room || this.messageTooBig) return;

    const newMessage: ChatMessage = {
      roomId: this.room.id,
      user: this.user ? this.user : ({} as User),
      message: this.message,
    };
    this.chatService.sendMessage(newMessage);
    this.message = '';
    this.textArea && this.textArea.focus();
  }

  blink(el: string) {
    const exist = document.getElementById(el);
    if (!exist) return;
    exist.classList.add('inverted');
    setTimeout(function () {
      exist.classList.remove('inverted');
    }, 200);
  }

  async keepCheckingMessageSize() {
    this.messageTooBig = this.message.length > 512;
    await new Promise(resolve => setTimeout(resolve, 719));
    this.keepCheckingMessageSize();
  }
}
