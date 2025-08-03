import { Component } from '@angular/core';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {faDashboard, faUsers} from '@fortawesome/free-solid-svg-icons';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-admin-menu',
  imports: [
    FaIconComponent,
    RouterLink
  ],
  templateUrl: './admin-menu.component.html',
  styleUrl: './admin-menu.component.scss'
})
export class AdminMenuComponent {

  protected readonly faDashboard = faDashboard;
  protected readonly faUsers = faUsers;
}
