import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {SidebarComponent} from './components/sidebar/sidebar.component';
import {LucideAngularModule} from 'lucide-angular';
import {NgIf} from '@angular/common';
import {LandingPageComponent} from './components/landing-page/landing-page.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SidebarComponent, LucideAngularModule, NgIf, LandingPageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'cryptmind-angular';
  isLoggedIn: boolean;

  constructor() {
    this.isLoggedIn = false;
  }
}
