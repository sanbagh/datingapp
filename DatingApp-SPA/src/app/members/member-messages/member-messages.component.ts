import { Component, OnInit, Input } from '@angular/core';
import { Message } from 'src/app/_models/message';
import { AuthService } from 'src/app/_services/auth.service';
import { UserService } from 'src/app/_services/user.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css']
})
export class MemberMessagesComponent implements OnInit {
  @Input() recipientId: number;
  messages: Message[] = [];
  message: any = {};
  constructor(
    private authservice: AuthService,
    private userService: UserService,
    private alertoifyService: AlertifyService
  ) {}

  ngOnInit() {
    this.loadMessages();
  }
  loadMessages() {
    const userId = +this.authservice.decodedToken.nameid;
    this.userService
      .getMessagesThread(userId, this.recipientId)
      .pipe(
        tap(messages => {
          for (const message of messages) {
            if (!message.isRead && message.recipientId === userId) {
              this.userService.markAsRead(userId, message.id);
            }
          }
        })
      )
      .subscribe(
        messages => (this.messages = messages),
        err => this.alertoifyService.error(err)
      );
  }
  sendMessage() {
    this.message.recipientId = this.recipientId;
    this.userService
      .sendMessage(this.authservice.decodedToken.nameid, this.message)
      .subscribe(
        (message: Message) => {
          this.messages.unshift(message);
          this.message = {};
        },
        err => this.alertoifyService.error(err)
      );
  }
}
