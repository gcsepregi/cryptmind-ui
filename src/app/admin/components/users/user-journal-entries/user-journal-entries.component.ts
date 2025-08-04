import { Component } from '@angular/core';
import {AsyncPipe} from '@angular/common';
import {
  DynamicTableComponent, TableComponentBase
} from '../../../../common-components/components/dynamic-table/dynamic-table.component';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {faArrowLeft} from '@fortawesome/free-solid-svg-icons';
import {Observable} from 'rxjs';
import {JournalService} from '../../../services/journal.service';
import {Journal} from '../../../models/journal';
import {DynamicTableData} from '../../../models/dynamic-table-data';

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
export class UserJournalEntriesComponent extends TableComponentBase<Journal> {

  override columns = [
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

  private readonly userId: any;

  constructor(private readonly journalService: JournalService,
              private readonly activatedRoute: ActivatedRoute) {
    super();
    this.userId = this.activatedRoute.snapshot.params['id'];
  }

  protected override load(pageIndex: number, pageSize: number, orderBy?: string, direction?: string): Observable<DynamicTableData<Journal>> {
    return this.journalService.getEntries(this.userId, pageIndex, pageSize, orderBy, direction);
  }

  protected readonly faArrowLeft = faArrowLeft;
}
