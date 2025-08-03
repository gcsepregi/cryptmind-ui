import {Inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BASE_URL} from '../../app.config';
import {User} from '../models/user';

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

}
