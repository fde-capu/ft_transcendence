import { Component, OnInit } from '@angular/core';
import { ChatService } from '../chat.service';
import { UserService } from '../user.service';
import { User } from '../user';

@Component({
  selector: 'app-chat-input',
  templateUrl: './chat-input.component.html',
  styleUrls: ['./chat-input.component.css'],
})
export class ChatInputComponent implements OnInit {
  message = '';
  user?: User;
  textArea?: HTMLElement | null;
  chatBox?: HTMLElement | null;
  constructor(
    public chatService: ChatService,
    public userService: UserService
  ) {}
  ngOnInit(): void {
    this.getUser();
    this.textArea = document.getElementById('chat-input-text');
    this.chatBox = document.getElementById('chatBox');
    this.textArea && this.textArea.focus();
  }
  getUser(): void {
    this.userService.getLoggedUser().subscribe(user => (this.user = user));
  }
  send(event: Event) {
    event.preventDefault();
    this.blink('send-button');
    if (!this.message) return;
    const newMessage = {
      user: this.user ? this.user : ({} as User),
      message: this.message,
    };
    this.chatService.add(newMessage);
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
}
