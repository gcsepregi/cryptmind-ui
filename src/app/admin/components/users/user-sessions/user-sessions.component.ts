import {Component} from '@angular/core';
import {AsyncPipe} from '@angular/common';
import {
  DynamicTableComponent,
  PageEvent, SortEvent
} from '../../../../common-components/components/dynamic-table/dynamic-table.component';
import {UsersService} from '../../../services/users.service';
import {BehaviorSubject, combineLatest, switchMap} from 'rxjs';
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

  private readonly paging$ = new BehaviorSubject<PageEvent>({pageIndex: 0, pageSize: 10});
  protected readonly sorting$ = new BehaviorSubject<SortEvent>({property: 'updated_at', direction: 'desc'});

  protected readonly items$ = combineLatest([this.paging$, this.sorting$])
    .pipe(
      switchMap(([{pageIndex, pageSize}, {property, direction}]) =>
        this.usersService.getSessions(this.userId, pageIndex, pageSize, property ?? undefined, direction ?? undefined)
      )
    );

  protected readonly faArrowLeft = faArrowLeft;
  private readonly userId: string;

  constructor(private readonly usersService: UsersService,
              private readonly activatedRoute: ActivatedRoute) {
    this.userId = this.activatedRoute.snapshot.params['id'];
  }

  disableSession(item: any) {
    console.log(item);
    this.usersService.deleteSession(this.userId, item.jwt_jti).subscribe(() => {

    })
  }

  protected readonly faTrash = faTrash;

  onPageChange($event: PageEvent) {
    this.paging$.next($event);
  }

  onSortChange($event: SortEvent) {
    this.sorting$.next($event);
  }
}
