import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../utils/models/user';
import BASE_URL, {  URLS } from '../utils/constants/constants';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${BASE_URL}${URLS.USERS}`, { responseType: 'json' });
  }

  updateUser(user: User): Observable<User> {
    const payload = user;
    return this.http.put<User>(`${BASE_URL}${URLS.USERS}/${user.id}`,payload, { responseType: 'json' });
  }

  updateAllUsers(users: User[]): Observable<User[]> {
    return this.http.post<User[]>(`${BASE_URL}${URLS.USERS}/`,users, { responseType: 'json' })
  }
}
