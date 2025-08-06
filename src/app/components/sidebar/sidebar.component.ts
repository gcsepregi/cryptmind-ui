import { Component, OnDestroy } from '@angular/core';
import {ThemeService} from '../../services/theme.service';
import {UserService} from '../../services/user.service';
import {Router, RouterLink} from '@angular/router';
import {User} from '../../models/user.model';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {
  faBook,
  faHome,
  faSignOutAlt,
  faBars,
  faMoon,
  faSkull,
  faSun,
  faUser,
  faXmark,
  faDashboard,
  faGrinHearts,
  faLaugh,
  faSmile,
  faMeh,
  faFrown,
  faSadTear,
  faAngry
} from '@fortawesome/free-solid-svg-icons';
import {SidebarService} from '../../services/sidebar.service';
import {AdminMenuComponent} from '../../admin/components/admin-menu/admin-menu.component';
import {NgClass} from '@angular/common';
import {MoodService} from '../../services/mood.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-sidebar',
  imports: [
    FontAwesomeModule,
    RouterLink,
    AdminMenuComponent,
    NgClass
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnDestroy {
  protected readonly faSkull = faSkull;
  protected readonly faBars = faBars;
  protected readonly faUser = faUser;
  protected readonly faHome = faHome;
  protected readonly faBook = faBook;
  protected readonly faSignOutAlt = faSignOutAlt;
  protected readonly faXmark = faXmark;
  protected user: User | undefined;
  protected roles: string[] = [];
  protected currentMood: string = '';
  protected moodTimestamp: Date | null = null;

  // Icons for different moods
  protected moodIcons = {
    'love': faGrinHearts,
    'happy': faLaugh,
    'good': faSmile,
    'neutral': faMeh,
    'sad': faFrown,
    'very-sad': faSadTear,
    'angry': faAngry
  };

  private moodSubscription: Subscription;

  constructor(private readonly themeService: ThemeService,
              private readonly userService: UserService,
              private readonly router: Router,
              private readonly sidebarService: SidebarService,
              private readonly moodService: MoodService) {
    this.userService.getMe().subscribe(res => {
      this.user = res;
      this.roles = userService.roles;
    });

    // Subscribe to mood updates from the service
    this.moodSubscription = this.moodService.getMood().subscribe(moodData => {
      if (moodData) {
        this.currentMood = moodData.mood;
        this.moodTimestamp = moodData.timestamp;
      } else {
        this.currentMood = '';
        this.moodTimestamp = null;
      }
    });
  }

  /**
   * Check if the given route is active
   * @param route The route to check
   * @returns True if the route is active
   */
  isRouteActive(route: string): boolean {
    return this.sidebarService.isRouteActive(route);
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

  // Method to get the label for a given mood
  getMoodLabel(mood: string): string {
    return this.moodService.getMoodLabel(mood);
  }

  // Method to get the icon for a given mood
  getMoodIcon(mood: string) {
    return this.moodIcons[mood as keyof typeof this.moodIcons] || faSmile;
  }

  // Method to get the color for a given mood
  getMoodColor(mood: string): string {
    return this.moodService.getMoodColor(mood);
  }

  // Clean up subscriptions when component is destroyed
  ngOnDestroy(): void {
    if (this.moodSubscription) {
      this.moodSubscription.unsubscribe();
    }
  }

  protected readonly faDashboard = faDashboard;
}
