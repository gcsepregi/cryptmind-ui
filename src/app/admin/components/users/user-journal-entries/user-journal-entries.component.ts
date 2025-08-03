import { Component } from '@angular/core';
import {AsyncPipe} from '@angular/common';
import {DynamicTableComponent} from '../../../../common-components/components/dynamic-table/dynamic-table.component';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {RouterLink} from '@angular/router';
import {faArrowLeft} from '@fortawesome/free-solid-svg-icons';
import {BehaviorSubject} from 'rxjs';

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

  protected readonly columns = [];
  protected readonly items$ = new BehaviorSubject<{[prop: string]: any}[]>([]);
  protected readonly faArrowLeft = faArrowLeft;
}
