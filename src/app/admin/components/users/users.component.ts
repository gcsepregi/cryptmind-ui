import {Component, OnInit} from '@angular/core';
import {UsersService} from '../../services/users.service';
import {BehaviorSubject} from 'rxjs';
import {User} from '../../models/user';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {AsyncPipe, DatePipe} from '@angular/common';
import {faBook, faClock, faPen, faTrash, faUserCircle} from '@fortawesome/free-solid-svg-icons';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-users',
  imports: [
    FaIconComponent,
    AsyncPipe,
    DatePipe,
    RouterLink
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit {

  protected users$ = new BehaviorSubject<User[]>([]);

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
      header: '# of Sessions',
      isDecorated: true,
      icon: faClock,
      link: {
        prefix: '/admin/users',
        suffix: 'sessions',
      },
    },
    {
      property: 'journals_count',
      header: '# of Entries',
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

  protected readonly faPen = faPen;
  protected readonly faTrash = faTrash;
  protected readonly faBook = faBook;
}
