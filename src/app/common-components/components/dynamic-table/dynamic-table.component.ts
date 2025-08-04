import {Component, EventEmitter, Input, Output} from '@angular/core';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {RouterLink} from '@angular/router';
import {DatePipe, NgTemplateOutlet} from '@angular/common';
import {faChevronLeft, faChevronRight, faSort, faSortDown, faSortUp} from '@fortawesome/free-solid-svg-icons';
import {BehaviorSubject, combineLatest, Observable, shareReplay, switchMap} from 'rxjs';
import {DynamicTableData} from '../../../admin/models/dynamic-table-data';

type ColumnLink = { prefix: string; suffix: string };

export type SortDirection = 'asc' | 'desc' | null | undefined;
export interface SortEvent { property: string | null; direction: SortDirection }

export interface PageEvent { pageIndex: number; pageSize: number }

export interface TableLoader<T> {
  (
    pageIndex: number,
    pageSize:  number,
    orderBy:   string | undefined,
    direction: string | undefined
  ): Observable<DynamicTableData<T>>;
}

/**
 * Mixin-style base class that provides paging, sorting and single HTTP call
 * behaviour.  Extend it from any component that embeds <app-dynamic-table>.
 */
export abstract class TableComponentBase<T> {

  /** Columns are left for the concrete component to expose */
  abstract columns: any[];

  /** Concrete component supplies the loader in its constructor or ngOnInit */
  protected abstract load(
    pageIndex:  number,
    pageSize:   number,
    orderBy?:   string,
    direction?: string,
  ): Observable<DynamicTableData<T>>;


  /* ---------------- shared reactive state ---------------- */
  private readonly paging$  = new BehaviorSubject<PageEvent>({ pageIndex: 0, pageSize: 10 });
  protected readonly sorting$ = new BehaviorSubject<SortEvent>({ property: null, direction: null });

  /** Public stream consumed by the template */
  protected readonly items$ = combineLatest([this.paging$, this.sorting$]).pipe(
    switchMap(([{ pageIndex, pageSize }, { property, direction }]) =>
      this.load(pageIndex, pageSize, property ?? undefined, direction ?? undefined)
    ),
    shareReplay({ bufferSize: 1, refCount: true })   // <- single HTTP request
  );

  /* ---------------- event handlers for the table ---------------- */
  onPageChange(e: PageEvent) { this.paging$.next(e); }
  onSortChange(e: SortEvent) { this.sorting$.next(e); }
}

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
    isSortable?: boolean;
    icon?: IconDefinition;
    isDate?: boolean;
    isActions?: boolean;
    link?: ColumnLink;
  }> = [];

  @Input() items: T[] = [];

  @Input() actionsTemplate: any = null;

  @Input() sortColumn: string | null | undefined = null;
  @Input() sortDirection: SortDirection = null;
  @Output() sortChange = new EventEmitter<SortEvent>();

  toggleSort(col: string): void {
    let next: SortDirection = 'asc';
    if (this.sortColumn === col) {
      next = this.sortDirection === 'asc' ? 'desc'
        : this.sortDirection === 'desc' ? null
          : 'asc';
    }
    this.sortChange.emit({ property: next ? col : null, direction: next });
  }

  /* icons used in template */
  protected readonly icoSort = faSort;
  protected readonly icoUp   = faSortUp;
  protected readonly icoDown = faSortDown;

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
