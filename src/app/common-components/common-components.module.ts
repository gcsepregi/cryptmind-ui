import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DynamicTableComponent} from './components/dynamic-table/dynamic-table.component';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    DynamicTableComponent
  ],
  exports: [
    DynamicTableComponent
  ]
})
export class CommonComponentsModule { }
