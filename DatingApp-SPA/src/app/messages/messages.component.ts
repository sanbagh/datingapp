import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertifyService } from '../_services/alertify.service';
import { Message } from '../_models/message';
import { Pagination } from '../_models/Pagination';
import { UserService } from '../_services/user.service';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  messages: Message[];
  pagination: Pagination;
  messageContainer = 'Unread';
  constructor(
    private acRoute: ActivatedRoute,
    private userService: UserService,
    private authService: AuthService,
    private alertifyService: AlertifyService
  ) {}

  ngOnInit() {
    this.acRoute.data.subscribe(
      data => {
        this.messages = data.messages.result;
        this.pagination = data.messages.pagination;
        console.log('get');
      },
      err => this.alertifyService.error(err)
    );
  }
  loadMessages() {
    this.userService
      .getMessages(
        this.authService.decodedToken.nameid,
        this.pagination.pageNumber,
        this.pagination.pageSize,
        this.messageContainer
      )
      .subscribe( paginatedResult => {
        this.messages = paginatedResult.result;
        this.pagination = paginatedResult.pagination;
      }, err => this.alertifyService.error(err));
  }
  pageChanged($event): void {
    this.pagination.pageNumber = $event.page;
    this.loadMessages();
  }
}
