import { Component } from '@angular/core';
import { io } from 'socket.io-client';

@Component({
  selector: 'app-find-game',
  templateUrl: './find-game.component.html',
  styleUrls: ['./find-game.component.css']
})
export class FindGameComponent {
  constructor() {
  }
  ngOnInit() {
    const socket = io('ws://localhost:3000/queue'); // Replace with the URL of your queue WebSocket server
    socket.on('connect', () => {
      console.log('Connected to queue WebSocket server');
      // Send a message to the server to join the queue
      socket.emit('joinQueue', { message: 'Joined the queue' });
    });
    socket.on('disconnect', () => {
      console.log('Disconnected from queue WebSocket server');
      // Handle disconnection
    });
  }
}
