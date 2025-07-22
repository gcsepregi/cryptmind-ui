import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {SidebarComponent} from './components/sidebar/sidebar.component';
import {LucideAngularModule} from 'lucide-angular';
import {NgIf} from '@angular/common';
import {LandingPageComponent} from './components/landing-page/landing-page.component';
import {ThemeSwitcherComponent} from './components/theme-switcher/theme-switcher.component';
import {UserService} from './services/user.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SidebarComponent, LucideAngularModule, NgIf, LandingPageComponent, ThemeSwitcherComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'cryptmind-angular';
  isLoggedIn: boolean = false;

  constructor(private readonly userService: UserService) {
    userService.authenticated$.subscribe(res => {
      this.isLoggedIn = res;
    });
  }
}
