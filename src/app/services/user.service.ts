import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SignupData } from '../models/signup.model';
import { LoginData } from '../models/login.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private readonly http: HttpClient) { }

  signup(data: SignupData) {
    return this.http.post('/signup', {user: data});
  }

  login(data: LoginData) {
    return this.http.post('/login', {user: data});
  }

  logout() {
    return this.http.delete('/logout', {});
  }

  getMe() {
    return this.http.get('/me');
  }
}
