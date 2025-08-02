import { Component } from '@angular/core';
import {AsyncPipe, DatePipe} from "@angular/common";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {ActivatedRoute, RouterLink} from '@angular/router';
import {faArrowLeft, faCalendar, faMoon, faTag} from '@fortawesome/free-solid-svg-icons';
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
    MarkdownPipe
  ],
  templateUrl: './view-dream-entry.component.html',
  styleUrl: './view-dream-entry.component.scss'
})
export class ViewDreamEntryComponent {

  protected readonly faArrowLeft = faArrowLeft;
  protected readonly faMoon = faMoon;
  protected readonly faCalendar = faCalendar;
  protected readonly faTag = faTag;

  protected entry$ = new BehaviorSubject<Journal>({} as Journal);

  constructor(private readonly route: ActivatedRoute,
              private readonly journalService: JournalsService) {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.journalService.getJournalEntry(id, 'dream').subscribe(res => {
      this.entry$.next(res);
    })
  }
}
