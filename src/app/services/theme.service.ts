import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  public currentTheme = 'light';

  constructor() {
    this.currentTheme = localStorage.getItem('crypt-theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', this.currentTheme);
  }

  toggle() {
    this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('crypt-theme', this.currentTheme);
    document.documentElement.setAttribute('data-theme', this.currentTheme);
  }
}
