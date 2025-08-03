import { Component } from '@angular/core';
import {AsyncPipe} from '@angular/common';
import {DynamicTableComponent} from '../../../../common-components/components/dynamic-table/dynamic-table.component';
import {UsersService} from '../../../services/users.service';
import {BehaviorSubject} from 'rxjs';
import {RouterLink} from '@angular/router';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {faArrowLeft} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-user-sessions',
  imports: [
    AsyncPipe,
    DynamicTableComponent,
    RouterLink,
    FaIconComponent
  ],
  templateUrl: './user-sessions.component.html',
  styleUrl: './user-sessions.component.scss'
})
export class UserSessionsComponent {

  protected readonly columns = [];
  protected readonly items$ = new BehaviorSubject<{[prop: string]: any}[]>([]);
  protected readonly faArrowLeft = faArrowLeft;

  constructor(private readonly usersService: UsersService) { }

}
