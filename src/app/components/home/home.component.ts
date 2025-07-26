import { Component } from '@angular/core';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {faFire, faBook, faMoon, faStar, faCrown, faPlus, faCalendar, faList, faCheckCircle, faBell, faQuoteLeft, faUserCircle, faArrowRight} from '@fortawesome/free-solid-svg-icons';
import {NgClass, DatePipe} from '@angular/common';
import {UserService} from '../../services/user.service';
import {RouterLink} from '@angular/router';
import {JournalsService} from '../../services/journals.service';
import {Journal} from '../../models/journal.model';

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
  recentEntries: Journal[] = [];
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
  faArrowRight = faArrowRight;

  constructor(private readonly userService: UserService,
              private readonly journalService: JournalsService) {
    userService.getMe().subscribe(res => {
      this.user.nickname = res.nickname;
    });
    journalService.getRecents().subscribe(res => {
      this.recentEntries = res;
    })
  }
}
