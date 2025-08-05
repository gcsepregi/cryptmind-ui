import {Component} from '@angular/core';
import {UsersService} from '../../services/users.service';
import {AsyncPipe} from '@angular/common';
import {faBook, faClock, faUserCircle} from '@fortawesome/free-solid-svg-icons';
import {
  DynamicTableComponent, TableComponentBase
} from '../../../common-components/components/dynamic-table/dynamic-table.component';
import {User} from '../../models/user';

@Component({
  selector: 'app-users',
  imports: [
    AsyncPipe,
    DynamicTableComponent
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent extends TableComponentBase<User> {

  constructor(private readonly usersService: UsersService) {
    super();
  }

  override columns = [
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
      header: '# of sessions',
      isDecorated: true,
      icon: faClock,
      link: {
        prefix: '/admin/users',
        suffix: 'sessions',
      },
    },
    {
      property: 'journals_count',
      header: '# of journals',
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

  protected override load(pageIndex:  number,
                          pageSize:   number,
                          orderBy?:   string,
                          direction?: string,) {
    return this.usersService.getUsers(pageIndex, pageSize, orderBy, direction);
  }

}
