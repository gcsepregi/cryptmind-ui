import { Component } from '@angular/core';
import {AsyncPipe, DatePipe} from "@angular/common";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {ActivatedRoute, RouterLink} from '@angular/router';
import {
  faArrowLeft,
  faCalendar,
  faStar,
  faTag,
  faCalendarAlt,
  faTools,
  faPray,
  faPenFancy,
  faCheckCircle,
  faClock,
  faSmile,
  faMapMarkerAlt,
  faFrown,
  faAngry,
  faMeh,
  faLaugh,
  faSadTear,
  faGrinHearts
} from '@fortawesome/free-solid-svg-icons';
import {BehaviorSubject} from 'rxjs';
import {Journal} from '../../../../models/journal.model';
import {JournalsService} from '../../../../services/journals.service';
import {MarkdownPipe} from '../../../../pipes/markdown.pipe';

@Component({
  selector: 'app-view-ritual-entry',
  imports: [
    AsyncPipe,
    DatePipe,
    FaIconComponent,
    RouterLink,
    MarkdownPipe
  ],
  templateUrl: './view-ritual-entry.component.html',
  styleUrl: './view-ritual-entry.component.scss'
})
export class ViewRitualEntryComponent {

  protected readonly faArrowLeft = faArrowLeft;
  protected readonly faStar = faStar;
  protected readonly faCalendar = faCalendar;
  protected readonly faTag = faTag;
  protected readonly faCalendarAlt = faCalendarAlt;
  protected readonly faTools = faTools;
  protected readonly faPray = faPray;
  protected readonly faPenFancy = faPenFancy;
  protected readonly faCheckCircle = faCheckCircle;
  protected readonly faClock = faClock;
  protected readonly faSmile = faSmile;
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
    this.journalService.getJournalEntry(id, 'ritual').subscribe(res => {
      this.entry$.next(res);
    });
  }

  // Method to get the appropriate mood icon based on the mood value
  getMoodIcon(mood: string) {
    return this.moodIcons[mood as keyof typeof this.moodIcons] || this.faSmile;
  }
}
