import { Component, OnDestroy } from '@angular/core';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {faFire, faBook, faMoon, faStar, faCrown, faPlus, faCalendar, faList, faCheckCircle, faBell, faQuoteLeft, faUserCircle, faArrowRight, faChevronLeft, faChevronRight, faSmile, faFrown, faAngry, faMeh, faLaugh, faSadTear, faGrinHearts, faEdit, faTrash} from '@fortawesome/free-solid-svg-icons';
import {NgClass, DatePipe} from '@angular/common';
import {UserService} from '../../services/user.service';
import {Router, RouterLink} from '@angular/router';
import {JournalsService} from '../../services/journals.service';
import {Journal, JournalStats} from '../../models/journal.model';
import { CalendarService, CalendarDay } from '../../services/calendar.service';
import {MarkdownPipe} from '../../pipes/markdown.pipe';
import {ToastrService} from 'ngx-toastr';
import {MoodService} from '../../services/mood.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-home',
  imports: [FontAwesomeModule, NgClass, DatePipe, RouterLink, MarkdownPipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnDestroy {
  user = {
    nickname: '',
    avatar: '',
  };
  streak = 3;
  quote = 'The journey inward is the most important journey you will ever take.';
  recentEntries: Journal[] = [];
  stats: JournalStats = {
    stats: {
      diary: 21,
      dream: 12,
      ritual: 7,
      divination: 2
    },
    total: 42,
  };
  reminders = [
    { text: 'Log a dream today!', icon: faMoon },
    { text: 'Meditate 10 min', icon: faStar },
    { text: 'Pull a tarot card', icon: faCrown }
  ];
  calendar = [];

  faFire = faFire;
  faBook = faBook;
  faMoon = faMoon;
  faStar = faStar;
  faCrown = faCrown;
  faPlus = faPlus;
  faCalendar = faCalendar;
  faList = faList;
  faCheckCircle = faCheckCircle;
  faBell = faBell;
  faQuoteLeft = faQuoteLeft;
  faUserCircle = faUserCircle;
  faArrowRight = faArrowRight;
  faChevronLeft = faChevronLeft;
  faChevronRight = faChevronRight;
  faSmile = faSmile;
  faFrown = faFrown;
  faAngry = faAngry;
  faMeh = faMeh;
  faLaugh = faLaugh;
  faSadTear = faSadTear;
  faGrinHearts = faGrinHearts;
  faEdit = faEdit;
  faTrash = faTrash;
  calendarDays: CalendarDay[] = [];
  currentMonth: number = new Date().getMonth();
  currentYear: number = new Date().getFullYear();
  private calendarEntries: Journal[] = [];

  // Quick mood tracking
  selectedMood: string = '';
  moodTimestamp: Date = new Date();
  private moodSubscription: Subscription;

  // Mood options for the quick mood selector
  moodOptions = [
    { icon: this.faGrinHearts, value: 'love', label: 'Love' },
    { icon: this.faLaugh, value: 'happy', label: 'Happy' },
    { icon: this.faSmile, value: 'good', label: 'Good' },
    { icon: this.faMeh, value: 'neutral', label: 'Neutral' },
    { icon: this.faFrown, value: 'sad', label: 'Sad' },
    { icon: this.faSadTear, value: 'very-sad', label: 'Very Sad' },
    { icon: this.faAngry, value: 'angry', label: 'Angry' }
  ];

  // Mood options mapping
  moodIcons = {
    'love': this.faGrinHearts,
    'happy': this.faLaugh,
    'good': this.faSmile,
    'neutral': this.faMeh,
    'sad': this.faFrown,
    'very-sad': this.faSadTear,
    'angry': this.faAngry
  };

  get monthName(): string {
    return new Date(this.currentYear, this.currentMonth).toLocaleString('default', { month: 'long' });
  }

  constructor(private readonly userService: UserService,
              private readonly journalService: JournalsService,
              private readonly calendarService: CalendarService,
              private readonly router: Router,
              private readonly toastr: ToastrService,
              private readonly moodService: MoodService) {
    userService.getMe().subscribe(res => {
      this.user.nickname = res.nickname;
    });
    journalService.getRecents().subscribe(res => {
      this.recentEntries = res;
    });
    journalService.getStats().subscribe(res => {
      this.stats = res;
    });
    journalService.getJournals({
      fromDate: new Date(this.currentYear, this.currentMonth-1, 23),
      toDate: new Date(this.currentYear, this.currentMonth + 1, 7),
    }).subscribe(res => {
      this.calendarEntries = res;
      this.updateCalendarDays();
    });

    // Subscribe to mood updates from the service
    this.moodSubscription = this.moodService.getMood().subscribe(moodData => {
      if (moodData) {
        this.selectedMood = moodData.mood;
        this.moodTimestamp = moodData.timestamp;
      } else {
        this.selectedMood = '';
        this.moodTimestamp = new Date();
      }
    });
  }

  updateCalendarDays() {
    this.calendarDays = this.calendarService.getMonthCalendar(
      this.currentYear,
      this.currentMonth,
      this.calendarEntries
    );
  }

  // Method to get the icon for a given mood
  getMoodIcon(mood: string | undefined) {
    if (!mood) return this.faSmile; // Default icon if no mood is set
    return this.moodIcons[mood as keyof typeof this.moodIcons] || this.faSmile;
  }

  // Method to get the label for a given mood
  getMoodLabel(mood: string): string {
    return this.moodService.getMoodLabel(mood);
  }

  // Method to get the color for a given mood
  getMoodColor(mood: string): string {
    return this.moodService.getMoodColor(mood);
  }

  // Method to quickly set the current mood
  quickSetMood(mood: string) {
    this.moodService.setMood(mood);
    this.toastr.success(`Mood set to ${this.getMoodLabel(mood)}`);
  }

  // Clean up subscriptions when component is destroyed
  ngOnDestroy(): void {
    if (this.moodSubscription) {
      this.moodSubscription.unsubscribe();
    }
  }

  // Method to edit a journal entry
  editJournal(event: Event, entry: Journal) {
    event.stopPropagation(); // Prevent navigation to view page
    this.router.navigate([`/journals/${entry.journal_type}`, entry.id, 'edit']);
  }

  // Method to delete a journal entry
  deleteJournal(event: Event, entry: Journal) {
    event.stopPropagation(); // Prevent navigation to view page
    if (confirm(`Are you sure you want to delete "${entry.title}"?`)) {
      this.journalService.deleteJournalEntry(entry.id, entry.journal_type).subscribe({
        next: () => {
          this.recentEntries = this.recentEntries.filter(e => e.id !== entry.id);
          this.toastr.success('Journal entry deleted');
        },
        error: () => {
          this.toastr.error('Failed to delete journal entry. Please try again.');
        }
      });
    }
  }
}
