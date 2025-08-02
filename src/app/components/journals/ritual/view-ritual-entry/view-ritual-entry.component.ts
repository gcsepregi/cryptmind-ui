import { Component } from '@angular/core';
import {AsyncPipe, DatePipe} from "@angular/common";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {ActivatedRoute, RouterLink} from '@angular/router';
import {faArrowLeft, faCalendar, faStar, faTag} from '@fortawesome/free-solid-svg-icons';
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

  protected entry$ = new BehaviorSubject<Journal>({} as Journal);

  constructor(private readonly route: ActivatedRoute,
              private readonly journalService: JournalsService) {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.journalService.getJournalEntry(id, 'ritual').subscribe(res => {
      this.entry$.next(res);
    })

  }

  protected readonly faTag = faTag;
}
