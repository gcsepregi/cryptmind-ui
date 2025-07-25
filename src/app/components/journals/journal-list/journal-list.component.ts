import {Component} from '@angular/core';
import {NgClass, AsyncPipe, DatePipe} from '@angular/common';
import {JournalsService} from '../../../services/journals.service';
import {BehaviorSubject} from 'rxjs';
import {Journal} from '../../../models/journal.model';
import {Router, RouterLink} from '@angular/router';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {
  faBook,
  faCalendar,
  faChevronDown,
  faCrown,
  faEdit,
  faEye,
  faEyeSlash,
  faTableCells,
  faList,
  faMoon,
  faPlus,
  faSearch,
  faStar,
  faTag,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-journal-list',
  imports: [
    FontAwesomeModule,
    NgClass,
    AsyncPipe,
    DatePipe,
    RouterLink
  ],
  templateUrl: './journal-list.component.html',
  styleUrl: './journal-list.component.scss'
})
export class JournalListComponent {
  protected readonly faBook = faBook;
  protected readonly faPlus = faPlus;
  protected readonly faChevronDown = faChevronDown;
  protected readonly faMoon = faMoon;
  protected readonly faCrown = faCrown;
  protected readonly faStar = faStar;
  protected readonly faSearch = faSearch;
  protected readonly faEye = faEye;
  protected readonly faTableCells = faTableCells;
  protected readonly faList = faList;
  protected readonly faEyeSlash = faEyeSlash;
  protected readonly faEdit = faEdit;
  protected readonly faCalendar = faCalendar;
  protected readonly faTag = faTag;
  protected readonly faTrash = faTrash;

  protected newEntryDropDownOpen = false;
  view: 'grid' | 'list' | 'calendar' = 'grid';

  currentMonth: number = new Date().getMonth();
  currentYear: number = new Date().getFullYear();

  today = new Date();

  get monthName(): string {
    return new Date(this.currentYear, this.currentMonth).toLocaleString('default', {month: 'long'});
  }

  get calendarDays(): { date: Date, isCurrentMonth: boolean }[] {
    const days: { date: Date, isCurrentMonth: boolean }[] = [];
    const firstDayOfMonth = new Date(this.currentYear, this.currentMonth, 1);
    const lastDayOfMonth = new Date(this.currentYear, this.currentMonth + 1, 0);
    const firstDayOfWeek = firstDayOfMonth.getDay(); // 0 (Sun) - 6 (Sat)
    const daysInMonth = lastDayOfMonth.getDate();

    // Calculate previous month's days to fill first week
    const prevMonth = this.currentMonth === 0 ? 11 : this.currentMonth - 1;
    const prevYear = this.currentMonth === 0 ? this.currentYear - 1 : this.currentYear;
    const prevMonthLastDay = new Date(prevYear, prevMonth + 1, 0).getDate();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      days.push({date: new Date(prevYear, prevMonth, prevMonthLastDay - i), isCurrentMonth: false});
    }
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({date: new Date(this.currentYear, this.currentMonth, i), isCurrentMonth: true});
    }
    // Next month's days to fill last week
    const nextMonth = this.currentMonth === 11 ? 0 : this.currentMonth + 1;
    const nextYear = this.currentMonth === 11 ? this.currentYear + 1 : this.currentYear;
    const totalCells = Math.ceil(days.length / 7) * 7;
    for (let i = 1; days.length < totalCells; i++) {
      days.push({date: new Date(nextYear, nextMonth, i), isCurrentMonth: false});
    }
    console.log(days);
    return days;
  }

  prevMonth() {
    if (this.currentMonth === 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else {
      this.currentMonth--;
    }
  }

  nextMonth() {
    if (this.currentMonth === 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else {
      this.currentMonth++;
    }
  }

  protected journals = new BehaviorSubject<Journal[]>([])

  constructor(private readonly journalsService: JournalsService,
              private readonly toastr: ToastrService,
              private readonly router: Router) {
    this.journalsService.getJournals().subscribe(res => {
      this.journals.next(res);
    });
  }

  toggleNewEntryDropDown() {
    this.newEntryDropDownOpen = !this.newEntryDropDownOpen;
  }

  toggleView(mode: 'grid' | 'list' | 'calendar') {
    this.view = mode;
  }

  icon(type: string) {
    switch (type) {
      case 'diary':
        return this.faBook;
      case 'dream':
        return this.faMoon;
      case 'ritual':
        return this.faStar;
      case 'divination':
        return this.faCrown;
      case 'calendar':
        return this.faCalendar;
      default:
        return this.faBook;
    }
  }

  hasEntryForDay(date: Date): boolean {
    const journals = this.journals.getValue();
    return journals.some(journal => {
      const entryDate = new Date(journal.created_at);
      return entryDate.getFullYear() === date.getFullYear() &&
        entryDate.getMonth() === date.getMonth() &&
        entryDate.getDate() === date.getDate();
    });
  }

  getEntryTypesForDay(date: Date): string[] {
    const journals = this.journals.getValue();
    const types = journals.filter(journal => {
      const entryDate = new Date(journal.created_at);
      return entryDate.getFullYear() === date.getFullYear() &&
        entryDate.getMonth() === date.getMonth() &&
        entryDate.getDate() === date.getDate();
    }).map(journal => journal.journal_type);
    return Array.from(new Set(types));
  }

  deleteJournal(journal: Journal) {
    this.journalsService.deleteJournalEntry(journal.id, journal.journal_type).subscribe({
        next: () => {
          this.journals.next(this.journals.getValue().filter(j => j.id !== journal.id));
          this.toastr.success('Journal entry deleted');
        },
        error: () => {
          this.toastr.error('Journal entry failed to delete. Please try again.');
        }
      }
    )
  }

  goToJournal(journal: Journal) {
    console.log('navigating to ', journal.journal_type, journal.id, ' journal entry')
    this.router.navigate([`/journals/${journal.journal_type}`, journal.id]).then(() => {})
  }
}
