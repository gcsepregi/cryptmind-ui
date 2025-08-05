import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-list-editor',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule
  ],
  templateUrl: './list-editor.component.html',
  styleUrl: './list-editor.component.scss'
})
export class ListEditorComponent {
  @Input() formArray!: FormArray;
  @Input() label: string = 'Items';
  @Input() icon: IconDefinition | null = null;
  @Input() placeholder: string = 'Add item...';

  @Output() itemAdded = new EventEmitter<string>();
  @Output() itemRemoved = new EventEmitter<number>();

  inputValue: string = '';

  // Icons
  protected readonly faPlus = faPlus;
  protected readonly faXmark = faXmark;

  constructor(private fb: FormBuilder) {}

  addItem(): void {
    if (this.inputValue.trim()) {
      this.formArray.push(this.fb.control(this.inputValue.trim()));
      this.itemAdded.emit(this.inputValue.trim());
      this.inputValue = '';
    }
  }

  removeItem(index: number): void {
    this.formArray.removeAt(index);
    this.itemRemoved.emit(index);
  }
}
