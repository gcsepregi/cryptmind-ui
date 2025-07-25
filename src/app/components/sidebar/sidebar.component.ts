import { Component } from '@angular/core';
import {
  BookAIcon,
  HomeIcon, LogOutIcon,
  LucideAngularModule,
  MenuIcon,
  MoonIcon,
  SkullIcon,
  SunIcon,
  UserIcon,
  XIcon
} from 'lucide-angular';
import {ThemeService} from '../../services/theme.service';

import {UserService} from '../../services/user.service';
import {Router, RouterLink} from '@angular/router';
import {User} from '../../models/user.model';

@Component({
  selector: 'app-sidebar',
  imports: [
    LucideAngularModule,
    RouterLink
],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {

  protected isCollapsed = true;
  protected readonly SkullIcon = SkullIcon;
  protected readonly MenuIcon = MenuIcon;
  protected readonly UserIcon = UserIcon;
  protected readonly HomeIcon = HomeIcon;
  protected readonly BookAIcon = BookAIcon;
  protected readonly LogOutIcon = LogOutIcon;
  protected readonly XIcon = XIcon;
  protected user: User | undefined;

  constructor(private readonly themeService: ThemeService,
              private readonly userService: UserService,
              private readonly router: Router) {
    this.userService.getMe().subscribe(res => {
      this.user = res;
    });
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  icon() {
    return this.themeService.currentTheme === 'dark' ? SunIcon : MoonIcon;
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
