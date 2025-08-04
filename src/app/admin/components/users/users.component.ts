import {Component, OnInit} from '@angular/core';
import {UsersService} from '../../services/users.service';
import {BehaviorSubject} from 'rxjs';
import {User} from '../../models/user';
import {AsyncPipe} from '@angular/common';
import {faBook, faClock, faUserCircle} from '@fortawesome/free-solid-svg-icons';
import {
  DynamicTableComponent,
  PageEvent
} from '../../../common-components/components/dynamic-table/dynamic-table.component';
import {DynamicTableData} from '../../models/dynamic-table-data';

@Component({
  selector: 'app-users',
  imports: [
    AsyncPipe,
    DynamicTableComponent
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit {

  protected users$ = new BehaviorSubject<DynamicTableData<User>>({data: [], total: 0, pageSize: 10, pageIndex: 0});

  constructor(private readonly usersService: UsersService) {
  }

  columns = [
    {
      property: 'nickname',
      header: 'User',
      isDecorated: true,
      icon: faUserCircle,
    },
    {
      property: 'email',
      header: 'Email',
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
      isDate: true,
    },
    {
      property: 'updated_at',
      header: 'Updated',
      isDate: true,
    },
    {
      property: 'actions',
      header: '',
      isActions: true,
    },
  ];

  ngOnInit() {
    this.usersService.getUsers().subscribe(res => {
      this.users$.next(res);
    });
  }

  protected readonly faBook = faBook;

  onPageChange($event: PageEvent) {
    this.usersService.getUsers($event.pageIndex, $event.pageSize).subscribe(res => {
      this.users$.next(res);
    })
  }
}
