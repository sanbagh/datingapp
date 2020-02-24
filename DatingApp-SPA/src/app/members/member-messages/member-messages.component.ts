import { Component, OnInit, Input } from '@angular/core';
import { Message } from 'src/app/_models/message';
import { AuthService } from 'src/app/_services/auth.service';
import { UserService } from 'src/app/_services/user.service';
import { AlertifyService } from 'src/app/_services/alertify.service';

@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css']
})
export class MemberMessagesComponent implements OnInit {
  @Input() recipientId: number;
  messages: Message[] = [];

  constructor(
    private authservice: AuthService,
    private userService: UserService,
    private alertoifyService: AlertifyService
  ) {}

  ngOnInit() {
    this.loadMessages();
  }
  loadMessages() {
    this.userService.getMessagesThread(this.authservice.decodedToken.nameid, this.recipientId)
    .subscribe( messages => this.messages = messages, err => this.alertoifyService.error(err));
  }
}
