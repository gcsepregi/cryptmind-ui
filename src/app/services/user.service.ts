import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SignupData } from '../models/signup.model';
import { LoginData } from '../models/login.model';
import {BehaviorSubject, catchError, map, Observable, Subject, tap} from 'rxjs';
import {User} from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly baseUrl = 'http://localhost:3000';

  private readonly authenticated = new BehaviorSubject<boolean>(false);
  authenticated$ = this.authenticated.asObservable();

  constructor(private readonly http: HttpClient) {
    this.loadToken();
  }

  signup(data: SignupData) {
    return this.http.post('/signup', {user: data});
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
