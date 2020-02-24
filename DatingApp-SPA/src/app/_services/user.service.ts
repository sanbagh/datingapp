import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { User } from '../_models/User';
import { PaginatedResult } from '../_models/Pagination';
import { map } from 'rxjs/operators';

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

  getUsers(
    pageNumber?,
    pageSize?,
    userParams?,
    likesParams?
  ): Observable<PaginatedResult<User[]>> {
    const paginationResult = new PaginatedResult<User[]>();
    let httpParams = new HttpParams();
    if (pageNumber && pageSize) {
      httpParams = httpParams.append('pageNumber', pageNumber);
      httpParams = httpParams.append('pageSize', pageSize);
    }
    if (userParams) {
      httpParams = httpParams.append('minAge', userParams.minAge);
      httpParams = httpParams.append('maxAge', userParams.maxAge);
      httpParams = httpParams.append('gender', userParams.gender);
      httpParams = httpParams.append('orderBy', userParams.orderBy);
    }
    if (likesParams === 'Likers') {
      httpParams = httpParams.append('Likers', 'true');
    }
    if (likesParams === 'Likees') {
      httpParams = httpParams.append('Likees', 'true');
    }
    return this.httpService
      .get<User[]>(this.baseUrl, { observe: 'response', params: httpParams })
      .pipe(
        map(httpresponse => {
          paginationResult.result = httpresponse.body;
          paginationResult.pagination = JSON.parse(
            httpresponse.headers.get('pagination')
          );
          return paginationResult;
        })
      );
  }
  getUser(id: number): Observable<User> {
    return this.httpService.get<User>(this.baseUrl + id);
  }
  updateUser(id: number, user: User): Observable<User> {
    return this.httpService.put<User>(this.baseUrl + id, user);
  }
  setMainPhoto(userId: number, id: number) {
    return this.httpService.post(
      this.baseUrl + userId + '/photos/' + id + '/setMain',
      {}
    );
  }
  deletePhoto(userId: number, id: number) {
    return this.httpService.delete(this.baseUrl + userId + '/photos/' + id);
  }
  sendLike(id: number, recipientId: number) {
    return this.httpService.post(this.baseUrl + id + '/like/' + recipientId, {});
  }
}