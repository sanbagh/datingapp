import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { User } from '../_models/User';
import { PaginatedResult } from '../_models/Pagination';
import { map } from 'rxjs/operators';
import { Message } from '../_models/message';

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
    return this.httpService.post(
      this.baseUrl + id + '/like/' + recipientId,
      {}
    );
  }
  getMessages(userId: number, pageNumber?, pageSize?, messageContainer?) {
    const paginatedResult: PaginatedResult<Message[]> = new PaginatedResult<
      Message[]
    >();
    let httpParams = new HttpParams();
    httpParams = httpParams.append('MessageContainer', messageContainer);
    if (pageNumber && pageSize) {
      httpParams = httpParams.append('pageNumber', pageNumber);
      httpParams = httpParams.append('pageSize', pageSize);
    }
    return this.httpService
      .get<Message[]>(this.baseUrl + userId + '/messages', {
        observe: 'response',
        params: httpParams
      })
      .pipe(
        map(httpResponse => {
          paginatedResult.result = httpResponse.body;
          if (httpResponse.headers.get('pagination') !== null) {
            paginatedResult.pagination = JSON.parse(
              httpResponse.headers.get('pagination')
            );
            return paginatedResult;
          }
        })
      );
  }
  getMessagesThread(userId: number, recipientId: number) {
    return this.httpService.get<Message[]>(
      this.baseUrl + userId + '/messages/thread/' + recipientId
    );
  }
  sendMessage(userId: number, message: Message) {
    return this.httpService.post<Message>(
      this.baseUrl + userId + '/messages',
      message
    );
  }
  deleteMessage(userId: number, messageId: number) {
    return this.httpService.post(
      this.baseUrl + userId + '/messages/' + messageId,
      {}
    );
  }
  markAsRead(userId: number, messageId: number) {
    this.httpService
      .post(this.baseUrl + userId + '/messages/' + messageId + '/read', {})
      .subscribe();
  }
}
