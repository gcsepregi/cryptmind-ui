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
import {NgIf} from '@angular/common';
import {UserService} from '../../services/user.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [
    LucideAngularModule,
    NgIf
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {

  public isCollapsed = true;
  public SkullIcon = SkullIcon;
  protected readonly MenuIcon = MenuIcon;
  protected readonly UserIcon = UserIcon;
  protected readonly HomeIcon = HomeIcon;
  protected readonly BookAIcon = BookAIcon;
  protected readonly LogOutIcon = LogOutIcon;

  protected readonly XIcon = XIcon;

  constructor(private readonly themeService: ThemeService,
              private readonly userService: UserService,
              private readonly router: Router) {

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
}
