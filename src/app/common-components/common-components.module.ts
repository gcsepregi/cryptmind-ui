import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DynamicTableComponent } from './components/dynamic-table/dynamic-table.component';
import { ListEditorComponent } from './components/list-editor/list-editor.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    DynamicTableComponent,
    ListEditorComponent
  ],
  exports: [
    DynamicTableComponent,
    ListEditorComponent
  ]
})
export class CommonComponentsModule { }
