import { Component } from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {faArrowLeft, faBook, faCalendar, faTag} from '@fortawesome/free-solid-svg-icons';
import {JournalsService} from '../../../../services/journals.service';
import {BehaviorSubject} from 'rxjs';
import {Journal} from '../../../../models/journal.model';
import {AsyncPipe, DatePipe} from '@angular/common';
import {MarkdownPipe} from '../../../../pipes/markdown.pipe';

@Component({
  selector: 'app-view-diary-entry',
  imports: [
    RouterLink,
    FaIconComponent,
    AsyncPipe,
    DatePipe,
    MarkdownPipe
  ],
  templateUrl: './view-diary-entry.component.html',
  styleUrl: './view-diary-entry.component.scss'
})
export class ViewDiaryEntryComponent {

  protected readonly faArrowLeft = faArrowLeft;
  protected readonly faBook = faBook;
  protected readonly faCalendar = faCalendar;
  protected readonly faTag = faTag;

  protected entry$ = new BehaviorSubject<Journal>({} as Journal);

  constructor(private readonly route: ActivatedRoute,
              private readonly journalService: JournalsService) {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.journalService.getJournalEntry(id, 'diary').subscribe(res => {
      this.entry$.next(res);
    })

  }
}
