import {Component} from '@angular/core';
import {AsyncPipe} from '@angular/common';
import {
  DynamicTableComponent, TableComponentBase
} from '../../../../common-components/components/dynamic-table/dynamic-table.component';
import {UsersService} from '../../../services/users.service';
import {Observable} from 'rxjs';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {faArrowLeft, faTrash} from '@fortawesome/free-solid-svg-icons';
import {UserSessions} from '../../../models/user';
import {DynamicTableData} from '../../../models/dynamic-table-data';

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
export class UserSessionsComponent extends TableComponentBase<UserSessions> {

  override columns = [
    {
      property: 'user_agent',
      header: 'User Agent',
      isSortable: true
    },
    {
      property: 'ip_address',
      header: 'IP Address',
      isSortable: true
    },
    {
      property: 'jwt_jti',
      header: 'JTI',
      isSortable: true,
    },
    {
      property: 'created_at',
      header: 'Created',
      isDate: true,
      isSortable: true,
    },
    {
      property: 'last_seen_at',
      header: 'Last activity',
      isDate: true,
      isSortable: true,
    },
    {
      property: 'created_at',
      header: 'Actions',
      isActions: true
    }
  ];

  protected readonly faArrowLeft = faArrowLeft;
  private readonly userId: string;

  constructor(private readonly usersService: UsersService,
              private readonly activatedRoute: ActivatedRoute) {
    super();
    this.userId = this.activatedRoute.snapshot.params['id'];
  }

  disableSession(item: any) {
    console.log(item);
    this.usersService.deleteSession(this.userId, item.jwt_jti).subscribe(() => {

    })
  }

  protected readonly faTrash = faTrash;

  protected override load(pageIndex: number, pageSize: number, orderBy?: string, direction?: string): Observable<DynamicTableData<UserSessions>> {
    return this.usersService.getSessions(this.userId, pageIndex, pageSize, orderBy, direction);
  }
}
