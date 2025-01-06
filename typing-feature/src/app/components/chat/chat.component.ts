import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat-service/chat.service';
import { debounceTime, Subject } from 'rxjs';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class ChatComponent {
  message = '';
  messages: { userId: string; message: string }[] = [];
  typingUser: string | null = null;
  typingDebouncer: Subject<void> = new Subject<void>();
  currentUserId = 'user1';

  constructor(private chatService: ChatService) {
    // Generate or retrieve a unique userId
    // this.currentUserId =
    //   localStorage.getItem('userId') || this.generateUniqueId();
    // localStorage.setItem('userId', this.currentUserId);

    this.currentUserId =
      sessionStorage.getItem('userId') || this.generateUniqueId();
    sessionStorage.setItem('userId', this.currentUserId);
  }

  ngOnInit() {
    this.chatService.onMessage((data) => {
      this.messages.push(data);
    });

    this.chatService.onTyping((data: { userId: string; status: boolean }) => {
      if (data.status) {
        console.log('Typing event received:', data);
        this.typingUser = data.userId;
      } else {
        this.typingUser = null; // Clear the typing status when the user stops typing
      }
      console.log('Current typingUser:', this.typingUser);
    });

    this.typingDebouncer.pipe(debounceTime(3000)).subscribe(() => {
      this.chatService.sendTypingStatus(false, this.currentUserId);
    });
  }

  private generateUniqueId(): string {
    return 'user-' + Math.random().toString(36).substr(2, 9);
  }

  onTyping() {
    this.chatService.sendTypingStatus(true, this.currentUserId);
    // Emit the typing event to activate debouncing
    this.typingDebouncer.next();
  }
  // onTyping() {
  //   this.chatService.sendTypingStatus(true, this.currentUserId);
  //   setTimeout(() => {
  //     this.chatService.sendTypingStatus(false, this.currentUserId);
  //   }, 5000); // Reset after 5 seconds of inactivity
  // }
  sendMessage() {
    if (this.message.trim()) {
      this.chatService.sendMessage(this.message, this.currentUserId);
      this.message = '';
      this.chatService.sendTypingStatus(false, this.currentUserId);
    }
  }
}
