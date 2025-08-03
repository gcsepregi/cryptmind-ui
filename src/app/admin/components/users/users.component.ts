import { Component } from '@angular/core';
import {UsersService} from '../../services/users.service';
import {BehaviorSubject} from 'rxjs';
import {User} from '../../models/user';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {AsyncPipe, DatePipe} from '@angular/common';
import {faPen, faTrash, faUserCircle} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-users',
  imports: [
    FaIconComponent,
    AsyncPipe,
    DatePipe
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {

  protected users$ = new BehaviorSubject<User[]>([]);

  constructor(private readonly usersService: UsersService) {
  }

  ngOnInit() {
    this.usersService.getUsers().subscribe(res => {
      this.users$.next(res);
    });
  }

  protected readonly faUserCircle = faUserCircle;
  protected readonly faPen = faPen;
  protected readonly faTrash = faTrash;
}
