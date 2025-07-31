import { HttpClient } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { SignupData } from '../models/signup.model';
import { LoginData } from '../models/login.model';
import {BehaviorSubject, map, tap} from 'rxjs';
import {User} from '../models/user.model';
import {BASE_URL} from '../app.config';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly authenticated = new BehaviorSubject<boolean>(false);
  authenticated$ = this.authenticated.asObservable();

  constructor(
    private readonly http: HttpClient,
    @Inject(BASE_URL) private readonly baseUrl: string
  ) {
    this.loadToken();
  }

  signup(data: SignupData) {
    return this.http.post(`${this.baseUrl}/signup`, {user: data});
  }

  login(data: LoginData) {
    return this.http.post(`${this.baseUrl}/login`, {user: data}, { observe: 'response' })
      .pipe(map((resp) => {
        const token = resp.headers.get('Authorization')!.substring(7);
        localStorage.setItem('crypt-token', token);
        this.authenticated.next(true);
        return resp.body;
      }));
  }

  logout() {
    return this.http.delete(`${this.baseUrl}/logout`, {})
      .pipe(tap(() => {
        localStorage.removeItem('crypt-token');
        this.authenticated.next(false);
      }));
  }

  getMe() {
    return this.http.get<User>(`${this.baseUrl}/me`);
  }

  private loadToken() {
    const token = localStorage.getItem('crypt-token');
    if (token) {
      this.authenticated.next(true);
    }
  }
}
