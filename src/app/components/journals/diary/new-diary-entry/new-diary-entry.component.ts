import { Component } from '@angular/core';
import {FormBuilder, FormGroup, FormControl, ReactiveFormsModule, Validators, FormsModule} from '@angular/forms';
import {RouterLink, ActivatedRoute, Router} from '@angular/router';
import {JournalsService} from '../../../../services/journals.service';
import {Tag} from '../../../../models/tag.model';
import {ToastrService} from 'ngx-toastr';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {faArrowLeft, faBook, faXmark} from '@fortawesome/free-solid-svg-icons';
import {MarkdownEditorComponent} from '../../../tools/markdown-editor/markdown-editor.component';

@Component({
  selector: 'app-new-diary-entry',
  imports: [
    FontAwesomeModule,
    ReactiveFormsModule,
    RouterLink,
    MarkdownEditorComponent,
    FormsModule
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
  entryId?: string;

  constructor(private fb: FormBuilder,
              private readonly journalService: JournalsService,
              private readonly toastr: ToastrService,
              private readonly route: ActivatedRoute,
              private readonly router: Router) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      entry: ['', Validators.required],
      tagInput: ['']
    });

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.entryId = id;
        this.journalService.getJournalEntry(id, 'diary').subscribe(entry => {
          this.form.patchValue({
            title: entry.title,
            entry: entry.entry
          });
          this.tags = entry.tags ? entry.tags.map((t: any) => t.name || t) : [];
        });
      }
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
      if (this.entryId) {
        this.journalService.updateJournalEntry(this.entryId, 'diary', {
          journal_type: 'diary', entry, title, tags
        }).subscribe({
          next: () => {
            this.toastr.success('Diary entry updated');
            this.router.navigate(['/journals']);
          },
          error: () => {
            this.toastr.error('Failed to update diary entry. Please try again.');
          }
        });
      } else {
        this.journalService.createJournalEntry({
          journal_type: 'diary', entry, title, tags
        }).subscribe({
          next: () => {
            this.toastr.success('Diary entry created');
            this.router.navigate(['/journals']);
          },
          error: () => {
            this.toastr.error('Diary entry failed to create. Please try again.');
          }
        });
      }
      console.log({title, entry, tags});
    }
  }

  entryContentChanged(content: string) {
    this.form.patchValue({entry: content});
  }
}
