import {Component} from '@angular/core';
import {UsersService} from '../../services/users.service';
import {BehaviorSubject, combineLatest, switchMap} from 'rxjs';
import {AsyncPipe} from '@angular/common';
import {faBook, faClock, faUserCircle} from '@fortawesome/free-solid-svg-icons';
import {
  DynamicTableComponent,
  PageEvent, SortEvent
} from '../../../common-components/components/dynamic-table/dynamic-table.component';

@Component({
  selector: 'app-users',
  imports: [
    AsyncPipe,
    DynamicTableComponent
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {
  private paging$ = new BehaviorSubject<PageEvent>({pageIndex: 0, pageSize: 10});
  protected sorting$ = new BehaviorSubject<SortEvent>({property: null, direction: null});

  protected users$ = combineLatest([this.paging$, this.sorting$])
    .pipe(
      switchMap(([{pageIndex, pageSize}, {property, direction}]) =>
        this.usersService.getUsers(pageIndex, pageSize, property ?? undefined, direction ?? undefined)
      )
    );

  constructor(private readonly usersService: UsersService) {
  }

  columns = [
    {
      property: 'nickname',
      header: 'User',
      isDecorated: true,
      isSortable: true,
      icon: faUserCircle,
    },
    {
      property: 'email',
      header: 'Email',
      isSortable: true
    },
    {
      property: 'sessions_count',
      header: 'View sessions',
      isDecorated: true,
      icon: faClock,
      link: {
        prefix: '/admin/users',
        suffix: 'sessions',
      },
    },
    {
      property: 'journals_count',
      header: 'View journals',
      isDecorated: true,
      icon: faBook,
      link: {
        prefix: '/admin/users',
        suffix: 'journal-entries',
      },
    },
    {
      property: 'created_at',
      header: 'Created',
      isSortable: true,
      isDate: true,
    },
    {
      property: 'updated_at',
      header: 'Updated',
      isSortable: true,
      isDate: true,
    },
    {
      property: 'actions',
      header: '',
      isActions: true,
    },
  ];

  protected readonly faBook = faBook;

  onPageChange($event: PageEvent) {
    this.paging$.next($event);
  }

  onSortChange($event: SortEvent) {
    this.sorting$.next($event);
  }
}
