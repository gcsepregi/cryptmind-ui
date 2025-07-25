import { Component } from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {faArrowLeft, faStar, faXmark} from '@fortawesome/free-solid-svg-icons';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {JournalsService} from '../../../../services/journals.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-new-ritual-entry',
  imports: [
    RouterLink,
    FaIconComponent,
    ReactiveFormsModule
  ],
  templateUrl: './new-ritual-entry.component.html',
  styleUrl: './new-ritual-entry.component.scss'
})
export class NewRitualEntryComponent {
  protected readonly faArrowLeft = faArrowLeft;
  protected readonly faStar = faStar;
  protected readonly faXmark = faXmark;

  form: FormGroup;
  tags: string[] = [];

  constructor(private fb: FormBuilder,
              private readonly journalService: JournalsService,
              private readonly toastr: ToastrService,
              private readonly router: Router,) {
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
        journal_type: 'ritual', entry, title, tags
      }).subscribe({
        next: () => {
          this.toastr.success('Journal entry created');
          this.router.navigate(['/journals']).then(() => {
          });
        },
        error: () => {
          this.toastr.error('Journal entry failed to create. Please try again.');
        }
      });
    }
  }
}
