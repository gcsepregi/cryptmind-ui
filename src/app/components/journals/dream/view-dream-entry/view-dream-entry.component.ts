import { Component } from '@angular/core';
import {AsyncPipe, DatePipe, NgClass} from "@angular/common";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {
  faArrowLeft,
  faCalendar,
  faMoon,
  faTag,
  faCalendarAlt,
  faSignature,
  faStar,
  faUsers,
  faSmile,
  faEye,
  faMapMarkerAlt,
  faEdit,
  faTrash
} from '@fortawesome/free-solid-svg-icons';
import {JournalsService} from '../../../../services/journals.service';
import {BehaviorSubject} from 'rxjs';
import {Journal} from '../../../../models/journal.model';
import {MarkdownPipe} from '../../../../pipes/markdown.pipe';
import {ToastrService} from 'ngx-toastr';
import {MoodService} from '../../../../services/mood.service';

@Component({
  selector: 'app-view-dream-entry',
  imports: [
    AsyncPipe,
    DatePipe,
    FaIconComponent,
    RouterLink,
    MarkdownPipe,
    NgClass
  ],
  templateUrl: './view-dream-entry.component.html',
  styleUrl: './view-dream-entry.component.scss'
})
export class ViewDreamEntryComponent {

  protected readonly faArrowLeft = faArrowLeft;
  protected readonly faMoon = faMoon;
  protected readonly faCalendar = faCalendar;
  protected readonly faTag = faTag;
  protected readonly faCalendarAlt = faCalendarAlt;
  protected readonly faSignature = faSignature;
  protected readonly faStar = faStar;
  protected readonly faUsers = faUsers;
  protected readonly faSmile = faSmile;
  protected readonly faEye = faEye;
  protected readonly faMapMarkerAlt = faMapMarkerAlt;
  protected readonly faEdit = faEdit;
  protected readonly faTrash = faTrash;

  protected entry$ = new BehaviorSubject<Journal>({} as Journal);

  constructor(private readonly route: ActivatedRoute,
              private readonly journalService: JournalsService,
              private readonly router: Router,
              private readonly toastr: ToastrService,
              private readonly moodService: MoodService) {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.journalService.getJournalEntry(id, 'dream').subscribe(res => {
      this.entry$.next(res);
    });
  }

  // Method to edit the current journal entry
  editEntry() {
    const entry = this.entry$.getValue();
    this.router.navigate([`/journals/dream`, entry.id, 'edit']);
  }

  // Method to delete the current journal entry
  deleteEntry() {
    const entry = this.entry$.getValue();
    if (confirm(`Are you sure you want to delete "${entry.title}"?`)) {
      this.journalService.deleteJournalEntry(entry.id, 'dream').subscribe({
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

  // Helper method to get lucidity level description
  getLucidityDescription(level: number): string {
    switch(level) {
      case 1: return 'Not lucid at all';
      case 2: return 'Slightly lucid';
      case 3: return 'Moderately lucid';
      case 4: return 'Very lucid';
      case 5: return 'Completely lucid';
      default: return 'Unknown';
    }
  }

  // Helper method to get clarity level description
  getClarityDescription(level: number): string {
    switch(level) {
      case 1: return 'Very vague';
      case 2: return 'Somewhat unclear';
      case 3: return 'Moderately clear';
      case 4: return 'Very clear';
      case 5: return 'Crystal clear';
      default: return 'Unknown';
    }
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
}
