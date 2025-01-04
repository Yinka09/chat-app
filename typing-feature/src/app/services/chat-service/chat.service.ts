import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private socket: Socket;

  constructor() {
    // Connect to your backend server
    this.socket = io('http://localhost:3000');
  }

  sendTypingStatus(status: boolean, userId: string) {
    this.socket.emit('typing', { userId, status });
  }

  onTyping(callback: (data: { userId: string; status: boolean }) => void) {
    this.socket.on('typing', callback);
  }

  sendMessage(message: string, userId: string) {
    this.socket.emit('message', { message, userId });
  }

  onMessage(callback: (data: { message: string; userId: string }) => void) {
    this.socket.on('message', callback);
  }
}
