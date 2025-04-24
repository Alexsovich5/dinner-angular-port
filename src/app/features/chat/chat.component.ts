import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChatService } from '../../core/services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  chatForm: FormGroup;
  messages: any[] = [];
  isLoading = false;
  error: string | null = null;

  constructor(private fb: FormBuilder, private chatService: ChatService) {
    this.chatForm = this.fb.group({
      message: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadMessages();
    this.chatService.listenForMessages().subscribe((message) => {
      this.messages.push(message);
    });
  }

  loadMessages(): void {
    this.isLoading = true;
    this.chatService.getMessageHistory().subscribe({
      next: (messages) => {
        this.messages = messages;
      },
      error: (err) => {
        this.error = err.message || 'Failed to load messages';
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  onSendMessage(): void {
    if (this.chatForm.valid) {
      const { message } = this.chatForm.value;
      this.chatService.sendMessage(message).subscribe({
        next: () => {
          this.chatForm.reset();
        },
        error: (err) => {
          this.error = err.message || 'Failed to send message';
        }
      });
    }
  }
}
