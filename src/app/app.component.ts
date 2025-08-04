import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {SidebarComponent} from './components/sidebar/sidebar.component';
import {LucideAngularModule} from 'lucide-angular';

import {ThemeSwitcherComponent} from './components/theme-switcher/theme-switcher.component';
import {UserService} from './services/user.service';
import {HeaderComponent} from './components/header/header.component';
import {SidebarService} from './services/sidebar.service';
import {AsyncPipe, NgClass} from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SidebarComponent, LucideAngularModule, ThemeSwitcherComponent, HeaderComponent, NgClass, AsyncPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'cryptmind-angular';
  isLoggedIn: boolean = false;
  get isSidebarOpen() {
    return this.sidebarService.isOpened$;
  }

  constructor(private readonly userService: UserService,
              protected readonly sidebarService: SidebarService) {
    userService.authenticated$.subscribe(res => {
      this.isLoggedIn = res;
    });
  }
}
