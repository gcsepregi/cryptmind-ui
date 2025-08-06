import {ActivatedRouteSnapshot, Route, Routes} from '@angular/router';
import {HomeComponent} from './components/home/home.component';
import {LoginComponent} from './components/users/login/login.component';
import {LandingPageComponent} from './components/landing-page/landing-page.component';
import {Injectable} from '@angular/core';
import {UserService} from './services/user.service';
import {RegisterComponent} from './components/users/register/register.component';
import {NewDiaryEntryComponent} from './components/journals/diary/new-diary-entry/new-diary-entry.component';
import {NewDreamEntryComponent} from './components/journals/dream/new-dream-entry/new-dream-entry.component';
import {NewRitualEntryComponent} from './components/journals/ritual/new-ritual-entry/new-ritual-entry.component';
import {ViewDiaryEntryComponent} from './components/journals/diary/view-diary-entry/view-diary-entry.component';
import {ViewDreamEntryComponent} from './components/journals/dream/view-dream-entry/view-dream-entry.component';
import {ViewRitualEntryComponent} from './components/journals/ritual/view-ritual-entry/view-ritual-entry.component';
import {ForbiddenComponent} from './forbidden/forbidden.component';
import {JournalListComponent} from './components/journals/journal-list/journal-list.component';
import {MoodHistoryComponent} from './components/mood-history/mood-history.component';

@Injectable({providedIn: 'root'})
export class AuthGuard {
  private authenticated = false;

  constructor(private userService: UserService) {
    userService.authenticated$.subscribe((res) => {
      this.authenticated = res;
    });
  }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    return this.checkAccess(route.data?.['roles']);
  }

  canMatch(route: Route): boolean {
    return this.checkAccess(route.data?.['roles']);
  }

  private checkAccess(allowedRoles?: string[]): boolean {
    if (!this.authenticated) return false;

    if (!allowedRoles || allowedRoles.length === 0) return true;

    const userRoles = this.userService.roles;
    return allowedRoles.some(role => userRoles.includes(role));
  }
}

export const routes: Routes = [
  {path: '', component: HomeComponent, canMatch: [AuthGuard]},
  {path: '', component: LandingPageComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'mood-history', component: MoodHistoryComponent, canActivate: [AuthGuard]},
  {path: 'journals', component: JournalListComponent, canActivate: [AuthGuard]},
  {path: 'journals/diary/new', component: NewDiaryEntryComponent, canActivate: [AuthGuard]},
  {path: 'journals/diary/:id', component: ViewDiaryEntryComponent, canActivate: [AuthGuard]},
  {path: 'journals/diary/:id/edit', component: NewDiaryEntryComponent, canActivate: [AuthGuard]},
  {path: 'journals/dream/new', component: NewDreamEntryComponent, canActivate: [AuthGuard]},
  {path: 'journals/dream/:id', component: ViewDreamEntryComponent, canActivate: [AuthGuard]},
  {path: 'journals/dream/:id/edit', component: NewDreamEntryComponent, canActivate: [AuthGuard]},
  {path: 'journals/ritual/new', component: NewRitualEntryComponent, canActivate: [AuthGuard]},
  {path: 'journals/ritual/:id', component: ViewRitualEntryComponent, canActivate: [AuthGuard]},
  {path: 'journals/ritual/:id/edit', component: NewRitualEntryComponent, canActivate: [AuthGuard]},
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
    canActivate: [AuthGuard],
    data: {roles: ['admin']}
  },
  {path: 'forbidden', component: ForbiddenComponent},
  {path: '**', redirectTo: ''},
];
