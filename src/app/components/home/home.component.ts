import { Component } from '@angular/core';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {faFire, faBook, faMoon, faStar, faCrown, faPlus, faCalendar, faList, faCheckCircle, faBell, faQuoteLeft, faUserCircle, faArrowRight, faChevronLeft, faChevronRight} from '@fortawesome/free-solid-svg-icons';
import {NgClass, DatePipe} from '@angular/common';
import {UserService} from '../../services/user.service';
import {RouterLink} from '@angular/router';
import {JournalsService} from '../../services/journals.service';
import {Journal, JournalStats} from '../../models/journal.model';
import { CalendarService, CalendarDay } from '../../services/calendar.service';

@Component({
  selector: 'app-home',
  imports: [FontAwesomeModule, NgClass, DatePipe, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
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
  calendarDays: CalendarDay[] = [];
  currentMonth: number = new Date().getMonth();
  currentYear: number = new Date().getFullYear();
  private calendarEntries: Journal[] = [];

  get monthName(): string {
    return new Date(this.currentYear, this.currentMonth).toLocaleString('default', { month: 'long' });
  }

  constructor(private readonly userService: UserService,
              private readonly journalService: JournalsService,
              private readonly calendarService: CalendarService) {
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
      fromDate: new Date(this.currentYear, this.currentMonth, 1),
      toDate: new Date(this.currentYear, this.currentMonth + 1, 0),
    }).subscribe(res => {
      this.calendarEntries = res;
      this.updateCalendarDays();
    })
  }

  updateCalendarDays() {
    this.calendarDays = this.calendarService.getMonthCalendar(
      this.currentYear,
      this.currentMonth,
      this.calendarEntries
    );
  }
}
