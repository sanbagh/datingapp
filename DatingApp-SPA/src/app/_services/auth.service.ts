import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl = 'http://localhost:5000/api/auth/';
  constructor(private httpService: HttpClient) {}
  login(model: any) {
    return this.httpService
      .post(this.baseUrl + 'login', model)
      .pipe(
        map((response: any) => localStorage.setItem('token', response.token))
      );
  }
  register(model: any) {
     return this.httpService.post(this.baseUrl + 'register', model);
  }
}
