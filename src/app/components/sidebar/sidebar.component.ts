import { Component } from '@angular/core';
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
export class SidebarComponent {
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

  // Mood options mapping for labels
  protected moodOptions = [
    { value: 'love', label: 'Love' },
    { value: 'happy', label: 'Happy' },
    { value: 'good', label: 'Good' },
    { value: 'neutral', label: 'Neutral' },
    { value: 'sad', label: 'Sad' },
    { value: 'very-sad', label: 'Very Sad' },
    { value: 'angry', label: 'Angry' }
  ];

  constructor(private readonly themeService: ThemeService,
              private readonly userService: UserService,
              private readonly router: Router,
              private readonly sidebarService: SidebarService) {
    this.userService.getMe().subscribe(res => {
      this.user = res;
      this.roles = userService.roles;
    });

    // Load saved mood from localStorage if available
    this.loadCurrentMood();
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

  // Method to load the current mood from localStorage
  loadCurrentMood() {
    const savedMood = localStorage.getItem('quickMood');
    if (savedMood) {
      try {
        const { mood, timestamp } = JSON.parse(savedMood);
        this.currentMood = mood;
        this.moodTimestamp = new Date(timestamp);

        // If mood is older than 12 hours, clear it
        const twelveHoursAgo = new Date();
        twelveHoursAgo.setHours(twelveHoursAgo.getHours() - 12);
        if (this.moodTimestamp < twelveHoursAgo) {
          this.currentMood = '';
          this.moodTimestamp = null;
        }
      } catch (e) {
        console.error('Error loading saved mood', e);
        this.currentMood = '';
        this.moodTimestamp = null;
      }
    }
  }

  // Method to get the label for a given mood
  getMoodLabel(mood: string): string {
    const option = this.moodOptions.find(opt => opt.value === mood);
    return option ? option.label : 'Unknown';
  }

  // Method to get the icon for a given mood
  getMoodIcon(mood: string) {
    return this.moodIcons[mood as keyof typeof this.moodIcons] || faSmile;
  }

  protected readonly faDashboard = faDashboard;
}
