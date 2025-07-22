import { Component } from '@angular/core';
import {LucideAngularModule, MoonIcon, SunIcon} from 'lucide-angular';
import {ThemeService} from '../../services/theme.service';

@Component({
  selector: 'app-theme-switcher',
  imports: [
    LucideAngularModule
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
    return this.themeService.currentTheme === 'dark' ? SunIcon : MoonIcon;
  }
}
