import {Component, EventEmitter, Input, Output} from '@angular/core';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {RouterLink} from '@angular/router';
import {DatePipe, NgTemplateOutlet} from '@angular/common';
import {faChevronLeft, faChevronRight} from '@fortawesome/free-solid-svg-icons';

type ColumnLink = { prefix: string; suffix: string };

export interface PageEvent { pageIndex: number; pageSize: number }

@Component({
  selector: 'app-dynamic-table',
  templateUrl: './dynamic-table.component.html',
  styleUrl: './dynamic-table.component.scss',
  standalone: true,
  imports: [
    FaIconComponent,
    RouterLink,
    DatePipe,
    NgTemplateOutlet,
    // Add your needed imports here (like FaIconComponent, DatePipe, RouterLink, etc.)
  ]
})
export class DynamicTableComponent<T extends { [prop: string]: any }> {
  @Input() columns: Array<{
    property: string;
    header: string;
    isDecorated?: boolean;
    icon?: IconDefinition;
    isDate?: boolean;
    isActions?: boolean;
    link?: ColumnLink;
  }> = [];

  @Input() items: T[] = [];

  @Input() actionsTemplate: any = null;

  /* ----------- paging ----------- */
  /** current page index (zero-based) */
  @Input() pageIndex = 0;
  /** rows per page */
  @Input() pageSize = 10;
  /** total rows across all pages */
  @Input() totalItems = 0;

  /** emitted whenever the user asks for another page/size */
  @Output() pageChange = new EventEmitter<PageEvent>();

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalItems / this.pageSize));
  }

  /* ---------- convenience getters ---------- */
  get rangeStart(): number {           // “from” record number
    return this.totalItems ? this.pageIndex * this.pageSize + 1 : 0;
  }
  get rangeEnd(): number {             // “to” record number
    return Math.min(this.totalItems, (this.pageIndex + 1) * this.pageSize);
  }

  goToPage(page: number): void {
    if (page < 0 || page >= this.totalPages || page === this.pageIndex) return;
    this.pageChange.emit({ pageIndex: page, pageSize: this.pageSize });
  }

  changeSize(size: number): void {
    if (size === this.pageSize) return;
    this.pageChange.emit({ pageIndex: 0, pageSize: size });
  }

  protected readonly faChevronLeft = faChevronLeft;
  protected readonly faChevronRight = faChevronRight;
}
