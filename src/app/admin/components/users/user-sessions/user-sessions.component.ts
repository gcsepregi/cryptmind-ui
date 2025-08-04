import { Component } from '@angular/core';
import {AsyncPipe} from '@angular/common';
import {
  DynamicTableComponent,
  PageEvent
} from '../../../../common-components/components/dynamic-table/dynamic-table.component';
import {UsersService} from '../../../services/users.service';
import {BehaviorSubject} from 'rxjs';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {faArrowLeft, faTrash} from '@fortawesome/free-solid-svg-icons';

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

  protected readonly columns = [
    {
      property: 'user_agent',
      header: 'User Agent',
    },
    {
      property: 'ip_address',
      header: 'IP Address'
    },
    {
      property: 'jwt_jti',
      header: 'JTI'
    },
    {
      property: 'created_at',
      header: 'Created',
      isDate: true,
    },
    {
      property: 'last_seen_at',
      header: 'Last activity',
      isDate: true,
    },
    {
      property: 'created_at',
      header: 'Actions',
      isActions: true
    }
  ];
  protected readonly items$ = new BehaviorSubject<{[prop: string]: any}>({});
  protected readonly faArrowLeft = faArrowLeft;
  private userId: string;

  constructor(private readonly usersService: UsersService,
              private readonly activatedRoute: ActivatedRoute) {
    this.userId = this.activatedRoute.snapshot.params['id'];
    usersService.getSessions(this.userId).subscribe(res => {
      this.items$.next(res)
    })
  }

  disableSession(item: any) {
    console.log(item);
    this.usersService.deleteSession(this.userId, item.jwt_jti).subscribe(() => {

    })
  }

  protected readonly faTrash = faTrash;

  onPageChange($event: PageEvent) {
    this.usersService.getSessions(this.userId, $event.pageIndex, $event.pageSize).subscribe(res => {
      this.items$.next(res)
    })
  }
}
