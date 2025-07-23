import {Routes} from '@angular/router';
import {HomeComponent} from './components/home/home.component';
import {LoginComponent} from './components/users/login/login.component';
import {LandingPageComponent} from './components/landing-page/landing-page.component';
import {Injectable} from '@angular/core';
import {UserService} from './services/user.service';
import {RegisterComponent} from './components/users/register/register.component';
import {JournalListComponent} from './components/journals/journal-list/journal-list.component';

@Injectable(
  {
    providedIn: 'root'
  }
)
class AuthGuard {

  private authenticated: boolean = false;

  constructor(private readonly userService: UserService) {
    userService.authenticated$.subscribe(res => {
      this.authenticated = res;
    })
  }

  canActivate() {
    return this.authenticated;
  }

  canMatch() {
    return this.authenticated;
  }
}

export const routes: Routes = [
  {path: '', component: HomeComponent, canMatch: [AuthGuard]},
  {path: '', component: LandingPageComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'journals', component: JournalListComponent, canActivate: [AuthGuard]},
  {path: '**', redirectTo: ''},
];
