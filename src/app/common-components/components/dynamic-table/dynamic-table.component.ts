import { Component, Input } from '@angular/core';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {RouterLink} from '@angular/router';
import {DatePipe, NgTemplateOutlet} from '@angular/common';

type ColumnLink = { prefix: string; suffix: string };

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
}
