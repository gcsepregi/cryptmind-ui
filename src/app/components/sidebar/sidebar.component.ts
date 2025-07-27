import { Component } from '@angular/core';
import {ThemeService} from '../../services/theme.service';
import {UserService} from '../../services/user.service';
import {Router, RouterLink} from '@angular/router';
import {User} from '../../models/user.model';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {faBook, faHome, faSignOutAlt, faBars, faMoon, faSkull, faSun, faUser, faXmark} from '@fortawesome/free-solid-svg-icons';
import {SidebarService} from '../../services/sidebar.service';

@Component({
  selector: 'app-sidebar',
  imports: [
    FontAwesomeModule,
    RouterLink
],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  protected readonly faSkull = faSkull;
  protected readonly faBars = faBars;
  protected readonly faUser = faUser;
  protected readonly faHome = faHome;
  protected readonly faBook = faBook;
  protected readonly faSignOutAlt = faSignOutAlt;
  protected readonly faXmark = faXmark;
  protected user: User | undefined;

  constructor(private readonly themeService: ThemeService,
              private readonly userService: UserService,
              private readonly router: Router,
              private readonly sidebarService: SidebarService) {
    this.userService.getMe().subscribe(res => {
      this.user = res;
    });
  }

  get isOpen() {
    return this.sidebarService.isOpen;
  }

  toggleSidebar() {
    this.sidebarService.toggle();
  }

  icon() {
    return this.themeService.currentTheme === 'dark' ? faSun : faMoon;
  }

  logout() {
    this.userService.logout().subscribe(() => {
      this.router.navigate(['/']).then(()=>{
        window.location.reload();
      });
    });
  }

  toggleTheme() {
    this.themeService.toggle();
  }
}
