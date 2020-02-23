import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '../_models/User';
import { Pagination } from '../_models/Pagination';
import { UserService } from '../_services/user.service';
import { AlertifyService } from '../_services/alertify.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  likesParam;
  users: User[] = [];
  pagination: Pagination;
  constructor(
    private userService: UserService,
    private alertifyService: AlertifyService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(paginatedResult => {
      this.users = paginatedResult.users.result;
      this.pagination = paginatedResult.users.pagination;
    });
    this.likesParam = 'Likers';
  }
  pageChanged($event): void {
    this.pagination.pageNumber = $event.page;
    this.loadUsers();
  }
  loadUsers() {
    this.userService
      .getUsers(
        this.pagination.pageNumber,
        this.pagination.pageSize,
        null,
        this.likesParam
      )
      .subscribe(
        paginatedUsers => {
          this.users = paginatedUsers.result;
          this.pagination = paginatedUsers.pagination;
        },
        error => this.alertifyService.error(error)
      );
  }
}
