import { Component } from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {
  faArrowLeft,
  faBook,
  faCalendar,
  faTag,
  faMapMarkerAlt,
  faSmile,
  faListUl,
  faTrophy,
  faEdit,
  faTrash
} from '@fortawesome/free-solid-svg-icons';
import {JournalsService} from '../../../../services/journals.service';
import {BehaviorSubject} from 'rxjs';
import {Journal} from '../../../../models/journal.model';
import {AsyncPipe, DatePipe, NgClass} from '@angular/common';
import {MarkdownPipe} from '../../../../pipes/markdown.pipe';
import {ToastrService} from 'ngx-toastr';
import {MoodService} from '../../../../services/mood.service';

@Component({
  selector: 'app-view-diary-entry',
  imports: [
    RouterLink,
    FaIconComponent,
    AsyncPipe,
    DatePipe,
    MarkdownPipe,
    NgClass
  ],
  templateUrl: './view-diary-entry.component.html',
  styleUrl: './view-diary-entry.component.scss'
})
export class ViewDiaryEntryComponent {

  protected readonly faArrowLeft = faArrowLeft;
  protected readonly faBook = faBook;
  protected readonly faCalendar = faCalendar;
  protected readonly faTag = faTag;
  protected readonly faMapMarkerAlt = faMapMarkerAlt;
  protected readonly faSmile = faSmile;
  protected readonly faListUl = faListUl;
  protected readonly faTrophy = faTrophy;
  protected readonly faEdit = faEdit;
  protected readonly faTrash = faTrash;

  protected entry$ = new BehaviorSubject<Journal>({} as Journal);

  constructor(private readonly route: ActivatedRoute,
              private readonly journalService: JournalsService,
              private readonly router: Router,
              private readonly toastr: ToastrService,
              private readonly moodService: MoodService) {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.journalService.getJournalEntry(id, 'diary').subscribe(res => {
      this.entry$.next(res);
    });
  }

  // Method to get the appropriate mood icon based on the mood value
  getMoodIcon(mood: string) {
    return this.moodService.getMoodIcon(mood);
  }

  // Method to get the label for a given mood
  getMoodLabel(mood: string): string {
    return this.moodService.getMoodLabel(mood);
  }

  // Method to get the color class for a given mood
  getMoodColor(mood: string): string {
    return this.moodService.getMoodColor(mood);
  }

  // Method to edit the current journal entry
  editEntry() {
    const entry = this.entry$.getValue();
    this.router.navigate([`/journals/diary`, entry.id, 'edit']);
  }

  // Method to delete the current journal entry
  deleteEntry() {
    const entry = this.entry$.getValue();
    if (confirm(`Are you sure you want to delete "${entry.title}"?`)) {
      this.journalService.deleteJournalEntry(entry.id, 'diary').subscribe({
        next: () => {
          this.toastr.success('Journal entry deleted');
          this.router.navigate(['/journals']);
        },
        error: () => {
          this.toastr.error('Failed to delete journal entry. Please try again.');
        }
      });
    }
  }
}
