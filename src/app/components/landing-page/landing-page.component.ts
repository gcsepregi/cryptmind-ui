import { Component } from '@angular/core';
import {RouterLink} from '@angular/router';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {faBook, faLock, faRightToBracket, faPen, faMagnifyingGlass, faSkull, faUserPlus, faUsers, faEye, faBrain} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-landing-page',
  imports: [
    FontAwesomeModule,
    RouterLink
  ],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent {
  protected readonly faSkull = faSkull;
  protected readonly faUserPlus = faUserPlus;
  protected readonly faRightToBracket = faRightToBracket;
  protected readonly faBook = faBook;
  protected readonly faMagnifyingGlass = faMagnifyingGlass;
  protected readonly faPen = faPen;
  protected readonly faUsers = faUsers;
  protected readonly faLock = faLock;
  protected readonly faEye = faEye;
  protected readonly faBrain = faBrain;
}
