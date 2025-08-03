import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {UsersComponent} from './components/users/users.component';
import {UserSessionsComponent} from './components/users/user-sessions/user-sessions.component';
import {UserJournalEntriesComponent} from './components/users/user-journal-entries/user-journal-entries.component';
import {DashboardComponent} from './components/dashboard/dashboard.component';

const routes: Routes = [
  {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
  {path: 'dashboard', component: DashboardComponent},
  {path: 'users', component: UsersComponent},
  {path: 'users/:id/sessions', component: UserSessionsComponent},
  {path: 'users/:id/journal-entries', component: UserJournalEntriesComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
