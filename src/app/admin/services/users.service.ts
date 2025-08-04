import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BASE_URL} from '../../app.config';
import {User, UserSessions} from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private readonly http: HttpClient,
              @Inject(BASE_URL) private readonly baseUrl: string) {
  }

  getUsers() {
    return this.http.get<User[]>(`${this.baseUrl}/admin/users`);
  }

  getSessions(userId: string) {
    return this.http.get<UserSessions>(`${this.baseUrl}/admin/users/${userId}/sessions`);
  }

  deleteSession(userId: string, jti: string) {
    return this.http.delete(`${this.baseUrl}/admin/users/${userId}/sessions/${jti}`);
  }
}
