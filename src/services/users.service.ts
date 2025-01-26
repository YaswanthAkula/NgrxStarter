import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../utils/models/user';
import { BASE_URL, URLS } from '../utils/constants';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(BASE_URL+URLS.USERS);
  }

//   updateUser(user: User): Observable<User> {
//     return this.http.put<User>(`${this.apiUrl}/${user.id}`, user);
//   }
}
