import { Component } from '@angular/core';
import {AsyncPipe} from '@angular/common';
import {
  DynamicTableComponent,
  PageEvent, SortEvent
} from '../../../../common-components/components/dynamic-table/dynamic-table.component';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {faArrowLeft} from '@fortawesome/free-solid-svg-icons';
import {BehaviorSubject, combineLatest, switchMap} from 'rxjs';
import {JournalService} from '../../../services/journal.service';

@Component({
  selector: 'app-user-journal-entries',
  imports: [
    AsyncPipe,
    DynamicTableComponent,
    FaIconComponent,
    RouterLink
  ],
  templateUrl: './user-journal-entries.component.html',
  styleUrl: './user-journal-entries.component.scss'
})
export class UserJournalEntriesComponent {

  protected readonly columns = [
    {
      property: 'title',
      header: 'Title',
      isSortable: true
    },
    {
      property: 'created_at',
      header: 'Created',
      isDate: true,
      isSortable: true,
    },
    {
      property: 'updated_at',
      header: 'Updated',
      isDate: true,
      isSortable: true,
    }
  ];

  private readonly paging$ = new BehaviorSubject<PageEvent>({pageIndex: 0, pageSize: 10});
  protected readonly sorting$ = new BehaviorSubject<SortEvent>({property: 'updated_at', direction: 'desc'});

  protected readonly items$ = combineLatest([this.paging$, this.sorting$])
    .pipe(
      switchMap(([{pageIndex, pageSize}, {property, direction}]) =>
        this.journalService.getEntries(this.userId, pageIndex, pageSize, property ?? 'updated_at', direction ?? 'desc')
      )
    )
  protected readonly faArrowLeft = faArrowLeft;
  private userId: any;

  constructor(private readonly journalService: JournalService,
              private readonly activatedRoute: ActivatedRoute) {
    this.userId = this.activatedRoute.snapshot.params['id'];
  }

  onPageChange($event: PageEvent) {
    this.paging$.next($event);
  }

  onSortChange($event: SortEvent) {
    this.sorting$.next($event);
  }
}
