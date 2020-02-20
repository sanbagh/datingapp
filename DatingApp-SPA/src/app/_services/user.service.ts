import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { User } from '../_models/User';

// export const httpOptions = {
//   headers: new HttpHeaders({
//     Authorization: 'Bearer ' + localStorage.getItem('token')
//   })
// };
@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl = environment.apiUrl + 'users/';
  constructor(private httpService: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.httpService.get<User[]>(this.baseUrl);
  }
  getUser(id: number): Observable<User> {
    return this.httpService.get<User>(this.baseUrl + id);
  }
  updateUser(id: number, user: User): Observable<User> {
    return this.httpService.put<User>(this.baseUrl + id, user);
  }
}
