import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  model: any = {};
  constructor(
    public authService: AuthService,
    private alertifyService: AlertifyService
  ) {}

  ngOnInit() {}

  login() {
    this.authService.login(this.model).subscribe(
      next => {
        this.alertifyService.success('successfully logged in');
      },
      error => {
        this.alertifyService.error(error);
      }
    );
  }
  isLoggedIn() {
    return this.authService.isLoggedIn();
  }
  logout() {
    localStorage.removeItem('token');
  }
}
