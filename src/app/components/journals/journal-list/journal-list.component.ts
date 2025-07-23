import { Component } from '@angular/core';
import {
  BookAIcon, CalendarIcon,
  ChevronDownIcon,
  CrownIcon, EditIcon, EyeIcon, EyeOffIcon, GridIcon, ListIcon,
  LucideAngularModule,
  MoonIcon,
  PlusIcon,
  SearchIcon,
  StarIcon, TagIcon, Trash2Icon
} from 'lucide-angular';
import {NgIf, NgClass, NgForOf, AsyncPipe, DatePipe} from '@angular/common';
import {JournalsService} from '../../../services/journals.service';
import {BehaviorSubject} from 'rxjs';
import {Journal} from '../../../models/journal.model';

@Component({
  selector: 'app-journal-list',
  imports: [
    LucideAngularModule,
    NgIf,
    NgClass,
    NgForOf,
    AsyncPipe,
    DatePipe
  ],
  templateUrl: './journal-list.component.html',
  styleUrl: './journal-list.component.scss'
})
export class JournalListComponent {

  protected readonly BookAIcon = BookAIcon;
  protected readonly PlusIcon = PlusIcon;
  protected readonly ChevronDownIcon = ChevronDownIcon;
  protected readonly MoonIcon = MoonIcon;
  protected readonly CrownIcon = CrownIcon;
  protected readonly StarIcon = StarIcon;
  protected readonly SearchIcon = SearchIcon;
  protected readonly EyeIcon = EyeIcon;
  protected readonly GridIcon = GridIcon;
  protected readonly ListIcon = ListIcon;
  protected readonly EyeOffIcon = EyeOffIcon;
  protected readonly EditIcon = EditIcon;
  protected readonly CalendarIcon = CalendarIcon;
  protected readonly TagIcon = TagIcon;
  protected readonly Trash2Icon = Trash2Icon;

  protected newEntryDropDownOpen = false;
  protected view: 'grid' | 'list' = 'grid';

  protected journals = new BehaviorSubject<Journal[]>([])

  constructor(private readonly journalsService: JournalsService) {
    this.journalsService.getJournals().subscribe(res => {
      this.journals.next(res);
    });
  }

  toggleNewEntryDropDown() {
    this.newEntryDropDownOpen = !this.newEntryDropDownOpen;
  }

  icon(journal_type: "diary" | "dream" | "ritual" | "divination") {
    if (journal_type === "diary") {
      return BookAIcon;
    } else if (journal_type === "dream") {
      return MoonIcon;
    } else if (journal_type === "ritual") {
      return StarIcon;
    } else if (journal_type === "divination") {
      return CrownIcon;
    } else {
      return CalendarIcon;
    }
  }

  toggleView() {
    this.view = this.view === 'grid' ? 'list' : 'grid';
  }
}
