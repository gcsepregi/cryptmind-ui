import { Component } from '@angular/core';
import {AsyncPipe} from '@angular/common';
import {
  DynamicTableComponent,
  PageEvent
} from '../../../../common-components/components/dynamic-table/dynamic-table.component';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {faArrowLeft} from '@fortawesome/free-solid-svg-icons';
import {BehaviorSubject} from 'rxjs';
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
    },
    {
      property: 'created_at',
      header: 'Created',
      isDate: true,
    },
    {
      property: 'updated_at',
      header: 'Updated',
      isDate: true,
    }
  ];
  protected readonly items$ = new BehaviorSubject<{[prop: string]: any}>([]);
  protected readonly faArrowLeft = faArrowLeft;
  private userId: any;

  constructor(private readonly journalService: JournalService,
              private readonly activatedRoute: ActivatedRoute) {
    this.userId = this.activatedRoute.snapshot.params['id'];
    journalService.getEntries(this.userId).subscribe(res => {
      this.items$.next(res)
    })
  }

  onPageChange($event: PageEvent) {
    console.log($event);
    this.journalService.getEntries(this.userId, $event.pageIndex, $event.pageSize).subscribe(res => {
      this.items$.next(res);
    });
  }
}
