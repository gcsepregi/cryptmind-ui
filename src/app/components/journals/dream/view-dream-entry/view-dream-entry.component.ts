import { Component } from '@angular/core';
import {AsyncPipe, DatePipe} from "@angular/common";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {ActivatedRoute, RouterLink} from '@angular/router';
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
  faFrown,
  faAngry,
  faMeh,
  faLaugh,
  faSadTear,
  faGrinHearts
} from '@fortawesome/free-solid-svg-icons';
import {JournalsService} from '../../../../services/journals.service';
import {BehaviorSubject} from 'rxjs';
import {Journal} from '../../../../models/journal.model';
import {MarkdownPipe} from '../../../../pipes/markdown.pipe';

@Component({
  selector: 'app-view-dream-entry',
  imports: [
    AsyncPipe,
    DatePipe,
    FaIconComponent,
    RouterLink,
    MarkdownPipe,
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
  protected readonly faFrown = faFrown;
  protected readonly faAngry = faAngry;
  protected readonly faMeh = faMeh;
  protected readonly faLaugh = faLaugh;
  protected readonly faSadTear = faSadTear;
  protected readonly faGrinHearts = faGrinHearts;

  // Define mood options mapping
  private moodIcons = {
    'love': this.faGrinHearts,
    'happy': this.faLaugh,
    'good': this.faSmile,
    'neutral': this.faMeh,
    'sad': this.faFrown,
    'very-sad': this.faSadTear,
    'angry': this.faAngry
  };

  protected entry$ = new BehaviorSubject<Journal>({} as Journal);

  constructor(private readonly route: ActivatedRoute,
              private readonly journalService: JournalsService) {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.journalService.getJournalEntry(id, 'dream').subscribe(res => {
      this.entry$.next(res);
    });
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
    return this.moodIcons[mood as keyof typeof this.moodIcons] || this.faSmile;
  }
}
