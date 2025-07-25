import { Component } from '@angular/core';
import {FormBuilder, FormGroup, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {JournalsService} from '../../../../services/journals.service';
import {Tag} from '../../../../models/tag.model';
import {ToastrService} from 'ngx-toastr';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {faArrowLeft, faBook, faXmark} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-new-diary-entry',
  imports: [
    FontAwesomeModule,
    ReactiveFormsModule,
    RouterLink
],
  templateUrl: './new-diary-entry.component.html',
  styleUrl: './new-diary-entry.component.scss'
})
export class NewDiaryEntryComponent {
  protected readonly faXmark = faXmark;
  protected readonly faBook = faBook;
  protected readonly faArrowLeft = faArrowLeft;

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
