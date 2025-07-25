import {Routes} from '@angular/router';
import {HomeComponent} from './components/home/home.component';
import {LoginComponent} from './components/users/login/login.component';
import {LandingPageComponent} from './components/landing-page/landing-page.component';
import {Injectable} from '@angular/core';
import {UserService} from './services/user.service';
import {RegisterComponent} from './components/users/register/register.component';
import {JournalListComponent} from './components/journals/journal-list/journal-list.component';
import {NewDiaryEntryComponent} from './components/journals/diary/new-diary-entry/new-diary-entry.component';
import {NewDreamEntryComponent} from './components/journals/dream/new-dream-entry/new-dream-entry.component';
import {NewRitualEntryComponent} from './components/journals/ritual/new-ritual-entry/new-ritual-entry.component';
import {ViewDiaryEntryComponent} from './components/journals/diary/view-diary-entry/view-diary-entry.component';

@Injectable(
  {
    providedIn: 'root'
  }
)
class AuthGuard {

  private authenticated: boolean = false;

  constructor(userService: UserService) {
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
  {path: 'journals/diaries/new', component: NewDiaryEntryComponent, canActivate: [AuthGuard]},
  {path: 'journals/diary/:id', component: ViewDiaryEntryComponent, canActivate: [AuthGuard]},
  {path: 'journals/dreams/new', component: NewDreamEntryComponent, canActivate: [AuthGuard]},
  {path: 'journals/rituals/new', component: NewRitualEntryComponent, canActivate: [AuthGuard]},
  {path: '**', redirectTo: ''},
];
