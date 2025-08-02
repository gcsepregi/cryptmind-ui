import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';
import {RouterLink, ActivatedRoute, Router} from '@angular/router';
import {JournalsService} from '../../../../services/journals.service';
import {ToastrService} from 'ngx-toastr';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {faArrowLeft, faMoon, faXmark} from '@fortawesome/free-solid-svg-icons';
import {MarkdownEditorComponent} from '../../../tools/markdown-editor/markdown-editor.component';

@Component({
  selector: 'app-new-dream-entry',
  imports: [
    RouterLink,
    FaIconComponent,
    ReactiveFormsModule,
    MarkdownEditorComponent
  ],
  templateUrl: './new-dream-entry.component.html',
  styleUrl: './new-dream-entry.component.scss'
})
export class NewDreamEntryComponent {
  protected readonly faArrowLeft = faArrowLeft;
  protected readonly faMoon = faMoon;
  protected readonly faXmark = faXmark;

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
        this.journalService.getJournalEntry(id, 'dream').subscribe(entry => {
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
        this.journalService.updateJournalEntry(this.entryId, 'dream', {
          journal_type: 'dream', entry, title, tags
        }).subscribe({
          next: () => {
            this.toastr.success('Dream entry updated');
            this.router.navigate(['/journals']);
          },
          error: () => {
            this.toastr.error('Failed to update dream entry. Please try again.');
          }
        });
      } else {
        this.journalService.createJournalEntry({
          journal_type: 'dream', entry, title, tags
        }).subscribe({
          next: () => {
            this.toastr.success('Dream entry created');
            this.router.navigate(['/journals']);
          },
          error: () => {
            this.toastr.error('Dream entry failed to create. Please try again.');
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
