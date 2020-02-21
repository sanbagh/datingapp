import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { User } from '../_models/User';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl = environment.apiUrl + 'auth/';
  jwtHelper = new JwtHelperService();
  decodedToken;
  currentUser: User;
  photoUrl = new BehaviorSubject<string>('../assets/user.png');
  currentPhotoUrl = this.photoUrl.asObservable();
  constructor(private httpService: HttpClient) {}
  login(model: any) {
    return this.httpService.post(this.baseUrl + 'login', model).pipe(
      map((response: any) => {
        localStorage.setItem('token', response.token);
        this.currentUser = response.user;
        localStorage.setItem('user', JSON.stringify(this.currentUser));
        this.decodedToken = this.jwtHelper.decodeToken(response.token);
        this.changePhotoUrl(this.currentUser.photoUrl);
      })
    );
  }
  register(model: any) {
    return this.httpService.post(this.baseUrl + 'register', model);
  }
  isLoggedIn() {
    const token = localStorage.getItem('token');
    return !this.jwtHelper.isTokenExpired(token);
  }
  changePhotoUrl(photoUrl: string) {
    this.photoUrl.next(photoUrl);
  }
}
