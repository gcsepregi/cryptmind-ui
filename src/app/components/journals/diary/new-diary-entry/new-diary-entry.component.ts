import { Component } from '@angular/core';
import {ArrowLeftIcon, BookAIcon, LucideAngularModule, XIcon} from 'lucide-angular';
import {FormBuilder, FormGroup, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';

import {RouterLink} from '@angular/router';
import {JournalsService} from '../../../../services/journals.service';
import {Tag} from '../../../../models/tag.model';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-new-diary-entry',
  imports: [
    LucideAngularModule,
    ReactiveFormsModule,
    RouterLink
],
  templateUrl: './new-diary-entry.component.html',
  styleUrl: './new-diary-entry.component.scss'
})
export class NewDiaryEntryComponent {
  protected readonly XIcon = XIcon;
  protected readonly BookAIcon = BookAIcon;
  protected readonly ArrowLeftIcon = ArrowLeftIcon;

  form: FormGroup;
  tags: string[] = [];

  constructor(private fb: FormBuilder,
              private readonly journalService: JournalsService,
              private readonly toastr: ToastrService) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      entry: ['', Validators.required],
      tagInput: ['']
    });
  }

  addTag(event: KeyboardEvent) {
    const input = this.form.get('tagInput');
    const value = input?.value?.trim();
    if ((event.key === 'Enter' || event.key === ',') && value) {
      event.preventDefault();
      if (!this.tags.includes(value)) {
        this.tags.push(value);
      }
      input?.setValue('');
    }
  }

  removeTag(tag: string) {
    this.tags = this.tags.filter(t => t !== tag);
  }

  onSubmit() {
    if (this.form.valid) {
      const {title, entry} = this.form.value;
      const tags = this.tags;
      this.journalService.createJournalEntry({
        journal_type: 'diary', entry, title, tags
      }).subscribe({
        next: () => {
          this.toastr.success('Journal entry created');
        },
        error: () => {
          this.toastr.error('Journal entry failed to create. Please try again.');
        }
      });
      console.log({title, entry, tags});
    }
  }
}
