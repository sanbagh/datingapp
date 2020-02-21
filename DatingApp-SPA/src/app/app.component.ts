import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from './_services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private authService: AuthService) {}

  ngOnInit() {
    const jwtHelper = new JwtHelperService();
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token) {
      this.authService.decodedToken = jwtHelper.decodeToken(token);
    }
    if (user) {
      this.authService.currentUser = JSON.parse(user);
      this.authService.changePhotoUrl(this.authService.currentUser.photoUrl);
    }
  }
}
