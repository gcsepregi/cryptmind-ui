import { Component } from '@angular/core';
import {ThemeService} from '../../services/theme.service';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {faMoon, faSun} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-theme-switcher',
  imports: [
    FontAwesomeModule
  ],
  templateUrl: './theme-switcher.component.html',
  styleUrl: './theme-switcher.component.scss'
})
export class ThemeSwitcherComponent {
  constructor(private readonly themeService: ThemeService) { }

  toggleTheme() {
    this.themeService.toggle();
  }

  icon() {
    return this.themeService.currentTheme === 'dark' ? faSun : faMoon;
  }
}
