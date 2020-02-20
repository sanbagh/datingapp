import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AuthService { 
  baseUrl = environment.apiUrl + 'auth/';
  jwtHelper = new JwtHelperService();
  decodedToken;
  constructor(private httpService: HttpClient) {}
  login(model: any) {
    return this.httpService.post(this.baseUrl + 'login', model).pipe(
      map((response: any) => {
        localStorage.setItem('token', response.token);
        this.decodedToken = this.jwtHelper.decodeToken(response.token);
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
}
