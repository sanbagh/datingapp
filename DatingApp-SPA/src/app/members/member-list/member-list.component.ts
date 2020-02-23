import { Component, OnInit } from '@angular/core';
import { UserService } from '../../_services/user.service';
import { AlertifyService } from '../../_services/alertify.service';
import { User } from '../../_models/User';
import { ActivatedRoute } from '@angular/router';
import { Pagination } from 'src/app/_models/Pagination';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  users: User[];
  pagination: Pagination;
  userParams: any = {};
  genderList = [{value: 'male', display: 'Males'}, {value: 'female', display: 'Females'}];
  constructor(
    private userService: UserService,
    private alertifyService: AlertifyService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe(data => {
      this.users = data.users.result;
      this.pagination = data.users.pagination;
    });
    this.setInitialFilterData();
  }
  setInitialFilterData() {
    const user  = JSON.parse(localStorage.getItem('user'));
    this.userParams.minAge = 18;
    this.userParams.maxAge = 99;
    this.userParams.gender = user.gender === 'male' ? 'female' : 'male';
    this.userParams.orderBy = 'lastActive';
  }
  resetFilter() {
    this.setInitialFilterData();
    this.loadUsers();
  }
  pageChanged($event): void {
    this.pagination.pageNumber = $event.page;
    this.loadUsers();
  }
  loadUsers() {
    this.userService.getUsers(this.pagination.pageNumber, this.pagination.pageSize, this.userParams).subscribe(
      paginatedUsers => {
        this.users = paginatedUsers.result;
        this.pagination = paginatedUsers.pagination;
      },
      error => this.alertifyService.error(error)
    );
  }
}
