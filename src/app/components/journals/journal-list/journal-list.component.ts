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
import {NgIf, NgClass} from '@angular/common';

@Component({
  selector: 'app-journal-list',
  imports: [
    LucideAngularModule,
    NgIf,
    NgClass
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

  constructor() { }

  toggleNewEntryDropDown() {
    this.newEntryDropDownOpen = !this.newEntryDropDownOpen;
  }
}
