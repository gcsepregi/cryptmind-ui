import { Component } from '@angular/core';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {faFire, faBook, faMoon, faStar, faCrown, faPlus, faCalendar, faList, faCheckCircle, faBell, faQuoteLeft, faUserCircle} from '@fortawesome/free-solid-svg-icons';
import {NgClass, DatePipe} from '@angular/common';
import {UserService} from '../../services/user.service';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [FontAwesomeModule, NgClass, DatePipe, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  user = {
    nickname: 'MysticSeeker',
    avatar: '',
  };
  streak = 3;
  quote = 'The journey inward is the most important journey you will ever take.';
  recentEntries = [
    { type: 'dream', title: 'Flying over the city', date: '2025-07-24', snippet: 'I soared above the skyline...' },
    { type: 'diary', title: 'Morning Reflection', date: '2025-07-23', snippet: 'Today I felt grateful for...' },
    { type: 'ritual', title: 'Full Moon Ritual', date: '2025-07-22', snippet: 'Lit candles and meditated...' },
  ];
  stats = {
    total: 42,
    diary: 21,
    dream: 12,
    ritual: 7,
    divination: 2
  };
  reminders = [
    { text: 'Log a dream today!', icon: faMoon },
    { text: 'Meditate 10 min', icon: faStar },
    { text: 'Pull a tarot card', icon: faCrown }
  ];
  calendar = [
    // Dummy calendar: array of { date, hasEntry }
    { date: '2025-07-20', hasEntry: true },
    { date: '2025-07-21', hasEntry: false },
    { date: '2025-07-22', hasEntry: true },
    { date: '2025-07-23', hasEntry: true },
    { date: '2025-07-24', hasEntry: true },
    { date: '2025-07-25', hasEntry: false },
    { date: '2025-07-26', hasEntry: false },
  ];
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

  constructor(private readonly userService: UserService) {
    userService.getMe().subscribe(res => {
      this.user.nickname = res.nickname;
    })
  }
}
