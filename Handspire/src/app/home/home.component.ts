import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  isChatOpen = false;
  userInput = '';
  messages: { text: string, sender: 'user' | 'bot' }[] = [];

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit() {
    this.resetChat(); // load welcome message at component start
  }

  getToAbout() {
    this.router.navigate(['/about-asl']);
  }

  startNow() {
    this.router.navigate(['/hand-detection']);
  }

  toggleChat() {
    this.isChatOpen = !this.isChatOpen;
    if (this.isChatOpen) {
      this.resetChat(); // reset messages on open
    } else {
      this.messages = []; // clear messages on close
    }
  }

  resetChat() {
    this.messages = [
      {
        text: '👋 Welcome to Handspire! Ask me anything about using the site.',
        sender: 'bot'
      }
    ];
  }

  sendMessage() {
    if (!this.userInput.trim()) return;

    const message = this.userInput.trim();
    this.messages.push({ text: message, sender: 'user' });

    this.http.post<{ response: string }>('http://127.0.0.1:5002/chat', { message }).subscribe(
      res => {
        this.messages.push({ text: res.response, sender: 'bot' });
      },
      () => {
        this.messages.push({ text: 'Something went wrong. Try again later.', sender: 'bot' });
      }
    );

    this.userInput = '';
  }
}
